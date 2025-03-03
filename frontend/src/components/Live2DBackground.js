import React, { useEffect, useRef, useState } from 'react';
import './Live2DBackground.css';

const Live2DBackground = () => {
  const containerRef = useRef(null);
  const modelLoaded = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 避免重复加载
    if (modelLoaded.current) return;

    const loadScripts = async () => {
      setLoading(true);
      try {
        // 按顺序加载必要的库
        await loadScript('https://cdn.jsdelivr.net/npm/pixi.js@5.3.3/dist/pixi.min.js');
        await loadScript('https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.3.1/dist/cubism2.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.3.1/dist/cubism4.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.3.1/dist/index.min.js');
        
        console.log('所有Live2D库加载完成');
        initLive2D();
        modelLoaded.current = true;
      } catch (error) {
        console.error('加载Live2D库时出错:', error);
        setError(`加载Live2D库失败: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadScripts();

    // 组件卸载时的清理
    return () => {
      // 清理可能的事件监听器或资源
      const container = containerRef.current;
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  // 辅助函数：加载脚本
  const loadScript = (url) => {
    return new Promise((resolve, reject) => {
      // 检查脚本是否已加载
      if (document.querySelector(`script[src="${url}"]`)) {
        resolve();
        return;
      }

      console.log('加载脚本:', url);
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => {
        console.log('脚本加载成功:', url);
        resolve();
      };
      script.onerror = (e) => {
        console.error('脚本加载失败:', url);
        reject(new Error(`Failed to load ${url}`));
      };
      document.body.appendChild(script);
    });
  };

  // 初始化Live2D模型
  const initLive2D = () => {
    try {
      if (!window.PIXI || !window.PIXI.live2d) {
        const errorMsg = 'PIXI 或 PIXI.live2d 未定义';
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }

      const container = containerRef.current;
      if (!container) {
        const errorMsg = '容器元素未找到';
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }

      // 创建PIXI应用
      const app = new window.PIXI.Application({
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

      // 创建模型容器
      const modelContainer = new window.PIXI.Container();
      app.stage.addChild(modelContainer);

      // 窗口大小调整处理
      const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        if (model) {
          adjustModelPosition();
        }
      };

      window.addEventListener('resize', handleResize);

      // 加载模型
      let model;
      const modelPath = '/live2d/model/JK Rabbit/JK Rabbit.model3.json';
      console.log('开始加载模型:', modelPath);
      setLoading(true);

      window.PIXI.live2d.Live2DModel.from(modelPath)
        .then(loadedModel => {
          console.log('模型加载成功!');
          model = loadedModel;
          modelContainer.addChild(model);

          // 调整模型位置和大小
          adjustModelPosition();

          // 设置互动
          setupInteraction(model);
          
          setLoading(false);
        })
        .catch(error => {
          console.error('加载模型时出错:', error);
          setError(`加载模型失败: ${error.message}`);
          setLoading(false);
        });

      // 调整模型位置和大小
      const adjustModelPosition = () => {
        if (!model) return;

        // 计算合适的缩放比例，使模型高度为窗口高度的80%
        const scale = (window.innerHeight * 0.8) / model.height;
        model.scale.set(scale);

        // 将模型放置在屏幕中央
        model.x = window.innerWidth / 2;
        model.y = window.innerHeight / 2;

        // 设置模型中心点
        model.anchor.set(0.5, 0.5);
      };

      // 设置互动功能
      const setupInteraction = (model) => {
        if (!model) return;

        // 鼠标移动事件，让模型眼睛跟随鼠标
        const handleMouseMove = (e) => {
          if (!model || !model.internalModel) return;

          // 计算鼠标位置相对于窗口中心的偏移量，范围从-1到1
          const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
          const mouseY = (e.clientY / window.innerHeight) * 2 - 1;

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
        };

        // 点击事件，触发随机动作
        const handleClick = () => {
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
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', handleClick);

        // 返回清理函数，在组件卸载时移除事件监听器
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('click', handleClick);
          window.removeEventListener('resize', handleResize);
        };
      };
    } catch (e) {
      console.error('初始化Live2D时出错:', e);
      setError(`初始化Live2D失败: ${e.message}`);
      setLoading(false);
    }
  };

  // 清除错误消息（5秒后自动消失）
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      <div ref={containerRef} className="live2d-background" />
      
      {loading && (
        <div className="live2d-loading">正在加载模型...</div>
      )}
      
      {error && (
        <div className="live2d-error">{error}</div>
      )}
    </>
  );
};

export default Live2DBackground; 