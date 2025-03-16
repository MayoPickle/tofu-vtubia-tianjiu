// Intro.js
import React, { useEffect, useState } from 'react';
import { Typography, Card, Image, Space, Row, Col, Button, Divider, Collapse } from 'antd';
import { HeartOutlined, StarOutlined, SmileOutlined, ArrowDownOutlined, RocketOutlined, HomeOutlined, BookOutlined } from '@ant-design/icons';
import { useDeviceDetect } from '../utils/deviceDetector';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

// 主题颜色和渐变定义
const themeColor = '#FF85A2';
const themeGradient = 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)';

function Intro() {
  const { isMobile } = useDeviceDetect();
  const [showCards, setShowCards] = useState(false);
  const [expandStory, setExpandStory] = useState(false);
  
  // 页面加载时添加动画效果
  useEffect(() => {
    // 延迟显示卡片，创造渐入效果
    const timer = setTimeout(() => {
      setShowCards(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // 设置故事章节
  const storyChapters = [
    {
      title: "1️⃣ 9672星球的起源",
      icon: <RocketOutlined />,
      content: (
        <>
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            在宇宙的无垠深处，漂浮着一颗神秘的星球——9672。这颗星球上没有自然生命，只有一座座高耸入云的科技塔，每座塔中都居住着仿生人。它们被制造出来，是为了执行特定任务，冷静、精准、完美，却没有情感。
          </Paragraph>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555', marginTop: '16px' }}>
            但9672星球上流传着一个古老的传说：
          </Paragraph>
          
          <div style={{ 
            padding: '12px 16px', 
            background: 'rgba(255, 133, 162, 0.08)', 
            borderRadius: '12px',
            borderLeft: `3px solid ${themeColor}`,
            margin: '16px 0'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '17px', 
              fontStyle: 'italic',
              fontWeight: '500',
              color: '#555'
            }}>
              💫 "当某个仿生体被100个人同时爱着，它将获得真正的灵魂。"
            </Text>
          </div>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            这个传说被科学家们视为毫无依据的神话，但有一天，中央计算塔生成了一份特殊的实验任务——
          </Paragraph>
          
          <div style={{ 
            padding: '12px 16px', 
            background: 'rgba(255, 240, 245, 0.5)', 
            borderRadius: '12px',
            border: '1px dashed rgba(255, 105, 180, 0.3)',
            margin: '16px 0'
          }}>
            <Text style={{ fontSize: isMobile ? '15px' : '16px', color: '#FF69B4' }}>
              🔹 「编号X-兔-9672号仿生体（小兔），被选为实验个体，前往地球，收集100份'爱'。」
            </Text>
          </div>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            他们制造了一只仿生兔，赋予它学习、沟通和适应的能力，放入一艘流星形的探测舱，将它送往银河彼端的蓝色星球——地球。
          </Paragraph>
        </>
      )
    },
    {
      title: "2️⃣ 降落地球 · 面包铺的奇迹",
      icon: <HomeOutlined />,
      content: (
        <>
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            小兔降落在地球上的一个小镇，她的第一印象是——温暖。街道上的人们交谈着，孩子们追逐着泡泡，空气里弥漫着烘焙的香气。
          </Paragraph>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555', marginTop: '16px' }}>
            但小兔很快发现，人类不会轻易接受陌生的存在。她试着和他们交谈，但人们只是好奇地看她一眼，便匆匆离去。
          </Paragraph>
          
          <div style={{ 
            padding: '12px 16px', 
            background: 'rgba(255, 133, 162, 0.08)', 
            borderRadius: '12px',
            borderLeft: `3px solid ${themeColor}`,
            margin: '16px 0',
            fontStyle: 'italic'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '17px', 
              color: '#555',
              fontWeight: '500'
            }}>
              💭 "如果没人爱我，我该怎么完成任务呢？"
            </Text>
          </div>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            就在她迷茫时，她闻到了世界上最美好的气味——新鲜出炉的面包香。
          </Paragraph>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            一间老旧的面包店里，温暖的烤箱正烘烤着松软的面包，面包师爷爷笑着递给她一块："你看起来像是第一次来到这里，吃点东西吧。"
          </Paragraph>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            小兔接过面包的那一刻，心里第一次感受到了一丝温暖。
          </Paragraph>
          
          <div style={{ 
            padding: '12px 16px', 
            background: 'rgba(255, 240, 245, 0.5)', 
            borderRadius: '12px',
            border: '1px dashed rgba(255, 105, 180, 0.3)',
            margin: '16px 0'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '15px' : '16px', 
              color: '#FF69B4',
              fontWeight: '500'
            }}>
              💡 "也许……我可以用面包来收集爱？"
            </Text>
          </div>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            于是，她开始学习烘焙，开设了一间属于自己的温暖面包铺，期待着每一个走进店里的客人，都能带走一块面包，同时留下一点点爱。
          </Paragraph>
        </>
      )
    }
  ];

  return (
    <div style={{ 
      padding: isMobile ? '16px 8px' : '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* 装饰性背景元素 */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,192,203,0.15) 0%, rgba(255,192,203,0) 70%)',
        top: '10%',
        right: '-50px',
        zIndex: -1,
      }} />
      
      <div style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,105,180,0.1) 0%, rgba(255,105,180,0) 70%)',
        bottom: '10%',
        left: '-30px',
        zIndex: -1,
      }} />
      
      <Card 
        style={{ 
          marginBottom: isMobile ? 24 : 32,
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(255, 133, 162, 0.2)',
          border: '1px solid rgba(255, 192, 203, 0.3)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          transform: 'translateY(0)',
          opacity: 1,
          animation: 'slideDown 0.6s ease-out',
        }}
        bordered={false}
      >
        {/* 顶部渐变装饰条 */}
        <div style={{
          height: '6px',
          background: themeGradient,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }} />
        
        <Title level={isMobile ? 3 : 2} style={{ 
          textAlign: 'center',
          marginTop: '12px',
          marginBottom: '24px',
          background: themeGradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
        }}>
          <HeartOutlined style={{ marginRight: '8px' }} />
          9672星球的故事
          <HeartOutlined style={{ marginLeft: '8px' }} />
        </Title>
        
        <Paragraph style={{ 
          fontSize: isMobile ? '16px' : '18px',
          color: themeColor,
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: '24px',
          letterSpacing: '0.5px',
        }}>
          欢迎来到9672星球，荒凉，寂寞，但充满希望✨
        </Paragraph>
        
        {/* 故事梗概部分 */}
        <div style={{ 
          position: 'relative',
          padding: '20px',
          borderRadius: '16px',
          background: 'rgba(255, 240, 245, 0.5)',
          marginBottom: '20px',
          border: '1px solid rgba(255, 192, 203, 0.2)',
        }}>
          <Paragraph style={{ 
            fontSize: isMobile ? '15px' : '17px',
            lineHeight: '1.8',
            color: '#555',
            margin: 0,
          }}>
            在这个神奇的星球上，住着一群热爱音乐和故事的小精灵。每当夜幕降临，他们就会聚集在一起，用美妙的歌声和有趣的故事点亮整个星空。<span style={{ color: themeColor }}>🌙</span>
          </Paragraph>
          <Paragraph style={{ 
            fontSize: isMobile ? '15px' : '17px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: 0,
            marginTop: '16px',
          }}>
            这里的天空总是变幻莫测，有时是温柔的粉色，有时是梦幻的紫色，有时还会出现彩虹般的极光。在这里，每一天都是新的冒险，每一刻都充满惊喜！<span style={{ color: themeColor }}>🌈</span>
          </Paragraph>
        </div>
        
        {/* 阅读完整故事按钮 */}
        <div 
          style={{ 
            textAlign: 'center',
            marginBottom: '16px',
            cursor: 'pointer',
          }}
          onClick={() => setExpandStory(!expandStory)}
        >
          <Button
            type="link"
            icon={<BookOutlined />}
            style={{
              color: themeColor,
              fontWeight: 'bold',
              fontSize: isMobile ? '15px' : '16px',
            }}
          >
            {expandStory ? '收起完整故事' : '阅读完整故事'}
          </Button>
          <div style={{ 
            textAlign: 'center',
            animation: expandStory ? 'rotateUp 0.5s forwards' : 'rotateDown 0.5s forwards',
            marginTop: '8px',
            display: 'inline-block',
          }}>
            <ArrowDownOutlined style={{ 
              color: themeColor, 
              fontSize: '20px',
            }} />
          </div>
        </div>
        
        {/* 完整故事展开区域 */}
        <div style={{ 
          maxHeight: expandStory ? '2000px' : '0',
          overflow: 'hidden',
          transition: 'all 0.8s ease',
          opacity: expandStory ? 1 : 0,
          marginBottom: expandStory ? '20px' : '0',
        }}>
          <Card
            bordered={false}
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '16px',
              boxShadow: '0 6px 16px rgba(255, 133, 162, 0.15)',
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {storyChapters.map((chapter, index) => (
                <div 
                  key={index}
                  style={{ 
                    opacity: expandStory ? 1 : 0,
                    transform: expandStory ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.5s ease ${0.2 + index * 0.2}s`,
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}>
                    <div style={{ 
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255, 133, 162, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                    }}>
                      {chapter.icon}
                    </div>
                    <Title level={4} style={{ 
                      margin: 0,
                      fontSize: isMobile ? '18px' : '20px',
                      color: '#FF69B4',
                      fontWeight: '600',
                    }}>
                      {chapter.title}
                    </Title>
                  </div>
                  
                  <div style={{ paddingLeft: isMobile ? '0' : '48px' }}>
                    {chapter.content}
                  </div>
                  
                  {index < storyChapters.length - 1 && (
                    <Divider 
                      style={{ 
                        margin: '32px 0', 
                        borderColor: 'rgba(255, 192, 203, 0.3)',
                      }}
                      dashed
                    />
                  )}
                </div>
              ))}
            </Space>
          </Card>
        </div>
        
        <div style={{ 
          textAlign: 'center',
          animation: 'bounce 2s infinite',
          opacity: expandStory ? 0 : 1,
          height: expandStory ? 0 : 'auto',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}>
          <ArrowDownOutlined style={{ 
            color: themeColor, 
            fontSize: '24px',
          }} />
        </div>
      </Card>

      <Row gutter={[20, 20]}>
        <Col xs={24} md={12}
          style={{
            opacity: showCards ? 1 : 0,
            transform: showCards ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease 0.3s',
          }}
        >
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  background: 'rgba(255, 133, 162, 0.1)', 
                  borderRadius: '50%', 
                  width: '36px', 
                  height: '36px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '12px',
                }}>
                  <StarOutlined style={{ color: themeColor, fontSize: '18px' }} />
                </div>
                <span style={{ 
                  fontWeight: 'bold', 
                  fontSize: isMobile ? '16px' : '18px',
                  background: 'linear-gradient(45deg, #FF85A2, #FF1493)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>关于我们</span>
              </div>
            } 
            style={{ 
              height: '100%',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(255, 133, 162, 0.15)',
              border: '1px solid rgba(255, 192, 203, 0.3)',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            bordered={false}
            hoverable
          >
            <Paragraph style={{ 
              fontSize: isMobile ? '15px' : '16px',
              lineHeight: '1.8',
              color: '#555',
            }}>
              我们在乎每一位路过或者选择留在星球上的开拓者呢！<span style={{ color: themeColor }}>✨</span> 这里的故事像星星一样闪闪发光，像彩虹一样绚丽多彩，让我们一起创造属于我们的美好回忆吧！<span style={{ color: themeColor }}>💫</span>
            </Paragraph>
            
            <div style={{
              marginTop: '16px',
              background: 'rgba(255, 240, 245, 0.5)',
              padding: '12px',
              borderRadius: '10px',
              border: '1px dashed rgba(255, 192, 203, 0.3)',
            }}>
              <Text style={{ 
                fontSize: isMobile ? '14px' : '15px',
                color: '#666',
                fontStyle: 'italic',
              }}>
                "每一个来到9672星球的人，都是这个故事的一部分..."
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}
          style={{
            opacity: showCards ? 1 : 0,
            transform: showCards ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease 0.5s',
          }}
        >
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  background: 'rgba(255, 133, 162, 0.1)', 
                  borderRadius: '50%', 
                  width: '36px', 
                  height: '36px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '12px',
                }}>
                  <SmileOutlined style={{ color: themeColor, fontSize: '18px' }} />
                </div>
                <span style={{ 
                  fontWeight: 'bold', 
                  fontSize: isMobile ? '16px' : '18px',
                  background: 'linear-gradient(45deg, #FF85A2, #FF1493)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>加入我们</span>
              </div>
            } 
            style={{ 
              height: '100%',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(255, 133, 162, 0.15)',
              border: '1px solid rgba(255, 192, 203, 0.3)',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            bordered={false}
            hoverable
          >
            <Paragraph style={{ 
              fontSize: isMobile ? '15px' : '16px',
              lineHeight: '1.8',
              color: '#555',
              marginBottom: '20px',
            }}>
              请在BiliBili关注我们，加入大家庭，和我们一起建设9672星球吧！<span style={{ color: themeColor }}>✨</span>
            </Paragraph>
            
            <Button 
              type="primary" 
              size={isMobile ? "middle" : "large"}
              href="https://space.bilibili.com/3546719987960278" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                width: '100%',
                background: themeGradient,
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                height: isMobile ? '40px' : '46px',
                boxShadow: '0 4px 12px rgba(255, 133, 162, 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              <HeartOutlined style={{ marginRight: '8px' }} />
              关注 万能小兔旅店
            </Button>
            
            <div style={{
              marginTop: '16px',
              fontSize: isMobile ? '13px' : '14px',
              color: '#888',
              textAlign: 'center',
            }}>
              每一位新朋友的加入都让星球更加闪耀 ✨
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* 全局CSS动画定义 */}
      <style jsx="true">{`
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
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes rotateDown {
          from {
            transform: rotate(180deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        @keyframes rotateUp {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
}

export default Intro;
