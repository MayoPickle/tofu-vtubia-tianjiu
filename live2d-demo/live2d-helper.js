// Live2D模型助手
window.live2dHelper = {
    // 检查WebGL支持
    checkWebGLSupport: function() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return gl != null;
    },
    
    // 初始化模型
    initModel: function(containerId, modelPath) {
        if (!this.checkWebGLSupport()) {
            alert('您的浏览器不支持WebGL，无法显示Live2D模型');
            return;
        }
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('找不到容器元素:', containerId);
            return;
        }
        
        // 创建canvas元素
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        container.appendChild(canvas);
        
        // 载入Live2D模型
        this.loadCubismModel(canvas, modelPath);
        
        // 窗口大小调整处理
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    },
    
    // 加载Cubism模型
    loadCubismModel: function(canvas, modelPath) {
        console.log('尝试通过Cubism SDK加载模型:', modelPath);
        
        // 这里应该使用Cubism SDK的API加载模型
        // 由于Cubism SDK的API较为复杂，这里只是一个简化的示例框架
        // 实际项目中需要根据Cubism SDK的文档实现完整的加载逻辑
        
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.color = 'white';
        message.style.fontSize = '18px';
        message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        message.style.padding = '20px';
        message.style.borderRadius = '10px';
        message.style.zIndex = '1000';
        message.textContent = '模型加载中...';
        document.body.appendChild(message);
        
        // 模拟加载过程
        setTimeout(() => {
            message.textContent = '注意: 您可能需要使用官方的Cubism Viewer来正确显示此模型。';
            
            setTimeout(() => {
                document.body.removeChild(message);
            }, 3000);
        }, 2000);
    }
}; 