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