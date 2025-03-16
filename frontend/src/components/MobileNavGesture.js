import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { SwapRightOutlined, SwapLeftOutlined } from '@ant-design/icons';

// 定义主题颜色常量
const themeColor = '#FF85A2';

/**
 * 移动端触摸滑动手势导航组件
 * 提供页面间滑动导航功能，并显示滑动方向提示
 */
const MobileNavGesture = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // 滑动状态
  const [swiping, setSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null); // 'left' 或 'right'
  
  // 滑动配置参数
  const MIN_SWIPE_DISTANCE = 70;  // 最小滑动触发距离，单位为像素
  const VELOCITY_THRESHOLD = 0.5; // 最小滑动速度阈值
  const GESTURE_TIMEOUT = 300;    // 触摸超时时间，毫秒
  
  // 页面路由列表，按导航顺序排列
  const routes = ['/intro', '/songs', '/lottery', '/observatory', '/cotton-candy'];
  
  /**
   * 处理向前导航（右滑向左）
   */
  const handleNavigateNext = useCallback(() => {
    const currentPath = window.location.pathname;
    const currentIndex = routes.indexOf(currentPath);
    
    if (currentIndex !== -1 && currentIndex < routes.length - 1) {
      const nextRoute = routes[currentIndex + 1];
      navigate(nextRoute);
      
      // 显示滑动成功提示
      message.info({
        content: '已切换到下一页',
        duration: 1,
        style: { borderRadius: '20px' }
      });
    } else if (currentIndex === routes.length - 1) {
      // 已经是最后一页
      message.info({
        content: '已经是最后一页',
        duration: 1,
        style: { borderRadius: '20px' }
      });
    }
  }, [navigate, routes]);
  
  /**
   * 处理向后导航（左滑向右）
   */
  const handleNavigateBack = useCallback(() => {
    const currentPath = window.location.pathname;
    const currentIndex = routes.indexOf(currentPath);
    
    if (currentIndex > 0) {
      const prevRoute = routes[currentIndex - 1];
      navigate(prevRoute);
      
      // 显示滑动成功提示
      message.info({
        content: '已切换到上一页',
        duration: 1,
        style: { borderRadius: '20px' }
      });
    } else if (currentIndex === 0) {
      // 已经是第一页
      message.info({
        content: '已经是第一页',
        duration: 1,
        style: { borderRadius: '20px' }
      });
    }
  }, [navigate, routes]);

  /**
   * 处理触摸开始事件
   */
  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now()  // 记录触摸开始时间
    });
  }, []);

  /**
   * 处理触摸移动事件
   */
  const onTouchMove = useCallback((e) => {
    if (!touchStart) return;
    
    const touchInfo = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now()
    };
    
    setTouchEnd(touchInfo);
    
    // 计算水平移动距离
    const distanceX = touchStart.x - touchInfo.x;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(touchStart.y - touchInfo.y);
    
    // 显示滑动方向提示
    if (isHorizontalSwipe && Math.abs(distanceX) > MIN_SWIPE_DISTANCE / 2) {
      setSwiping(true);
      setSwipeDirection(distanceX > 0 ? 'left' : 'right');
    } else {
      setSwiping(false);
      setSwipeDirection(null);
    }
  }, [touchStart]);

  /**
   * 处理触摸结束事件
   */
  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    // 重置滑动状态
    setSwiping(false);
    setSwipeDirection(null);
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const timeElapsed = touchEnd.time - touchStart.time;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    const velocity = Math.abs(distanceX) / timeElapsed; // 速度计算
    
    // 判断是否为有效的水平滑动
    const isValidSwipe = 
      isHorizontalSwipe && 
      Math.abs(distanceX) > MIN_SWIPE_DISTANCE &&
      velocity > VELOCITY_THRESHOLD && 
      timeElapsed < GESTURE_TIMEOUT;
    
    if (isValidSwipe) {
      if (distanceX > 0) {
        // 从右向左滑 - 前进
        handleNavigateNext();
      } else {
        // 从左向右滑 - 后退
        handleNavigateBack();
      }
    }
  }, [touchStart, touchEnd, handleNavigateNext, handleNavigateBack]);

  /**
   * 添加触摸事件监听器
   */
  useEffect(() => {
    const content = document.querySelector('.mobile-content') || document.body;
    
    content.addEventListener('touchstart', onTouchStart, { passive: true });
    content.addEventListener('touchmove', onTouchMove, { passive: true });
    content.addEventListener('touchend', onTouchEnd);

    return () => {
      content.removeEventListener('touchstart', onTouchStart);
      content.removeEventListener('touchmove', onTouchMove);
      content.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]);

  // 滑动指示器样式
  const indicatorStyle = {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 100,
    background: `rgba(255, 133, 162, 0.2)`,
    borderRadius: '30px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(255, 133, 162, 0.3)',
    backdropFilter: 'blur(4px)',
    border: `1px solid ${themeColor}`,
    pointerEvents: 'none',
    opacity: swiping ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out',
  };

  return (
    <>
      {/* 左滑指示器 */}
      {swipeDirection === 'left' && (
        <div style={{ ...indicatorStyle, right: '10px' }}>
          <SwapLeftOutlined style={{ color: themeColor, fontSize: '20px' }} />
        </div>
      )}
      
      {/* 右滑指示器 */}
      {swipeDirection === 'right' && (
        <div style={{ ...indicatorStyle, left: '10px' }}>
          <SwapRightOutlined style={{ color: themeColor, fontSize: '20px' }} />
        </div>
      )}
    </>
  );
};

export default MobileNavGesture; 