export function loadLive2DScripts() {
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
  
    // 首先加载基本的PIXI.js
    return loadScript('https://cdn.jsdelivr.net/npm/pixi.js@5.3.3/dist/pixi.min.js')
      // 加载Cubism 2运行时 - 必须先加载
      .then(() => loadScript('/assets/live2d/live2d.min.js'))
      // 加载L2Dwidget
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js'))
      // 加载Cubism核心库
      .then(() => loadScript('https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js'))
      // 加载Cubism 4支持（包含Cubism 3支持）
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.3.1/dist/cubism4.min.js'))
      // 加载主索引文件
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.3.1/dist/index.min.js'))
      .then(() => {
        console.log('所有 Live2D 相关库加载完成');
      })
      .catch(error => {
        console.error('Live2D 资源加载失败:', error);
      });
  }
  
  export function initLive2DModel() {
    if (!window.PIXI || !window.PIXI.live2d) {
      console.error('PIXI.live2d 未加载，无法初始化模型');
      return;
    }
  
    const container = document.getElementById('live2d-container');
    if (!container) {
      console.error('找不到 live2d-container');
      return;
    }

    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
    // 根据设备类型设置画布大小 - 回到原始高度
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // 确保先清理之前的可能存在的PIXI应用和WebGL上下文
    destroyLive2DModel();
    
    const app = new PIXI.Application({
      width: containerWidth,
      height: containerHeight,
      transparent: true,
      autoStart: true,
      resolution: isMobile ? 1 : (window.devicePixelRatio || 1), // 移动设备使用较低的分辨率
      powerPreference: 'high-performance', // 提高性能
      antialias: false, // 禁用抗锯齿以提高性能
      preserveDrawingBuffer: false, // 提高性能
      // 降低每帧渲染的压力
      ticker: {
        autoStart: true,
        maxFPS: 30 // 降低帧率以节省资源
      }
    });

    // 保存应用实例到window对象以便后续清理
    window.live2dApp = app;

    container.appendChild(app.view);
    
    // 设置画布样式以适应容器
    app.view.style.width = '100%';
    app.view.style.height = '100%';
    app.view.style.position = 'absolute';
    app.view.style.top = '0';
    app.view.style.left = '0';
    app.view.style.pointerEvents = 'none';
    app.view.style.zIndex = '1000';
  
    const modelContainer = new PIXI.Container();
    app.stage.addChild(modelContainer);
  
    // 使用英文路径加载模型，避免中文路径问题
    const modelPath = '/model/deluxe-cat/deluxe-cat.model3.json';
    console.log('开始加载 Live2D 模型:', modelPath);

    // 简化模型加载选项
    const modelOptions = {
      autoInteract: true,
      autoUpdate: true,
      motionPreload: true,
      expressionDefault: "web_idle" // 设置默认表情为web_idle
    };
  
    // 使用标准方式加载Cubism3模型
    PIXI.live2d.Live2DModel.from(modelPath, modelOptions)
      .then(model => {
        console.log('Live2D 模型加载成功');
        modelContainer.addChild(model);
        adjustModelPosition(model, containerWidth, containerHeight, isMobile);
        
        // 恢复交互功能，无论是什么设备都启用
        setupModelInteraction(model);

        // 尝试应用web_idle表情
        try {
          if (model.internalModel.settings.expressions && 
              model.internalModel.settings.expressions.length > 0) {
            console.log('可用表情列表:', model.internalModel.settings.expressions.map(e => e.name));
            
            // 查找web_idle表情
            const webIdleExpression = model.internalModel.settings.expressions.find(
              e => e.name === 'web_idle'
            );
            
            if (webIdleExpression) {
              console.log('应用web_idle表情');
              model.expression(webIdleExpression.name);
            } else {
              console.log('未找到web_idle表情');
            }
          } else {
            console.log('模型没有表情设置');
          }
        } catch (e) {
          console.error('应用表情时出错:', e);
        }

        // 保存模型到window对象以便后续清理
        window.live2dModel = model;

        // 监听窗口大小变化，使用节流函数优化性能
        window.addEventListener('resize', throttleResize);
        
        // 使用自定义的限制帧率的更新函数，而非每帧更新
        if (!window.live2dUpdater) {
          const updateInterval = isMobile ? 100 : 50; // 移动设备更新频率更低
          window.live2dUpdater = setInterval(() => {
            if (window.live2dModel && !document.hidden) {
              window.live2dModel.update(PIXI.Ticker.shared.deltaMS);
            }
          }, updateInterval);
        }
        
        // 使用IntersectionObserver减少不可见时的渲染
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (window.live2dApp) {
                window.live2dApp.ticker.stop();
                if (entry.isIntersecting) {
                  window.live2dApp.ticker.start();
                }
              }
            });
          }, { threshold: 0.1 });
          
          observer.observe(container);
          window.live2dObserver = observer;
        }
        
        // 页面不可见时暂停渲染
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.live2dVisibilityHandler = handleVisibilityChange;
        
        // 等待一些资源完全加载后，再次尝试应用表情
        setTimeout(() => {
          try {
            // 尝试使用另一种方式触发表情
            if (model.expression) {
              console.log('延迟触发表情...');
              model.expression('web_idle');
            }
            
            // 触发默认的待机动作
            if (model.motion) {
              console.log('触发默认待机动作...');
              // 对于Cubism 3模型，尝试触发"Idle"组中的随机动作
              model.motion('Idle');
            }
          } catch (e) {
            console.error('延迟触发表情/动作时出错:', e);
          }
        }, 1000);
      })
      .catch(error => {
        console.error('Live2D 模型加载失败:', error);
      });
      
    // 节流resize事件处理函数
    const throttleTime = 200; // 200ms节流间隔
    let resizeTimeout;
    
    function throttleResize() {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          handleResize();
          resizeTimeout = null;
        }, throttleTime);
      }
    }
    
    function handleResize() {
      if (!window.live2dModel || !window.live2dApp) return;
      
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      window.live2dApp.renderer.resize(newWidth, newHeight);
      adjustModelPosition(window.live2dModel, newWidth, newHeight, isMobile);
    }
    
    function handleVisibilityChange() {
      if (document.hidden && window.live2dApp) {
        window.live2dApp.ticker.stop();
      } else if (!document.hidden && window.live2dApp) {
        window.live2dApp.ticker.start();
      }
    }
    
    // 保存事件处理器以便后续清理
    window.live2dResizeHandler = throttleResize;
  }

  // 添加清理函数，避免内存泄漏和WebGL上下文冲突
  export function destroyLive2DModel() {
    // 清理visibility事件
    if (window.live2dVisibilityHandler) {
      document.removeEventListener('visibilitychange', window.live2dVisibilityHandler);
      window.live2dVisibilityHandler = null;
    }
    
    // 清理IntersectionObserver
    if (window.live2dObserver) {
      window.live2dObserver.disconnect();
      window.live2dObserver = null;
    }
    
    // 清理更新定时器
    if (window.live2dUpdater) {
      clearInterval(window.live2dUpdater);
      window.live2dUpdater = null;
    }
    
    // 清理resize事件
    if (window.live2dResizeHandler) {
      window.removeEventListener('resize', window.live2dResizeHandler);
      window.live2dResizeHandler = null;
    }
    
    // 清理模型
    if (window.live2dModel) {
      if (window.live2dModel.parent) {
        window.live2dModel.parent.removeChild(window.live2dModel);
      }
      window.live2dModel.destroy(true);
      window.live2dModel = null;
    }
    
    // 清理PIXI应用
    if (window.live2dApp) {
      const container = document.getElementById('live2d-container');
      if (container && container.contains(window.live2dApp.view)) {
        container.removeChild(window.live2dApp.view);
      }
      window.live2dApp.ticker.stop();
      window.live2dApp.destroy(true, { children: true, texture: true, baseTexture: true });
      window.live2dApp = null;
    }
  }

  function adjustModelPosition(model, containerWidth, containerHeight, isMobile) {
    if (!model) return;

    // 缩小模型以确保完全显示
    const scale = isMobile 
      ? Math.min(containerWidth / model.width, containerHeight / model.height) * 0.5  // 移动端保守缩放
      : Math.min(containerWidth / model.width, containerHeight / model.height) * 0.9; // 桌面端适当缩小
    
    model.scale.set(scale);

    // 改变锚点到中心
    model.anchor.set(0.5, 0.5);
    
    // 将模型放在容器中心
    model.x = containerWidth * 0.7;  // 水平居中
    model.y = containerHeight * 0.5; // 垂直居中
  }

  function setupModelInteraction(model) {
    if (!model) return;
    
    // 添加节流函数来限制事件触发频率
    function throttle(callback, delay) {
      let lastCall = 0;
      return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          callback.apply(this, args);
        }
      };
    }
    
    // 使用节流函数包装鼠标移动处理函数，使用较小的节流时间以保持更流畅的响应
    const handleMouseMove = throttle((e) => {
      if (!model?.internalModel?.parameters?.ids) return;
      
      // 计算相对于容器的鼠标位置
      const rect = model.parent.getBounds();
      const mouseX = ((e.clientX - rect.x) / rect.width) * 2 - 1;
      const mouseY = ((e.clientY - rect.y) / rect.height) * 2 - 1;
      
      try {
        if (model.internalModel.parameters.ids.includes('ParamEyeBallX')) {
          model.internalModel.coreModel.setParameterValueById('ParamEyeBallX', mouseX);
        }
        if (model.internalModel.parameters.ids.includes('ParamEyeBallY')) {
          model.internalModel.coreModel.setParameterValueById('ParamEyeBallY', mouseY);
        }
        // 添加头部转动，恢复合适的转动幅度
        if (model.internalModel.parameters.ids.includes('ParamAngleX')) {
          model.internalModel.coreModel.setParameterValueById('ParamAngleX', mouseX * 30); // 恢复原来的转动幅度
        }
        if (model.internalModel.parameters.ids.includes('ParamAngleY')) {
          model.internalModel.coreModel.setParameterValueById('ParamAngleY', mouseY * 30); // 恢复原来的转动幅度
        }
      } catch (e) {
        console.log('参数控制出错:', e);
      }
    }, 100); // 节流时间改为100ms，提高响应灵敏度
    
    document.addEventListener('mousemove', handleMouseMove);
    
    // 恢复触摸事件支持
    const handleTouchMove = throttle((e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        // 模拟鼠标事件
        handleMouseMove({
          clientX: touch.clientX,
          clientY: touch.clientY
        });
      }
    }, 100);
    
    document.addEventListener('touchmove', handleTouchMove);
  }
  