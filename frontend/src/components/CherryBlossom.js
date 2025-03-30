import React, { useEffect, useRef } from 'react';
import '../styles/CherryBlossom.css';

function CherryBlossom() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current;
    const maxStars = 25; // 星星的最大数量
    const starsArray = [];
    
    // 创建星星/光点
    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'star';
      
      // 随机样式
      const size = 1 + Math.random() * 3; // 星星大小
      const opacity = 0.2 + Math.random() * 0.7; // 随机透明度
      const xPos = Math.random() * 100; // 横向位置百分比
      const yPos = Math.random() * 100; // 纵向位置百分比
      const twinkleDuration = 2 + Math.random() * 8; // 闪烁动画持续时间
      const delay = Math.random() * 5; // 延迟时间
      
      // 设置星星样式
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${xPos}%`;
      star.style.top = `${yPos}%`;
      star.style.opacity = opacity;
      star.style.animationDuration = `${twinkleDuration}s`;
      star.style.animationDelay = `${delay}s`;
      
      // 随机选择星星类型
      const starType = Math.floor(Math.random() * 3) + 1;
      star.classList.add(`star-type-${starType}`);
      
      container.appendChild(star);
      starsArray.push(star);
      
      // 定期刷新星星位置
      setTimeout(() => {
        if (star.parentElement === container) {
          container.removeChild(star);
          const index = starsArray.indexOf(star);
          if (index !== -1) {
            starsArray.splice(index, 1);
            createStar(); // 创建新的星星
          }
        }
      }, (twinkleDuration * 3 + delay) * 1000);
    };
    
    // 创建模糊光斑
    const createLightSpot = () => {
      const lightSpot = document.createElement('div');
      lightSpot.className = 'light-spot';
      
      // 随机样式
      const size = 40 + Math.random() * 100; // 光斑大小
      const opacity = 0.05 + Math.random() * 0.15; // 低透明度
      const xPos = Math.random() * 100; // 横向位置百分比
      const yPos = Math.random() * 100; // 纵向位置百分比
      const driftDuration = 20 + Math.random() * 30; // 漂移动画持续时间
      const delay = Math.random() * 10; // 延迟时间
      
      // 设置光斑样式
      lightSpot.style.width = `${size}px`;
      lightSpot.style.height = `${size}px`;
      lightSpot.style.left = `${xPos}%`;
      lightSpot.style.top = `${yPos}%`;
      lightSpot.style.opacity = opacity;
      lightSpot.style.animationDuration = `${driftDuration}s`;
      lightSpot.style.animationDelay = `${delay}s`;
      
      container.appendChild(lightSpot);
      
      // 一段时间后移除光斑并创建新的
      setTimeout(() => {
        if (lightSpot.parentElement === container) {
          container.removeChild(lightSpot);
          setTimeout(createLightSpot, Math.random() * 3000);
        }
      }, (driftDuration + delay) * 1000);
    };
    
    // 初始创建一批星星
    for (let i = 0; i < maxStars; i++) {
      setTimeout(createStar, i * 100);
    }
    
    // 初始创建几个光斑
    for (let i = 0; i < 5; i++) {
      setTimeout(createLightSpot, i * 1000);
    }
    
    return () => {
      // 清理元素
      starsArray.forEach(star => {
        if (star.parentElement === container) {
          container.removeChild(star);
        }
      });
      
      const lightSpots = container.querySelectorAll('.light-spot');
      lightSpots.forEach(spot => {
        if (spot.parentElement === container) {
          container.removeChild(spot);
        }
      });
    };
  }, []);
  
  return (
    <div ref={containerRef} className="cherry-blossom-container" />
  );
}

export default CherryBlossom; 