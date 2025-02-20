# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_connection, init_db

app = Flask(__name__)
CORS(app)

# 启动时初始化数据库 (仅演示，生产环境慎用)
init_db()


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

    # 删除
    cur.execute("DELETE FROM songs WHERE id = ?", (song_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": f"Song {song_id} deleted"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
