#!/bin/bash

# 设置初始端口号
PORT=8000

# 检查端口是否可用并递增直到找到可用端口
check_port() {
    while netstat -tuln | grep ":$PORT " >/dev/null 2>&1; do
        echo "端口 $PORT 已被占用，尝试下一个端口..."
        PORT=$((PORT + 1))
    done
    echo "将使用端口 $PORT"
}

echo "启动Live2D Demo本地服务器..."
check_port
echo "请访问 http://localhost:$PORT 查看演示页面"
echo "按Ctrl+C停止服务器"

# 尝试使用Python 3
if command -v python3 &>/dev/null; then
    python3 -m http.server $PORT
# 回退到Python 2
elif command -v python &>/dev/null; then
    python -m SimpleHTTPServer $PORT
# 如果都没有安装Python
else
    echo "错误: 未找到Python。请安装Python或使用其他HTTP服务器。"
    exit 1
fi 