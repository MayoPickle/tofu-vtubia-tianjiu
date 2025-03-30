// LotteryWheel.jsx
import React, { useState, useEffect } from 'react';
import { Button, Space, message, Typography, Divider } from 'antd';
import { GiftOutlined, SaveOutlined, PlusOutlined, HeartOutlined, StarOutlined, CoffeeOutlined } from '@ant-design/icons';
import { defaultPrizes } from './constants';
import PrizesTable from './PrizesTable';
import SpinWheel from './SpinWheel';
import LotteryResult from './LotteryResult';
import { useDeviceDetect } from '../../utils/deviceDetector';

const { Title } = Typography;

// 主题颜色和渐变定义
const themeColor = '#a88f6a';
const secondaryColor = '#352a46';  // 深紫色
const highlightColor = '#e3bb4d';  // 亮黄色
const themeGradient = 'linear-gradient(135deg, #a88f6a 0%, #917752 100%)';
const secondaryGradient = 'linear-gradient(135deg, #352a46 0%, #261e36 100%)';
const bgColor = '#1c2134';
const textColor = '#e6d6bc';

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
      background: 'linear-gradient(135deg, rgba(28, 33, 52, 0.8) 0%, rgba(53, 42, 70, 0.8) 100%)',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
      overflow: 'hidden'
    }}>
      {/* 装饰性背景元素 */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 143, 106, 0.15) 0%, rgba(168, 143, 106, 0) 70%)',
        top: '10%',
        right: '-50px',
        zIndex: 0,
      }} />
      
      <div style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(227, 187, 77, 0.1) 0%, rgba(227, 187, 77, 0) 70%)',
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
        <CoffeeOutlined />
        幸运抽奖转盘
        <CoffeeOutlined />
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
            backgroundColor: bgColor,
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(168, 143, 106, 0.3)',
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
                  borderRadius: '8px',
                  height: '40px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
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
                    borderRadius: '8px',
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
              backgroundColor: bgColor,
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(168, 143, 106, 0.3)',
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
              backgroundColor: bgColor,
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(168, 143, 106, 0.3)',
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

      {/* 移动端布局 */}
      {isMobile && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* 转盘 */}
          <div style={{ 
            backgroundColor: bgColor,
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(168, 143, 106, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <SpinWheel prizes={prizes} result={result} setResult={setResult} />
          </div>

          {/* 结果展示 */}
          <div style={{ 
            backgroundColor: bgColor,
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(168, 143, 106, 0.3)',
            backdropFilter: 'blur(10px)',
            minHeight: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LotteryResult result={result} prizes={prizes} />
          </div>

          {/* 奖品编辑区域 */}
          <div style={{ 
            backgroundColor: bgColor,
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(168, 143, 106, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '16px', 
              gap: '10px'
            }}>
              <Button 
                type="primary" 
                onClick={handleAddPrize}
                icon={<PlusOutlined />}
                style={{ 
                  background: themeGradient,
                  border: 'none',
                  borderRadius: '8px',
                  flex: 1,
                  height: '40px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
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
                    borderRadius: '8px',
                    flex: 1,
                    height: '40px'
                  }}
                >
                  保存奖品
                </Button>
              )}
            </div>
            <PrizesTable prizes={prizes} setPrizes={setPrizes} />
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
