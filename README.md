# 兔福音乐清单 (Tofu Music List)

## 项目简介

兔福音乐清单是一个集成了音乐列表管理、用户互动和Live2D模型展示的Web应用。该项目包含前端React应用、后端Flask API和Live2D模型演示组件，为用户提供了一个互动性强、视觉效果丰富的音乐分享平台。

## 功能特点

### 核心功能
- 🎵 **音乐列表管理**：浏览、添加、编辑和删除音乐
- 👤 **用户账户系统**：注册、登录、权限管理
- 🎁 **抽奖系统**：互动抽奖功能
- 💬 **棉花糖留言**：用户互动留言功能
- 🔍 **管理员后台**：用户管理和内容审核

### 特色亮点
- 🐰 **Live2D模型集成**：交互式JK兔子Live2D模型展示
- 🌸 **樱花特效**：美观的视觉效果
- 📱 **响应式设计**：适配不同设备尺寸

## 技术栈

### 前端
- React.js
- Ant Design UI组件库
- React Router用于路由管理
- Axios用于API请求
- Live2D模型渲染技术

### 后端
- Flask (Python)
- SQLite/PostgreSQL数据库
- Flask-CORS用于跨域资源共享
- Werkzeug用于文件处理

## 项目结构

```
tofu-music-list/
├── frontend/               # React前端应用
│   ├── src/                # 源代码
│   ├── public/             # 静态资源
│   └── package.json        # 依赖配置
│
├── backend/                # Flask后端API
│   ├── app.py              # 主应用文件
│   ├── database.py         # 数据库操作
│   ├── config.py           # 配置文件
│   ├── routes/             # API路由
│   └── requirements.txt    # Python依赖
│
└── live2d-demo/            # Live2D模型演示
    ├── index.html          # 演示页面
    ├── live2d.js           # Live2D核心脚本
    ├── live2d-helper.js    # 辅助脚本
    └── model/              # 模型文件
```

## 安装与部署

### 前端

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 开发模式运行
npm start

# 构建生产版本
npm run build
```

### 后端

```bash
# 进入后端目录
cd backend

# 创建虚拟环境（推荐）
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑.env文件设置必要的环境变量

# 运行应用
python app.py
```

### Live2D演示

```bash
# 进入Live2D演示目录
cd live2d-demo

# 使用简单的HTTP服务器运行
python -m http.server
# 或使用提供的脚本
./start.sh
```

## 使用指南

1. 启动后端服务器
2. 启动前端开发服务器或部署构建版本
3. 访问应用（默认为 http://localhost:3000）
4. 注册账户并登录
5. 浏览音乐列表、参与互动功能

## 开发者指南

- 前端开发：修改`frontend/src`目录下的React组件
- 后端API开发：在`backend/app.py`或`backend/routes/`中添加新的API端点
- Live2D模型自定义：修改`live2d-demo`目录下的相关文件

## 许可证

本项目采用MIT许可证。详情请参阅LICENSE文件。

## 贡献指南

欢迎提交问题报告和功能请求。如果您想贡献代码，请先创建issue讨论您的想法。

## 联系方式

如有问题或建议，请通过GitHub Issues与我们联系。 