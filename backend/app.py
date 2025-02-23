import sqlite3
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from database import get_connection, init_db

app = Flask(__name__)
app.config["SECRET_KEY"] = "mysecretkey"
CORS(app, supports_credentials=True)

# 注意: init_db() 里会调用 create_tables() 并插入示例数据
init_db()

def create_users_table_and_seed():
    """
    1) 创建 users 表
    2) 默认插入一个管理员 admin/admin123
    """
    conn = get_connection()
    cur = conn.cursor()
    # 确保 users 表存在
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            bilibili_uid TEXT,
            is_admin INTEGER DEFAULT 0
        )
    """)
    conn.commit()

    # 检查是否已存在 admin 用户，没有则插入
    cur.execute("SELECT id FROM users WHERE username = ?", ("admin",))
    row = cur.fetchone()
    if not row:
        # 插入默认管理员
        cur.execute("""
            INSERT INTO users (username, password, bilibili_uid, is_admin)
            VALUES (?, ?, ?, ?)
        """, ("tofu", "y10086Y+1s", "3915536", 1))
        cur.execute("""
            INSERT INTO users (username, password, bilibili_uid, is_admin)
            VALUES (?, ?, ?, ?)
        """, ("xiaotu", "y10086Y+1s", "3915536", 1))
        conn.commit()

    conn.close()

# 你可以在 init_db() 内部或之后调用它
create_users_table_and_seed()


@app.route("/api/login", methods=["POST"])
def login():
    """
    通过数据库验证用户
    前端提交 { username, password }
    - 如果匹配, session["is_admin"], session["username"] 写入
    - 否则401
    """
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"message": "用户名和密码不能为空"}), 400

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, password, is_admin FROM users WHERE username = ?", (username,))
    row = cur.fetchone()
    conn.close()

    if not row:
        return jsonify({"message": "用户不存在或密码错误"}), 401

    db_password = row["password"]
    db_is_admin = row["is_admin"]

    if db_password != password:
        return jsonify({"message": "用户不存在或密码错误"}), 401

    # 登录成功
    session["username"] = username
    session["is_admin"] = bool(db_is_admin)

    return jsonify({
        "message": "登录成功",
        "is_admin": bool(db_is_admin),
        "username": username
    }), 200


@app.route("/api/logout", methods=["POST"])
def logout():
    """
    注销: 清除 session
    """
    session.clear()
    return jsonify({"message": "Logged out"}), 200


@app.route("/api/register", methods=["POST"])
def register():
    """
    注册新用户: username, password, bilibili_uid(可选)
    is_admin 默认为 0
    """
    data = request.get_json() or {}
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()
    bilibili_uid = (data.get("bilibili_uid") or "").strip()

    if not username:
        return jsonify({"message": "用户名不能为空"}), 400
    if not password:
        return jsonify({"message": "密码不能为空"}), 400

    if bilibili_uid and not bilibili_uid.isdigit():
        return jsonify({"message": "B站UID必须是数字"}), 400

    conn = get_connection()
    cur = conn.cursor()
    # 检测重名
    cur.execute("SELECT 1 FROM users WHERE username = ?", (username,))
    row = cur.fetchone()
    if row:
        conn.close()
        return jsonify({"message": f"用户名 '{username}' 已被占用"}), 409

    # 插入用户(默认 is_admin=0)
    try:
        cur.execute("""
            INSERT INTO users (username, password, bilibili_uid, is_admin)
            VALUES (?, ?, ?, 0)
        """, (username, password, bilibili_uid))
        conn.commit()
    except sqlite3.Error as e:
        conn.close()
        print("Register error:", e)
        return jsonify({"message": "服务器错误"}), 500

    conn.close()
    return jsonify({"message": "注册成功"}), 201


@app.route("/api/check_auth", methods=["GET"])
def check_auth():
    """
    前端可用来检测登录状态:
    返回 is_admin, username
    """
    return jsonify({
        "is_admin": bool(session.get("is_admin", False)),
        "username": session.get("username", None)
    }), 200


# ========== 管理员专属 API：列出用户、重置密码、切换管理员 ==========

@app.route("/api/users", methods=["GET"])
def list_users():
    """
    管理员: 列出所有用户
    返回: [ {id, username, is_admin, bilibili_uid}, ... ]
    """
    if not session.get("is_admin"):
        return jsonify({"message": "无管理员权限"}), 403

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, username, is_admin, bilibili_uid FROM users")
    rows = cur.fetchall()
    conn.close()

    users = []
    for r in rows:
        users.append({
            "id": r["id"],
            "username": r["username"],
            "is_admin": bool(r["is_admin"]),
            "bilibili_uid": r["bilibili_uid"]
        })
    return jsonify(users), 200


@app.route("/api/users/<int:user_id>/reset_password", methods=["POST"])
def reset_password(user_id):
    """
    管理员: 将指定用户密码重置为 'xiaotu123'
    """
    if not session.get("is_admin"):
        return jsonify({"message": "无管理员权限"}), 403

    conn = get_connection()
    cur = conn.cursor()
    # 检查用户是否存在
    cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"message": "用户不存在"}), 404

    # 重置密码
    cur.execute("UPDATE users SET password = ? WHERE id = ?", ("xiaotu123", user_id))
    conn.commit()
    conn.close()

    return jsonify({"message": f"用户 {user_id} 密码已重置为 'xiaotu123'"}), 200

@app.route("/api/users/<int:user_id>/toggle_admin", methods=["POST"])
def toggle_admin(user_id):
    """
    管理员: 切换用户的 is_admin 值(0->1或1->0)
    但不能把自己从 admin 变成非 admin
    """
    if not session.get("is_admin"):
        return jsonify({"message": "无管理员权限"}), 403

    # 获取当前用户信息
    current_user = session.get("username", None)
    if not current_user:
        return jsonify({"message": "请先登录"}), 401

    conn = get_connection()
    cur = conn.cursor()

    # 查出操作目标用户
    cur.execute("SELECT id, username, is_admin FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"message": "用户不存在"}), 404

    target_id = row["id"]
    target_username = row["username"]
    current_val = row["is_admin"]

    # 查出当前登录用户的数据库记录, 以拿到自己的 id
    cur.execute("SELECT id, is_admin FROM users WHERE username = ?", (current_user,))
    row2 = cur.fetchone()
    if not row2:
        conn.close()
        return jsonify({"message": "当前登录用户不存在"}), 401

    current_login_id = row2["id"]
    # is_admin = row2["is_admin"]  # 用不着

    # 如果是自我降级(当前用户ID == 目标用户ID && 目标用户当前是 admin && 准备改成非admin)
    if current_login_id == target_id and current_val == 1:
        conn.close()
        return jsonify({"message": "不允许将自己从管理员变为普通用户"}), 400

    # 切换
    new_val = 1 if current_val == 0 else 0
    cur.execute("UPDATE users SET is_admin = ? WHERE id = ?", (new_val, target_id))
    conn.commit()
    conn.close()

    return jsonify({
        "message": f"用户 {target_username} 的管理员权限已变更",
        "is_admin": bool(new_val)
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
