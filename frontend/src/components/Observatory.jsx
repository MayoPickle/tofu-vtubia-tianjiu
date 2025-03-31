import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, message, Tooltip, Typography, Space, Divider } from 'antd';
import { CopyOutlined, LockOutlined, UnlockOutlined, SyncOutlined, CoffeeOutlined } from '@ant-design/icons';
import { useDeviceDetect } from '../utils/deviceDetector';

const { Title, Paragraph, Text } = Typography;

// 主题颜色和渐变定义 - 与Intro.js保持一致
const themeColor = '#a88f6a';
const secondaryColor = '#352a46';  // 深紫色
const highlightColor = '#e3bb4d';  // 亮黄色
const themeGradient = 'linear-gradient(135deg, #a88f6a 0%, #917752 100%)';
const secondaryGradient = 'linear-gradient(135deg, #352a46 0%, #261e36 100%)';
const bgColor = '#1c2134';
const textColor = '#e6d6bc';

// 4个挡位配置 - 修改为主题风格渐变
const levels = [
  {
    label: '幽灵',
    trigger: '观测站幽灵+密码',
    exponent: 2,
    comment: '一倍',
    color: themeGradient, // 酒馆基础色 - 棕色系
  },
  {
    label: '强袭',
    trigger: '观测站强袭+密码',
    exponent: 3,
    comment: '十倍',
    color: secondaryGradient, // 酒馆次要色 - 深紫色系
  },
  {
    label: '泰坦',
    trigger: '观测站泰坦+密码',
    exponent: 4,
    comment: '百倍',
    color: `linear-gradient(135deg, ${highlightColor} 0%, #d5a520 100%)`, // 酒馆高亮色 - 金色系
  },
  {
    label: '全境',
    trigger: '观测站全境+密码',
    exponent: 5,
    comment: 'ALL IN',
    color: 'linear-gradient(135deg, #614092 0%, #3b1d63 100%)', // 神秘感 - 深紫色系
  },
];

/**
 * 真实 4 位密码
 */
function getRealPassword(exponent) {
  const now = new Date();
  // 严格使用UTC时间
  const M = now.getUTCMonth() + 1; // 1~12
  const D = now.getUTCDate();      // 1~31
  const H = now.getUTCHours();     // 0~23

  // 修改计算逻辑：使用相加而非拼接
  const baseNum = M + D + H;

  const bigVal = Math.pow(baseNum, exponent);
  const last4 = bigVal % 10000;

  return last4.toString().padStart(4, '0');
}

/**
 * 当前用户能否看到/复制真实密码
 * - 未登录 => 全部 "****"
 * - 管理员 => 全部真实密码
 * - 普通用户 => 仅前2挡位(0/1)真实密码, 后2(2/3) => "****"
 */
function getEffectivePassword(idx, realPwd, isLoggedIn, isAdmin) {
  if (!isLoggedIn) return '****';
  if (isAdmin) return realPwd;
  // 普通用户 => 仅前2挡位显示密码
  return (idx < 2) ? realPwd : '****';
}

/**
 * 是否可复制该挡位
 */
function canCopy(idx, isLoggedIn, isAdmin) {
  if (!isLoggedIn) return false;
  if (isAdmin) return true;
  // 普通用户 => 只能复制前2个
  return (idx < 2);
}

/**
 * 若按钮被禁用，返回原因；否则返回空字符串
 */
function getDisabledReason(idx, isLoggedIn, isAdmin) {
  if (!isLoggedIn) {
    return '请先登录后才可显示';
  }
  if (isAdmin) {
    return ''; // 管理员不禁用，无需理由
  }
  // 普通用户，idx >= 2 => 后2个挡位禁用
  if (idx >= 2) {
    return '只有管理员才能使用此挡位';
  }
  return ''; // 可用
}

/**
 * 去掉 "+密码"
 */
function getTriggerPrefix(originalTrigger) {
  return originalTrigger.replace('+密码', '');
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      message.success('已复制到剪贴板');
    })
    .catch(() => {
      message.error('复制失败');
    });
}

// 密码过期倒计时计算
function getCountdownTime() {
  const now = new Date();
  const currentHour = now.getUTCHours();
  const nextHour = new Date(now);
  
  nextHour.setUTCHours(currentHour + 1, 0, 0, 0);
  
  // 计算剩余毫秒数
  const diffMs = nextHour - now;
  
  // 转换为分钟和秒
  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);
  
  return { minutes, seconds };
}

// 为每个档位添加装饰性图标
function getLevelIcon(idx) {
  switch(idx) {
    case 0: return '👻'; // 幽灵
    case 1: return '⚡'; // 强袭
    case 2: return '🔱'; // 泰坦
    case 3: return '🌌'; // 全境
    default: return '✨';
  }
}

function Observatory({ isLoggedIn, isAdmin }) {
  const { isMobile } = useDeviceDetect();
  
  // 添加时间状态和自动刷新功能
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(getCountdownTime());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 手动刷新函数
  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentTime(new Date());
    setCountdown(getCountdownTime());
    
    // 模拟刷新动画效果
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };
  
  useEffect(() => {
    // 每分钟更新一次时间，确保密码保持最新
    const minuteTimer = setInterval(() => {
      setCurrentTime(new Date());
      setCountdown(getCountdownTime());
    }, 60000); // 60秒 = 1分钟
    
    // 倒计时每秒更新
    const secondTimer = setInterval(() => {
      setCountdown(getCountdownTime());
    }, 1000);
    
    // 组件卸载时清除定时器
    return () => {
      clearInterval(minuteTimer);
      clearInterval(secondTimer);
    };
  }, []);
  
  return (
    <div 
      style={{ 
        padding: isMobile ? '16px 8px' : '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(28, 33, 52, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        border: `1px solid rgba(168, 143, 106, 0.3)`,
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* 装饰性背景元素 */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(168, 143, 106, 0.15) 0%, rgba(168, 143, 106, 0) 70%)`,
        top: '10%',
        right: isMobile ? '0' : '-50px',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }} />
      
      <div style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(227, 187, 77, 0.1) 0%, rgba(227, 187, 77, 0) 70%)`,
        bottom: '10%',
        left: isMobile ? '0' : '-30px',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }} />

      {/* 顶部渐变装饰条 */}
      <div style={{
        height: '6px',
        background: themeGradient,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        borderRadius: '12px 12px 0 0'
      }} />
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: isMobile ? 12 : 20 
      }}>
        <Title level={isMobile ? 3 : 2} style={{ 
          margin: 0, 
          background: themeGradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
        }}>
          <CoffeeOutlined style={{ marginRight: '8px' }} />
          观测站
          <CoffeeOutlined style={{ marginLeft: '8px' }} />
        </Title>
        <Tooltip title="刷新密码">
          <Button 
            type="text"
            icon={<SyncOutlined spin={isRefreshing} style={{ color: highlightColor }} />} 
            onClick={handleRefresh}
            style={{ marginLeft: 10 }}
          />
        </Tooltip>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginBottom: isMobile ? 16 : 24,
        padding: '8px',
        background: 'rgba(53, 42, 70, 0.4)',
        borderRadius: '8px',
        border: `1px solid rgba(168, 143, 106, 0.2)`
      }}>
        <Text style={{ fontSize: isMobile ? '12px' : '14px', color: textColor }}>
          密码将在 {countdown.minutes}:{countdown.seconds.toString().padStart(2, '0')} 后更新
        </Text>
      </div>

      <Row gutter={isMobile ? [12, 12] : [16, 16]}>
        {levels.map((lvl, idx) => {
          // 1) 计算真实密码
          const realPwd = getRealPassword(lvl.exponent);

          // 2) 根据权限决定显示"****"还是真实密码
          const finalPwd = getEffectivePassword(idx, realPwd, isLoggedIn, isAdmin);

          // 3) 生成可复制的最终字符串
          const prefix = getTriggerPrefix(lvl.trigger);
          const finalTrigger = prefix + finalPwd;

          // 4) 判断按钮是否可用
          const copyAllowed = canCopy(idx, isLoggedIn, isAdmin);

          // 5) 若禁用 => 返回原因，用 Tooltip 提示
          const disabledReason = getDisabledReason(idx, isLoggedIn, isAdmin);

          return (
            <Col xs={12} sm={12} md={6} key={lvl.label}
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: `all 0.5s ease ${idx * 0.1}s`,
              }}
            >
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!copyAllowed && <LockOutlined style={{ marginRight: 5, color: textColor }} />}
                    {copyAllowed && <UnlockOutlined style={{ marginRight: 5, color: highlightColor }} />}
                    <span style={{ marginRight: '5px' }}>{lvl.label}</span>
                    <span style={{ fontSize: '16px' }}>{getLevelIcon(idx)}</span>
                  </div>
                }
                bordered={false}
                size={isMobile ? "small" : "default"}
                style={{ 
                  textAlign: 'center', 
                  height: '100%',
                  background: 'rgba(28, 33, 52, 0.7)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                  border: `1px solid rgba(168, 143, 106, 0.3)`,
                  transition: 'all 0.3s ease',
                }}
                styles={{
                  header: {
                    fontSize: isMobile ? '14px' : '16px',
                    padding: isMobile ? '8px' : '12px',
                    fontWeight: 'bold',
                    borderBottom: `1px solid rgba(168, 143, 106, 0.3)`,
                    backgroundImage: lvl.color,
                    color: textColor,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  },
                  body: {
                    padding: isMobile ? '12px' : '24px'
                  }
                }}
                hoverable
                className="observatory-card"
              >
                <Paragraph style={{ 
                  fontSize: isMobile ? '12px' : '14px', 
                  marginBottom: isMobile ? 8 : 12,
                  color: textColor
                }}>
                  挡位说明：<Text strong style={{ color: highlightColor }}>{lvl.comment}</Text>
                </Paragraph>

                <Divider style={{ margin: isMobile ? '8px 0' : '12px 0', borderColor: `rgba(168, 143, 106, 0.3)` }} />

                {/* 触发关键词 + 复制按钮 */}
                <div style={{ marginBottom: isMobile ? 10 : 16 }}>
                  <Paragraph style={{ 
                    marginBottom: isMobile ? 6 : 10,
                    fontSize: isMobile ? '12px' : '14px',
                    color: textColor
                  }}>
                    触发关键词：
                    <Text strong style={{ 
                      color: textColor,
                      display: 'block',
                      padding: '5px',
                      margin: '4px 0',
                      background: 'rgba(53, 42, 70, 0.3)',
                      borderRadius: '4px',
                      wordBreak: 'break-all',
                      border: `1px solid rgba(168, 143, 106, 0.2)`
                    }}>
                      {finalTrigger}
                    </Text>
                  </Paragraph>

                  <Tooltip
                    title={disabledReason} // 若为空字符串则不显示
                    mouseEnterDelay={0.2}  // 鼠标悬停0.2s后显示提示
                  >
                    <Button
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(finalTrigger)}
                      size={isMobile ? "small" : "middle"}
                      disabled={!copyAllowed}
                      type="primary"
                      style={{ 
                        background: copyAllowed ? themeGradient : undefined,
                        borderColor: 'transparent',
                        width: '100%',
                        boxShadow: copyAllowed ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none',
                      }}
                      className="copy-button"
                    >
                      复制触发词
                    </Button>
                  </Tooltip>
                </div>

                {/* 显示4位密码(或 "****") */}
                <div style={{ 
                  fontSize: isMobile ? '28px' : '36px', 
                  fontWeight: 'bold', 
                  fontFamily: 'monospace',
                  color: finalPwd === '****' ? 'rgba(230, 214, 188, 0.4)' : highlightColor,
                  padding: '10px 0',
                  letterSpacing: '2px',
                  textShadow: finalPwd === '****' ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}>
                  {finalPwd}
                </div>
                <div style={{ 
                  fontSize: isMobile ? '10px' : '12px', 
                  color: 'rgba(230, 214, 188, 0.7)', 
                  marginTop: 4 
                }}>
                  当前 4 位密码
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
      
      {/* 添加上次更新时间提示 */}
      <div style={{
        textAlign: 'center',
        fontSize: isMobile ? '11px' : '13px',
        color: 'rgba(230, 214, 188, 0.7)',
        marginTop: isMobile ? 16 : 24,
        padding: '8px',
        background: 'rgba(53, 42, 70, 0.3)',
        borderRadius: '6px',
        border: `1px solid rgba(168, 143, 106, 0.2)`
      }}>
        <SyncOutlined spin={isRefreshing} style={{ marginRight: 5, color: highlightColor }} />
        密码自动更新 (上次更新: {currentTime.toLocaleTimeString()})
      </div>

      {/* 添加CSS动画 */}
      <style jsx="true">{`
        .observatory-card {
          position: relative;
          animation: slideDown 0.6s ease-out;
        }
        
        .observatory-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(168, 143, 106, 0.1), rgba(227, 187, 77, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          border-radius: 12px;
        }
        
        .observatory-card:hover::after {
          opacity: 1;
        }
        
        .copy-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}

export default Observatory;
