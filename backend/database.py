# database.py
import sqlite3
import os

DB_NAME = "songs.db"

def get_connection():
    """获取数据库连接"""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row  # 方便后续以字典形式获取数据
    return conn

def init_db():
    """初始化数据库：创建表并插入示例数据"""
    if os.path.exists(DB_NAME):
        os.remove(DB_NAME)

    conn = get_connection()
    cur = conn.cursor()
    
    # 创建 songs 表，包含一些基本字段
    cur.execute("""
    CREATE TABLE songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        album TEXT,
        genre TEXT,        -- 风格标签: "Pop", "Rock", "Hip-Hop", ...
        year INTEGER,
        meta_data TEXT     -- 可用于存储更多信息(JSON字符串)等
    )
    """)

    # 插入一些示例歌曲数据
    example_songs = [
        ("Shape of You", "Ed Sheeran", "Divide", "Pop", 2017, '{"duration": "3:53", "producer": "Steve Mac"}'),
        ("Billie Jean", "Michael Jackson", "Thriller", "Pop", 1982, '{"duration": "4:54"}'),
        ("Hotel California", "Eagles", "Hotel California", "Rock", 1977, '{"duration": "6:30"}'),
        ("Imagine", "John Lennon", "Imagine", "Rock", 1971, '{"duration": "3:07"}'),
        ("Lose Yourself", "Eminem", "8 Mile Soundtrack", "Hip-Hop", 2002, '{"duration": "5:20"}'),
    ]

    cur.executemany("""
    INSERT INTO songs (title, artist, album, genre, year, meta_data)
    VALUES (?, ?, ?, ?, ?, ?)
    """, example_songs)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("数据库初始化完成。")
