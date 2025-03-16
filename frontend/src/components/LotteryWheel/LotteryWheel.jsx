// LotteryWheel.jsx
import React, { useState, useEffect } from 'react';
import { Button, Space, message, Typography, Divider } from 'antd';
import { GiftOutlined, SaveOutlined, PlusOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons';
import { defaultPrizes } from './constants';
import PrizesTable from './PrizesTable';
import SpinWheel from './SpinWheel';
import LotteryResult from './LotteryResult';
import { useDeviceDetect } from '../../utils/deviceDetector';

const { Title } = Typography;

// 主题颜色和渐变定义
const themeColor = '#FF85A2';
const themeGradient = 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)';
const secondaryColor = '#FF69B4';

function LotteryWheel({ isLoggedIn }) {
  const { isMobile } = useDeviceDetect();
  
  // ============================
  // 1) 管理奖品列表
  // ============================
  const [prizes, setPrizes] = useState(defaultPrizes);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/user/prizes', {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error('无法获取用户奖品数据');
          return res.json();
        })
        .then((data) => {
          setPrizes(data);
        })
        .catch((err) => {
          console.error('拉取奖品失败:', err);
          message.error('拉取用户奖品信息失败，使用默认奖品');
          setPrizes(defaultPrizes);
        });
    } else {
      // 未登录直接使用默认
      setPrizes(defaultPrizes);
    }
  }, [isLoggedIn]);

  // 手动保存到后端
  const handleSavePrizes = () => {
    if (!isLoggedIn) {
      message.warning('请先登录后再保存奖品');
      return;
    }
    fetch('/api/user/prizes', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prizes }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('保存奖品信息失败');
        return res.json();
      })
      .then(() => {
        message.success('奖品信息已成功保存到后端');
      })
      .catch((err) => {
        console.error(err);
        message.error('保存奖品信息出错');
      });
  };

  // ============================
  // 2) 增加新奖品
  // ============================
  const handleAddPrize = () => {
    setPrizes((prev) => [
      ...prev,
      {
        name: '新奖品',
        probability: 0.0,
        image: '',
      },
    ]);
  };

  // ============================
  // 3) 存放抽奖结果
  // ============================
  const [result, setResult] = useState({ name: '', image: '' });

  // ============================
  // 4) 页面渲染
  // ============================
  return (
    <div style={{ 
      padding: isMobile ? '16px 12px' : '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.1) 0%, rgba(255, 105, 180, 0.1) 100%)',
      borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(255, 133, 162, 0.2)',
      overflow: 'hidden'
    }}>
      {/* 装饰性背景元素 */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,192,203,0.1) 0%, rgba(255,192,203,0) 70%)',
        top: '10%',
        right: '-50px',
        zIndex: 0,
      }} />
      
      <div style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,105,180,0.1) 0%, rgba(255,105,180,0) 70%)',
        bottom: '10%',
        left: '-30px',
        zIndex: 0,
      }} />

      <Title level={isMobile ? 3 : 2} style={{ 
        margin: '16px 0 24px',
        textAlign: 'center',
        background: themeGradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        position: 'relative',
        zIndex: 1
      }}>
        <StarOutlined />
        幸运抽奖转盘
        <StarOutlined />
      </Title>

      {/* 桌面端布局 */}
      {!isMobile && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* 上部分：奖品编辑区域 */}
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(255, 133, 162, 0.15)',
            border: '1px solid rgba(255, 192, 203, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <Button 
                type="primary" 
                onClick={handleAddPrize}
                icon={<PlusOutlined />}
                style={{ 
                  background: themeGradient,
                  border: 'none',
                  borderRadius: '12px',
                  height: '40px',
                  boxShadow: '0 4px 12px rgba(255, 133, 162, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                添加奖品
              </Button>
              {isLoggedIn && (
                <Button
                  onClick={handleSavePrizes}
                  icon={<SaveOutlined />}
                  style={{ 
                    borderColor: themeColor,
                    color: themeColor,
                    borderRadius: '12px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  保存奖品
                </Button>
              )}
            </div>
            <PrizesTable prizes={prizes} setPrizes={setPrizes} />
          </div>
          
          {/* 下部分：转盘和结果区域（左右布局） */}
          <div style={{ 
            display: 'flex',
            gap: '30px'
          }}>
            {/* 左边：转盘 */}
            <div style={{ 
              width: '60%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(255, 133, 162, 0.15)',
              border: '1px solid rgba(255, 192, 203, 0.3)',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <SpinWheel prizes={prizes} result={result} setResult={setResult} />
            </div>
            
            {/* 右边：结果展示 */}
            <div style={{ 
              width: '40%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(255, 133, 162, 0.15)',
              border: '1px solid rgba(255, 192, 203, 0.3)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <LotteryResult result={result} prizes={prizes} />
            </div>
          </div>
        </div>
      )}

      {/* 移动端布局：垂直排列所有元素 */}
      {isMobile && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* 奖品编辑区域 */}
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '20px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(255, 133, 162, 0.15)',
            border: '1px solid rgba(255, 192, 203, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <Space style={{ 
              marginBottom: '16px',
              display: 'flex',
              width: '100%',
              gap: '12px'
            }}>
              <Button 
                type="primary" 
                onClick={handleAddPrize}
                icon={<PlusOutlined />}
                style={{ 
                  flex: 1,
                  background: themeGradient,
                  border: 'none',
                  borderRadius: '12px',
                  height: '40px',
                  boxShadow: '0 4px 12px rgba(255, 133, 162, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                添加奖品
              </Button>
              {isLoggedIn && (
                <Button
                  onClick={handleSavePrizes}
                  icon={<SaveOutlined />}
                  style={{ 
                    flex: 1,
                    borderColor: themeColor,
                    color: themeColor,
                    borderRadius: '12px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  保存奖品
                </Button>
              )}
            </Space>
            <PrizesTable prizes={prizes} setPrizes={setPrizes} />
          </div>
          
          {/* 转盘 */}
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '20px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(255, 133, 162, 0.15)',
            border: '1px solid rgba(255, 192, 203, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <SpinWheel prizes={prizes} result={result} setResult={setResult} />
          </div>
          
          {/* 结果展示 */}
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '20px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(255, 133, 162, 0.15)',
            border: '1px solid rgba(255, 192, 203, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <LotteryResult result={result} prizes={prizes} />
          </div>
        </div>
      )}

      {/* 全局CSS动画定义 */}
      <style jsx="true">{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}

export default LotteryWheel;
