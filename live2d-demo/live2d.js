// Live2D模型加载器
document.addEventListener('DOMContentLoaded', function() {
    // 加载所需库（按顺序）
    loadScript('https://cdn.jsdelivr.net/npm/pixi.js@5.3.3/dist/pixi.min.js')
        .then(() => loadScript('https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js'))
        .then(() => loadScript('https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.3.1/dist/cubism2.min.js'))
        .then(() => loadScript('https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.3.1/dist/cubism4.min.js'))
        .then(() => loadScript('https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.3.1/dist/index.min.js'))
        .then(() => {
            console.log('所有库加载完成，初始化Live2D');
            initLive2D();
        })
        .catch(error => {
            console.error('加载库时出错:', error);
        });
    
    // 辅助函数：加载脚本
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            console.log('加载脚本:', url);
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => {
                console.log('脚本加载成功:', url);
                resolve();
            };
            script.onerror = () => {
                console.error('脚本加载失败:', url);
                reject(new Error(`Failed to load ${url}`));
            };
            document.body.appendChild(script);
        });
    }
    
    // 初始化Live2D模型
    function initLive2D() {
        try {
            // 获取容器元素
            const container = document.getElementById('live2d-container');
            
            // 创建PIXI应用
            const app = new PIXI.Application({
                width: window.innerWidth,
                height: window.innerHeight,
                transparent: true,
                autoStart: true
            });
            
            // 将PIXI画布添加到容器
            container.appendChild(app.view);
            
            // 设置画布样式
            app.view.style.position = 'fixed';
            app.view.style.top = '0';
            app.view.style.left = '0';
            app.view.style.zIndex = '-1';
            app.view.style.pointerEvents = 'none';
            
            // 窗口大小调整处理
            window.addEventListener('resize', () => {
                app.renderer.resize(window.innerWidth, window.innerHeight);
                if (model) {
                    adjustModelPosition();
                }
            });
            
            // 创建模型容器
            const modelContainer = new PIXI.Container();
            app.stage.addChild(modelContainer);
            
            console.log('准备加载模型...');
            console.log('PIXI:', PIXI);
            console.log('PIXI.live2d:', PIXI.live2d);
            
            // 验证库是否正确加载
            if (!PIXI.live2d || !PIXI.live2d.Live2DModel) {
                console.error('PIXI.live2d.Live2DModel未定义，库可能未正确加载');
                // 尝试另一种方式加载模型
                alert('Live2D库加载失败，请刷新页面或尝试使用其他浏览器');
                return;
            }
            
            // 加载模型
            let model;
            const modelPath = 'model/JK Rabbit/JK Rabbit.model3.json';
            console.log('开始加载模型:', modelPath);
            
            PIXI.live2d.Live2DModel.from(modelPath)
                .then(loadedModel => {
                    console.log('模型加载成功!');
                    model = loadedModel;
                    modelContainer.addChild(model);
                    
                    // 调整模型位置和大小
                    adjustModelPosition();
                    
                    // 设置互动
                    setupInteraction(model);
                })
                .catch(error => {
                    console.error('加载模型时出错:', error);
                    alert('模型加载失败: ' + error.message);
                });
            
            // 调整模型位置和大小的函数
            function adjustModelPosition() {
                if (!model) return;
                
                // 计算合适的缩放比例，使模型高度为窗口高度的80%
                const scale = (window.innerHeight * 0.8) / model.height;
                model.scale.set(scale);
                
                // 将模型放置在屏幕中央
                model.x = window.innerWidth / 2;
                model.y = window.innerHeight / 2;
                
                // 设置模型中心点
                model.anchor.set(0.5, 0.5);
            }
        } catch (e) {
            console.error('初始化Live2D时出错:', e);
        }
    }
    
    // 设置互动功能
    function setupInteraction(model) {
        if (!model) return;
        
        // 鼠标移动事件，让模型眼睛跟随鼠标
        document.addEventListener('mousemove', e => {
            if (!model || !model.internalModel) return;
            
            // 计算鼠标位置相对于窗口中心的偏移量，范围从-1到1
            const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
            
            // 尝试控制模型眼球参数，这些参数名称可能因模型而异
            try {
                // X轴眼球移动
                if (model.internalModel.parameters.ids.includes('ParamEyeBallX')) {
                    model.internalModel.coreModel.setParameterValueById('ParamEyeBallX', mouseX);
                }
                
                // Y轴眼球移动
                if (model.internalModel.parameters.ids.includes('ParamEyeBallY')) {
                    model.internalModel.coreModel.setParameterValueById('ParamEyeBallY', mouseY);
                }
                
                // 头部X轴旋转
                if (model.internalModel.parameters.ids.includes('ParamAngleX')) {
                    model.internalModel.coreModel.setParameterValueById('ParamAngleX', mouseX * 30);
                }
                
                // 头部Y轴旋转
                if (model.internalModel.parameters.ids.includes('ParamAngleY')) {
                    model.internalModel.coreModel.setParameterValueById('ParamAngleY', mouseY * 30);
                }
                
                // 头部Z轴旋转
                if (model.internalModel.parameters.ids.includes('ParamAngleZ')) {
                    model.internalModel.coreModel.setParameterValueById('ParamAngleZ', mouseX * mouseY * 10);
                }
                
                // 身体旋转
                if (model.internalModel.parameters.ids.includes('ParamBodyAngleX')) {
                    model.internalModel.coreModel.setParameterValueById('ParamBodyAngleX', mouseX * 10);
                }
            } catch (e) {
                console.log('参数控制出错:', e);
            }
        });
        
        // 点击事件，触发随机动作
        document.addEventListener('click', e => {
            if (!model || !model.motion) return;
            
            try {
                // 获取可用的动作组
                const motionGroups = Object.keys(model.motion);
                if (motionGroups.length > 0) {
                    // 随机选择一个动作组
                    const randomGroup = motionGroups[Math.floor(Math.random() * motionGroups.length)];
                    // 从该组中随机播放一个动作
                    model.motion(randomGroup);
                }
            } catch (e) {
                console.log('播放动作出错:', e);
            }
        });
    }
}); 