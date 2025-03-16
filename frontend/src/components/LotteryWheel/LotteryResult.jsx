// LotteryResult.jsx
import React, { useRef } from 'react';
import { Empty, Card, Carousel, Button } from 'antd';
import { TrophyOutlined, LeftOutlined, RightOutlined, GiftOutlined, HeartOutlined } from '@ant-design/icons';

// 主题颜色和渐变定义
const themeColor = '#FF85A2';
const themeGradient = 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)';

function LotteryResult({ result, prizes = [] }) {
  const hasResult = result && result.name;
  // 使用useRef而不是useState来存储Carousel引用，避免无限渲染循环
  const carouselRef = useRef(null);

  // 处理前一张/后一张
  const handlePrev = () => carouselRef.current && carouselRef.current.prev();
  const handleNext = () => carouselRef.current && carouselRef.current.next();

  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative'
    }}>
      {/* 装饰性背景元素 */}
      <div style={{
        position: 'absolute',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,192,203,0.1) 0%, rgba(255,192,203,0) 70%)',
        top: '-20px',
        right: '-20px',
        zIndex: 0,
      }} />

      <h3 style={{ 
        fontSize: '20px', 
        margin: '0 0 20px 0',
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
        {hasResult ? <TrophyOutlined /> : <GiftOutlined />}
        {hasResult ? '中奖结果' : '奖品展示'}
      </h3>

      {hasResult ? (
        <Card 
          style={{ 
            width: '100%',
            border: result.name === '未中奖' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255, 133, 162, 0.3)',
            background: result.name === '未中奖' ? 
              'linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)' : 
              'linear-gradient(135deg, rgba(255, 182, 193, 0.1) 0%, rgba(255, 105, 180, 0.1) 100%)',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(255, 133, 162, 0.15)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            animation: 'slideIn 0.5s ease-out'
          }}
        >
          <div style={{
            position: 'relative',
            padding: '20px'
          }}>
            <h4 style={{ 
              fontSize: '24px', 
              color: result.name === '未中奖' ? '#999' : themeColor,
              margin: '0 0 20px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              {result.name === '未中奖' ? '💔' : '🎉'} {result.name}
            </h4>
            
            {result.image ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                position: 'relative'
              }}>
                <img
                  src={result.image}
                  alt={result.name}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                />
              </div>
            ) : (
              <div style={{ 
                color: '#999',
                padding: '30px 0',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.02)',
                borderRadius: '8px'
              }}>
                暂无奖品图片
              </div>
            )}
          </div>
        </Card>
      ) : prizes && prizes.length > 0 ? (
        <div style={{ width: '100%', position: 'relative' }}>
          <Carousel 
            ref={carouselRef}
            dots={{ className: 'custom-dots' }}
            autoplay
            autoplaySpeed={3000}
            effect="fade"
          >
            {prizes.map((prize, index) => (
              <div key={index}>
                <Card 
                  style={{ 
                    margin: '0 auto',
                    maxWidth: '90%',
                    border: '1px solid rgba(255, 133, 162, 0.3)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    height: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(255, 133, 162, 0.15)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <div style={{ position: 'relative', padding: '20px' }}>
                    <h4 style={{ 
                      fontSize: '20px', 
                      background: themeGradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      margin: '0 0 16px 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <GiftOutlined /> {prize.name || '未命名奖品'}
                    </h4>
                    
                    {prize.image ? (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '180px',
                        position: 'relative'
                      }}>
                        <img
                          src={prize.image}
                          alt={prize.name}
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '180px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{ 
                        color: '#999', 
                        padding: '30px 0', 
                        textAlign: 'center',
                        height: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.02)',
                        borderRadius: '8px'
                      }}>
                        暂无奖品图片
                      </div>
                    )}
                    
                    <div style={{ 
                      marginTop: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}>
                      <HeartOutlined style={{ color: themeColor }} />
                      <span style={{ 
                        fontSize: '14px',
                        color: themeColor
                      }}>
                        中奖概率: {Math.round(prize.probability * 100)}%
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </Carousel>
          
          {/* 左右翻页按钮 */}
          <Button 
            icon={<LeftOutlined />} 
            style={{
              position: 'absolute',
              top: '50%',
              left: '-12px',
              transform: 'translateY(-50%)',
              zIndex: 2,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${themeColor}`,
              color: themeColor,
              background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 2px 8px rgba(255, 133, 162, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-50%) scale(1.1)',
                boxShadow: '0 4px 12px rgba(255, 133, 162, 0.3)'
              }
            }}
            type="default"
            onClick={handlePrev}
          />
          
          <Button 
            icon={<RightOutlined />} 
            style={{
              position: 'absolute',
              top: '50%',
              right: '-12px',
              transform: 'translateY(-50%)',
              zIndex: 2,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${themeColor}`,
              color: themeColor,
              background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 2px 8px rgba(255, 133, 162, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-50%) scale(1.1)',
                boxShadow: '0 4px 12px rgba(255, 133, 162, 0.3)'
              }
            }}
            type="default"
            onClick={handleNext}
          />
        </div>
      ) : (
        <Empty 
          description={
            <span style={{ color: '#999' }}>暂无奖品</span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          style={{ 
            margin: '20px 0',
            opacity: 0.6
          }}
        />
      )}

      {/* 添加CSS动画 */}
      <style jsx="true">{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .custom-dots {
          bottom: -25px !important;
        }
        
        .custom-dots li button {
          background: ${themeColor} !important;
          opacity: 0.3;
        }
        
        .custom-dots li.slick-active button {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default LotteryResult;
