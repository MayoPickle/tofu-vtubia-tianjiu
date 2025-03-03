#!/usr/bin/env python
# main.py - 应用入口点
import os
from dotenv import load_dotenv
from app import create_app

# 加载环境变量
load_dotenv()

# 创建应用实例
app = create_app()

if __name__ == "__main__":
    # 从环境变量获取主机和端口，如果未设置则使用默认值
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    
    # 启动应用
    app.run(host=host, port=port, debug=debug) 