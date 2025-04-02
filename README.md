# VUP乌托邦（VUP Utopia）

<div align="center">
  <img src="frontend/public/assets/logo.png" alt="VUP乌托邦标志" width="200" />
  <p>🎮 虚拟主播互动平台 | 🎵 音乐清单管理 | 🎁 粉丝互动系统</p>
</div>

## 📖 项目简介

VUP乌托邦是一个专为虚拟主播（VTuber）打造的互动平台，集成了音乐列表管理、粉丝互动和Live2D模型展示等功能。该项目旨在为虚拟主播提供一站式的直播辅助工具，增强与观众的互动体验，提升直播效果。平台包含前端React应用、后端Flask API和Live2D模型展示组件，为虚拟主播及其粉丝提供了一个互动性强、视觉效果丰富的交流空间。

## ✨ 功能特点

### 🎬 虚拟主播功能
- 🐰 **Live2D模型集成**：响应式交互的Live2D模型展示，支持眼球追踪和头部转动
- 🎙️ **直播信息管理**：管理直播时间表、公告和特别活动
- 👑 **舰长管理系统**：追踪和管理舰长（高级会员）信息
- 📊 **数据统计分析**：提供直播数据和观众互动的基本分析

### 🎵 音乐功能
- 📋 **歌单管理**：浏览、添加、编辑和删除点歌列表
- 🏷️ **标签分类系统**：通过风格、情感等标签对歌曲进行分类
- 🔍 **高级搜索**：多条件组合搜索功能
- 🔄 **歌曲状态追踪**：显示歌曲的播放状态和队列位置

### 👥 用户互动系统
- 👤 **用户账户系统**：支持注册、登录和权限管理
- 🎁 **抽奖系统**：互动式抽奖功能，提升直播参与感
- 💬 **棉花糖留言**：粉丝可提交问题，主播可选择回答的留言板功能
- 📱 **全平台适配**：支持PC和移动设备，随时随地参与互动

### 🌟 特色亮点
- 🧩 **模块化设计**：可根据需求自由组合不同功能模块
- 🌸 **樱花特效**：美观的视觉效果增强直播间氛围
- 🔒 **安全管理**：管理员后台提供内容审核和用户管理
- 🌐 **多平台整合**：支持与B站、YouTube等平台的基础数据对接

## 🛠️ 技术栈

### 前端
- **React.js** - 用户界面构建
- **Ant Design** - UI组件库，提供美观的界面元素
- **React Router** - 页面路由管理
- **Axios** - API请求处理
- **Pixi.js & Live2D** - 模型渲染技术

### 后端
- **Flask (Python)** - 轻量级后端框架
- **SQLite/PostgreSQL** - 数据存储
- **Flask-CORS** - 跨域资源共享
- **psycopg2** - PostgreSQL数据库连接
- **Werkzeug** - 通用Web应用工具集

## 🗂️ 项目结构

```
vup-utopia/
├── frontend/               # React前端应用
│   ├── src/                # 源代码
│   │   ├── components/     # 组件库
│   │   ├── pages/          # 页面
│   │   └── utils/          # 实用工具
│   ├── public/             # 静态资源
│   │   └── assets/         # 图片、模型等资源
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
    └── model/              # 模型文件
```

## 🚀 安装与部署

### Docker快速部署（推荐）

```bash
# 使用Docker Compose启动所有服务
docker-compose up -d

# 查看各服务状态
docker-compose ps
```

更多Docker部署相关信息，请参考 `DOCKER_GUIDE.md`。

### 手动部署

#### 前端

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

#### 后端

```bash
# 进入后端目录
cd backend

# 创建虚拟环境
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

#### Live2D演示

```bash
# 进入Live2D演示目录
cd live2d-demo

# 使用简单的HTTP服务器运行
python -m http.server
```

## 📱 使用指南

1. 启动后端服务器
2. 启动前端开发服务器或部署构建版本
3. 访问应用（默认为 http://localhost:3000）
4. 注册账户并登录
5. 根据角色（主播/观众）使用相应功能：
   - **主播**：管理歌单、回复留言、设置抽奖
   - **观众**：点歌、参与互动、发送留言

## 🧑‍💻 开发者指南

### 项目扩展

- **前端开发**：修改`frontend/src`目录下的React组件
- **后端API开发**：在`backend/app.py`或`backend/routes/`中添加新的API端点
- **Live2D模型自定义**：
  - 替换`live2d-demo/model/`目录下的模型文件
  - 在`frontend/src/components/live2dLoader.js`中调整模型加载和交互参数

### 性能优化

- Live2D模型已经进行了性能优化，包括：
  - 移动设备降低渲染分辨率
  - 使用节流函数减少交互事件处理频率
  - 页面不可见时暂停渲染
  - IntersectionObserver监控模型可见性

## 📄 许可证

本项目采用MIT许可证。详情请参阅LICENSE文件。

## 🤝 贡献指南

欢迎提交问题报告和功能请求。如需贡献代码，请遵循以下步骤：

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 🔗 相关链接

- [项目演示](https://vup-utopia.example.com)
- [开发文档](https://docs.vup-utopia.example.com)
- [问题反馈](https://github.com/yourusername/vup-utopia/issues)

## 📞 联系方式

如有问题或建议，请通过以下方式联系我们：

- **GitHub Issues**：[提交问题](https://github.com/yourusername/vup-utopia/issues)
- **电子邮件**：contact@vup-utopia.example.com

---

<div align="center">
  <p>💖 感谢使用VUP乌托邦 | 为虚拟主播打造的理想家园 💖</p>
</div>

---

# VUP Utopia - English Version

<div align="center">
  <img src="frontend/public/assets/logo.png" alt="VUP Utopia Logo" width="200" />
  <p>🎮 VTuber Interaction Platform | 🎵 Music Playlist Management | 🎁 Fan Engagement System</p>
</div>

## 📖 Project Overview

VUP Utopia is an interactive platform designed specifically for Virtual YouTubers (VTubers), integrating music playlist management, fan engagement, and Live2D model display features. This project aims to provide VTubers with an all-in-one streaming assistant tool to enhance viewer interaction and improve the streaming experience. The platform consists of a React frontend application, Flask backend API, and Live2D model display components, offering VTubers and their fans a highly interactive and visually rich communication space.

## ✨ Key Features

### 🎬 VTuber Features
- 🐰 **Live2D Model Integration**: Responsive interactive Live2D model display with eye tracking and head rotation
- 🎙️ **Stream Information Management**: Manage streaming schedules, announcements, and special events
- 👑 **Membership Management System**: Track and manage premium membership information
- 📊 **Data Analytics**: Provide basic analytics for streaming data and audience engagement

### 🎵 Music Features
- 📋 **Playlist Management**: Browse, add, edit, and delete song requests
- 🏷️ **Tag Classification System**: Categorize songs by style, mood, and other attributes
- 🔍 **Advanced Search**: Multi-condition search functionality
- 🔄 **Song Status Tracking**: Display song playback status and queue position

### 👥 User Interaction System
- 👤 **User Account System**: Registration, login, and permission management
- 🎁 **Raffle System**: Interactive raffle functionality to enhance stream participation
- 💬 **Q&A Message Board**: Fans can submit questions for VTubers to answer
- 📱 **Cross-Platform Support**: Compatible with PC and mobile devices for engagement anywhere

### 🌟 Special Highlights
- 🧩 **Modular Design**: Freely combine different functional modules according to needs
- 🌸 **Cherry Blossom Effects**: Beautiful visual effects to enhance the streaming atmosphere
- 🔒 **Security Management**: Admin backend for content review and user management
- 🌐 **Multi-Platform Integration**: Support for basic data connection with platforms like Bilibili, YouTube, etc.

## 🛠️ Technology Stack

### Frontend
- **React.js** - User interface construction
- **Ant Design** - UI component library for beautiful interface elements
- **React Router** - Page routing management
- **Axios** - API request handling
- **Pixi.js & Live2D** - Model rendering technology

### Backend
- **Flask (Python)** - Lightweight backend framework
- **SQLite/PostgreSQL** - Data storage
- **Flask-CORS** - Cross-origin resource sharing
- **psycopg2** - PostgreSQL database connection
- **Werkzeug** - General web application toolkit

## 🗂️ Project Structure

```
vup-utopia/
├── frontend/               # React frontend application
│   ├── src/                # Source code
│   │   ├── components/     # Component library
│   │   ├── pages/          # Pages
│   │   └── utils/          # Utilities
│   ├── public/             # Static resources
│   │   └── assets/         # Images, models, etc.
│   └── package.json        # Dependency configuration
│
├── backend/                # Flask backend API
│   ├── app.py              # Main application file
│   ├── database.py         # Database operations
│   ├── config.py           # Configuration file
│   ├── routes/             # API routes
│   └── requirements.txt    # Python dependencies
│
└── live2d-demo/            # Live2D model demo
    ├── index.html          # Demo page
    ├── live2d.js           # Live2D core script
    └── model/              # Model files
```

## 🚀 Installation and Deployment

### Docker Quick Deployment (Recommended)

```bash
# Start all services with Docker Compose
docker-compose up -d

# Check service status
docker-compose ps
```

For more information on Docker deployment, please refer to `DOCKER_GUIDE.md`.

### Manual Deployment

#### Frontend

```bash
# Enter the frontend directory
cd frontend

# Install dependencies
npm install

# Run in development mode
npm start

# Build production version
npm run build
```

#### Backend

```bash
# Enter the backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env file to set necessary environment variables

# Run the application
python app.py
```

#### Live2D Demo

```bash
# Enter the Live2D demo directory
cd live2d-demo

# Run using a simple HTTP server
python -m http.server
```

## 📱 User Guide

1. Start the backend server
2. Start the frontend development server or deploy the build version
3. Access the application (default: http://localhost:3000)
4. Register an account and log in
5. Use features based on your role (VTuber/Viewer):
   - **VTuber**: Manage playlists, respond to messages, set up raffles
   - **Viewer**: Request songs, participate in interactions, send messages

## 🧑‍💻 Developer Guide

### Project Extension

- **Frontend Development**: Modify React components in the `frontend/src` directory
- **Backend API Development**: Add new API endpoints in `backend/app.py` or `backend/routes/`
- **Live2D Model Customization**:
  - Replace model files in the `live2d-demo/model/` directory
  - Adjust model loading and interaction parameters in `frontend/src/components/live2dLoader.js`

### Performance Optimization

- Live2D models have been performance optimized, including:
  - Reduced rendering resolution on mobile devices
  - Throttle functions to reduce interaction event processing frequency
  - Pause rendering when page is not visible
  - IntersectionObserver to monitor model visibility

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🤝 Contribution Guidelines

Issues and feature requests are welcome. If you want to contribute code, please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 🔗 Related Links

- [Project Demo](https://vup-utopia.example.com)
- [Development Documentation](https://docs.vup-utopia.example.com)
- [Issue Reporting](https://github.com/yourusername/vup-utopia/issues)

## 📞 Contact Information

For questions or suggestions, please contact us through:

- **GitHub Issues**: [Submit an issue](https://github.com/yourusername/vup-utopia/issues)
- **Email**: contact@vup-utopia.example.com

---

<div align="center">
  <p>💖 Thank you for using VUP Utopia | The ideal home for VTubers 💖</p>
</div> 