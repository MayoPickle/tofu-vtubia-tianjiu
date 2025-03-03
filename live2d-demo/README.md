# JK Rabbit Live2D演示

这是一个简单的网页演示，展示了如何将Live2D模型(JK Rabbit)作为网页背景，并在前面添加文本内容。

## 功能特点

- 使用pixi-live2d-display库加载和渲染Live2D模型
- 模型会根据鼠标位置做出反应，包括眼睛跟踪和头部转动
- 点击页面可触发模型的随机动作
- 模型自动适应不同的屏幕大小

## 使用方法

1. 确保您已正确放置JK Rabbit模型文件在`model/JK Rabbit/`目录中
2. 在网络服务器环境下访问index.html（由于浏览器的安全限制，不能直接打开本地文件）

### 本地测试

您可以使用Python内置的HTTP服务器快速测试：

```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

然后访问 http://localhost:8000

## 文件结构

- `index.html` - 主HTML页面
- `live2d.js` - 加载和控制Live2D模型的JavaScript代码
- `model/JK Rabbit/` - Live2D模型文件夹

## 技术细节

- 使用了[PixiJS](https://pixijs.com/)作为WebGL渲染器
- 使用了[pixi-live2d-display](https://github.com/guansss/pixi-live2d-display)库加载Live2D模型
- 支持Cubism 4模型格式(model3.json)

## 自定义

您可以通过修改以下内容来自定义此演示：

- 在HTML文件中更改文本内容和样式
- 在live2d.js文件中调整模型的大小、位置和互动参数
- 替换为其他Live2D模型(需要修改模型路径) 