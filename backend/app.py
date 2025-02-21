# app.py
import sqlite3
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from database import get_connection, init_db

app = Flask(__name__)
# 为了示例，SECRET_KEY直接写这里。生产环境应改成安全随机值并放ENV
app.config["SECRET_KEY"] = "mysecretkey"

# 允许跨域，并允许携带cookie（如果用前端session需要）
CORS(app, supports_credentials=True)

init_db()


@app.route("/api/login", methods=["POST"])
def login():
    """
    从数据库检索用户信息并验证密码：
      1. 前端提交 { username, password }
      2. 在 users 表查找该用户
      3. 如果用户不存在或密码不匹配 => 401
      4. 否则将 is_admin/username 写入 session 并返回登录成功
    """
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"message": "用户名和密码不能为空"}), 400

    # 查询数据库
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT password, is_admin FROM users WHERE username = ?", (username,))
    row = cur.fetchone()
    conn.close()

    # 用户不存在
    if not row:
        return jsonify({"message": "用户不存在或密码错误"}), 401

    db_password, is_admin = row["password"], row["is_admin"]

    # 密码不匹配（这里还没做哈希，纯明文对比）
    if db_password != password:
        return jsonify({"message": "用户不存在或密码错误"}), 401

    # 登陆成功 => session 里保存
    session["is_admin"] = bool(is_admin)
    session["username"] = username

    return jsonify({
        "message": "登录成功",
        "is_admin": bool(is_admin),
        "username": username
    }), 200


@app.route("/api/logout", methods=["POST"])
def logout():
    """
    注销: 清除 session["is_admin"]
    """
    session.pop("is_admin", None)
    return jsonify({"message": "Logged out"}), 200


@app.route("/api/register", methods=["POST"])
def register():
    """
    注册新用户
    必填: username, password
    可选: bilibili_uid(纯数字)
    检查 username 重名
    """
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()
    bilibili_uid = data.get("bilibili_uid", "").strip()

    # 基础检查
    if not username:
        return jsonify({"message": "用户名不能为空"}), 400
    if not password:
        return jsonify({"message": "密码不能为空"}), 400

    # 如果填了UID, 检查是否纯数字
    if bilibili_uid and not bilibili_uid.isdigit():
        return jsonify({"message": "B站UID必须是数字"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor()
        # 检测重名
        cur.execute("SELECT 1 FROM users WHERE username = ?", (username,))
        row = cur.fetchone()
        if row:
            return jsonify({"message": f"用户名 '{username}' 已被占用"}), 409

        # 插入用户(默认 is_admin=0)
        cur.execute("""
            INSERT INTO users (username, password, bilibili_uid, is_admin)
            VALUES (?, ?, ?, 0)
        """, (username, password, bilibili_uid))
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        print("Register error:", e)
        return jsonify({"message": "服务器错误"}), 500

    return jsonify({"message": "注册成功"}), 201

@app.route("/api/check_auth", methods=["GET"])
def check_auth():
    """
    返回当前会话的管理员信息 + 用户名
    如果 session 中 is_admin = True，则返回 is_admin=True，否则False
    如果已经登录, session 里可能还会存 username
    """
    is_admin = bool(session.get("is_admin", False))
    username = session.get("username", None)
    return jsonify({
        "is_admin": is_admin,
        "username": username
    }), 200


@app.route("/api/songs", methods=["GET"])
def get_songs():
    """
    获取所有歌曲或根据关键字搜索歌曲
    /api/songs?search=xxx
    """
    search_query = request.args.get("search", "").strip()
    conn = get_connection()
    cur = conn.cursor()

    if search_query:
        cur.execute("""
            SELECT * FROM songs
            WHERE title LIKE ? OR artist LIKE ?
        """, (f"%{search_query}%", f"%{search_query}%"))
    else:
        cur.execute("SELECT * FROM songs")

    rows = cur.fetchall()
    conn.close()

    songs = []
    for row in rows:
        songs.append({
            "id": row["id"],
            "title": row["title"],
            "artist": row["artist"],
            "album": row["album"],
            "genre": row["genre"],
            "year": row["year"],
            "meta_data": row["meta_data"]
        })
    return jsonify(songs), 200


@app.route("/api/songs/<int:song_id>", methods=["GET"])
def get_song_by_id(song_id):
    """
    获取单首歌曲信息
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM songs WHERE id = ?", (song_id,))
    row = cur.fetchone()
    conn.close()

    if row:
        song = {
            "id": row["id"],
            "title": row["title"],
            "artist": row["artist"],
            "album": row["album"],
            "genre": row["genre"],
            "year": row["year"],
            "meta_data": row["meta_data"]
        }
        return jsonify(song), 200
    else:
        return jsonify({"message": "Song not found"}), 404


@app.route("/api/songs", methods=["POST"])
def create_song():
    """
    创建新歌曲 (POST)
    前端需在 body 中传入 JSON: 
    { title, artist, album, genre, year, meta_data }
    """
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data"}), 400
    
    if not session.get("is_admin"):
        return jsonify({"message": "Forbidden"}), 403

    title = data.get("title")
    artist = data.get("artist")
    album = data.get("album", "")
    genre = data.get("genre", "")
    year = data.get("year", None)
    meta_data = data.get("meta_data", "")

    if not title or not artist:
        return jsonify({"message": "title and artist are required"}), 400

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO songs (title, artist, album, genre, year, meta_data)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (title, artist, album, genre, year, meta_data))
    conn.commit()
    new_id = cur.lastrowid
    conn.close()

    return jsonify({"message": "Song created", "id": new_id}), 201


@app.route("/api/songs/<int:song_id>", methods=["PUT"])
def update_song(song_id):
    """
    编辑歌曲 (PUT)
    前端需在 body 中传入 JSON: 
    { title, artist, album, genre, year, meta_data }
    """
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data"}), 400
    
    if not session.get("is_admin"):
        return jsonify({"message": "Forbidden"}), 403

    title = data.get("title")
    artist = data.get("artist")
    album = data.get("album", "")
    genre = data.get("genre", "")
    year = data.get("year", None)
    meta_data = data.get("meta_data", "")

    if not title or not artist:
        return jsonify({"message": "title and artist are required"}), 400

    conn = get_connection()
    cur = conn.cursor()
    # 先检查这首歌是否存在
    cur.execute("SELECT * FROM songs WHERE id = ?", (song_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"message": "Song not found"}), 404

    # 执行更新
    cur.execute("""
        UPDATE songs
        SET title = ?, artist = ?, album = ?, genre = ?, year = ?, meta_data = ?
        WHERE id = ?
    """, (title, artist, album, genre, year, meta_data, song_id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Song updated"}), 200


@app.route("/api/songs/<int:song_id>", methods=["DELETE"])
def delete_song(song_id):
    """
    删除歌曲 (DELETE)
    """
    conn = get_connection()
    cur = conn.cursor()
    # 先检查是否存在
    cur.execute("SELECT * FROM songs WHERE id = ?", (song_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"message": "Song not found"}), 404
    
    if not session.get("is_admin"):
        return jsonify({"message": "Forbidden"}), 403

    # 删除
    cur.execute("DELETE FROM songs WHERE id = ?", (song_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": f"Song {song_id} deleted"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
