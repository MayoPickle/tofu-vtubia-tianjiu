// Intro.js
import React, { useEffect, useState } from 'react';
import { Typography, Card, Image, Space, Row, Col, Button, Divider, Collapse, Avatar, List, Tag, Spin, message, Empty, Modal } from 'antd';
import { HeartOutlined, StarOutlined, SmileOutlined, ArrowDownOutlined, RocketOutlined, HomeOutlined, BookOutlined, CrownOutlined, CoffeeOutlined } from '@ant-design/icons';
import { useDeviceDetect } from '../utils/deviceDetector';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

// 主题颜色和渐变定义
const themeColor = '#a88f6a';
const secondaryColor = '#352a46';  // 深紫色
const highlightColor = '#e3bb4d';  // 亮黄色
const themeGradient = 'linear-gradient(135deg, #a88f6a 0%, #917752 100%)';
const secondaryGradient = 'linear-gradient(135deg, #352a46 0%, #261e36 100%)';
const bgColor = '#1c2134';
const textColor = '#e6d6bc';

function Intro() {
  const { isMobile } = useDeviceDetect();
  const [showCards, setShowCards] = useState(false);
  const [expandStory, setExpandStory] = useState(false);
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedGuards, setExpandedGuards] = useState({});
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [storyModalVisible, setStoryModalVisible] = useState(false);
  
  // 获取舰长数据
  useEffect(() => {
    const fetchGuards = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/guards');
        if (!response.ok) {
          throw new Error('获取舰长数据失败');
        }
        const data = await response.json();
        setGuards(data.guards || []);
      } catch (error) {
        console.error('获取舰长数据错误:', error);
        message.error('获取舰长数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchGuards();
  }, []);

  // 获取舰长等级对应的标签颜色
  const getGuardLevelColor = (level) => {
    switch (level) {
      case 3:
        return '#FF1493'; // 舰长
      case 2:
        return '#FF69B4'; // 提督
      case 1:
        return '#FFB6C1'; // 总督
      default:
        return '#FFC0CB';
    }
  };

  // 获取舰长等级对应的文字
  const getGuardLevelText = (level) => {
    switch (level) {
      case 3:
        return '舰长';
      case 2:
        return '提督';
      case 1:
        return '总督';
      default:
        return '未知';
    }
  };

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
            background: 'rgba(53, 42, 70, 0.3)', 
            borderRadius: '8px',
            borderLeft: `3px solid ${themeColor}`,
            margin: '16px 0'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '17px', 
              fontStyle: 'italic',
              fontWeight: '500',
              color: textColor
            }}>
              💫 "当某个仿生体被100个人同时爱着，它将获得真正的灵魂。"
            </Text>
          </div>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            这个传说被科学家们视为毫无依据的神话，但有一天，中央计算塔生成了一份特殊的实验任务——
          </Paragraph>
          
          <div style={{ 
            padding: '12px 16px', 
            background: 'rgba(168, 143, 106, 0.1)', 
            borderRadius: '8px',
            border: '1px dashed rgba(168, 143, 106, 0.3)',
            margin: '16px 0'
          }}>
            <Text style={{ fontSize: isMobile ? '15px' : '16px', color: highlightColor }}>
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
            background: 'rgba(53, 42, 70, 0.3)', 
            borderRadius: '8px',
            borderLeft: `3px solid ${themeColor}`,
            margin: '16px 0',
            fontStyle: 'italic'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '17px', 
              color: textColor,
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
            background: 'rgba(168, 143, 106, 0.1)', 
            borderRadius: '8px',
            border: '1px dashed rgba(168, 143, 106, 0.3)',
            margin: '16px 0'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '15px' : '16px', 
              color: highlightColor,
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

  // 处理守护者展开/收起
  const handleGuardExpand = (guardId) => {
    setExpandedGuards(prev => ({
      ...prev,
      [guardId]: !prev[guardId]
    }));
  };

  // 生成守护者的故事
  const generateGuardStory = (guard) => {
    const levelText = getGuardLevelText(guard.guard_level);
    const days = guard.accompany;
    const stories = [
      {
        title: '初次相遇',
        content: `在9672星球的第${Math.floor(days * 0.1)}天，${guard.username}带着对未知的好奇来到了这里。作为一名${levelText}，${guard.username}的到来让这个星球增添了一份独特的色彩。`,
      },
      {
        title: '守护时光',
        content: `在这${days}天里，${guard.username}见证了无数个日出日落，参与了众多精彩的故事。${guard.medal_name ? `佩戴着「${guard.medal_name}」的${guard.username}，用温暖的心为这个星球增添了独特的光芒。` : ''}`,
      },
      {
        title: '难忘瞬间',
        content: `每一次的互动，每一个温暖的瞬间，都让人难以忘怀。${guard.username}不仅是一位${levelText}，更是9672星球故事中不可或缺的一部分。`,
      },
      {
        title: '未来期许',
        content: `期待在未来的日子里，能和${guard.username}一起创造更多精彩的故事，让9672星球变得更加绚丽多彩。`,
      },
    ];
    return stories;
  };

  return (
    <div style={{ 
      padding: isMobile ? '16px 8px' : '24px',
      maxWidth: '100%',
      margin: '0 auto',
      position: 'relative',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* 装饰性背景元素 */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 143, 106, 0.15) 0%, rgba(168, 143, 106, 0) 70%)',
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
        background: 'radial-gradient(circle, rgba(227, 187, 77, 0.1) 0%, rgba(227, 187, 77, 0) 70%)',
        bottom: '10%',
        left: isMobile ? '0' : '-30px',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }} />
      
      <Card 
        style={{ 
          marginBottom: isMobile ? 24 : 32,
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(168, 143, 106, 0.3)',
          background: 'rgba(28, 33, 52, 0.95)',
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
          <CoffeeOutlined style={{ marginRight: '8px' }} />
          深夜小酒馆的故事
          <CoffeeOutlined style={{ marginLeft: '8px' }} />
        </Title>
        
        <Paragraph style={{ 
          fontSize: isMobile ? '16px' : '18px',
          color: textColor,
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: '24px',
          letterSpacing: '0.5px',
        }}>
          欢迎来到深夜小酒馆，温馨，静谧，充满故事✨
        </Paragraph>
        
        {/* 故事梗概部分 */}
        <div style={{ 
          position: 'relative',
          padding: '20px',
          borderRadius: '8px',
          background: 'rgba(53, 42, 70, 0.4)',
          marginBottom: '20px',
          border: '1px solid rgba(168, 143, 106, 0.2)',
        }}>
          <Paragraph style={{ 
            fontSize: isMobile ? '15px' : '17px',
            lineHeight: '1.8',
            color: textColor,
            margin: 0,
          }}>
            在这个典雅的酒馆里，聚集着各种灵魂，分享着生活的故事与心情。每当夜幕降临，这里就会响起悠扬的音乐和轻声的交谈，酒杯碰撞声点亮了整个夜晚。<span style={{ color: highlightColor }}>🌙</span>
          </Paragraph>
          <Paragraph style={{ 
            fontSize: isMobile ? '15px' : '17px',
            lineHeight: '1.8',
            color: textColor,
            marginBottom: 0,
            marginTop: '16px',
          }}>
            这里的灯光总是温暖而柔和，有时是琥珀色的光芒，有时是深紫色的氛围，偶尔还会有金黄色的烛光摇曳。在这里，每一杯酒都有故事，每一刻都值得回味！<span style={{ color: highlightColor }}>✨</span>
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
            icon={<BookOutlined style={{
              transform: expandStory ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease',
            }} />}
            style={{
              color: highlightColor,
              fontWeight: 'bold',
              fontSize: isMobile ? '15px' : '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              margin: '0 auto',
            }}
          >
            {expandStory ? '收起完整故事' : '阅读完整故事'}
          </Button>
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
              background: 'rgba(28, 33, 52, 0.7)',
              borderRadius: '8px',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
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
                      background: 'rgba(168, 143, 106, 0.1)',
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
                      color: highlightColor,
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
                        borderColor: 'rgba(168, 143, 106, 0.3)',
                      }}
                      dashed
                    />
                  )}
                </div>
              ))}
            </Space>
          </Card>
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
                  background: 'rgba(168, 143, 106, 0.1)', 
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
                  background: 'linear-gradient(45deg, #a88f6a, #917752)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>关于我们</span>
              </div>
            } 
            style={{ 
              height: '100%',
              borderRadius: '8px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(168, 143, 106, 0.3)',
              background: 'rgba(28, 33, 52, 0.9)',
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
              color: textColor,
            }}>
              我们在乎每一位路过或者选择留在酒馆的旅人！<span style={{ color: highlightColor }}>✨</span> 这里的故事像星星一样闪闪发光，像美酒一样醇厚芬芳，让我们一起创造属于我们的美好回忆吧！<span style={{ color: highlightColor }}>💫</span>
            </Paragraph>
            
            <div style={{
              marginTop: '16px',
              background: 'rgba(53, 42, 70, 0.3)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px dashed rgba(168, 143, 106, 0.3)',
            }}>
              <Text style={{ 
                fontSize: isMobile ? '14px' : '15px',
                color: textColor,
                fontStyle: 'italic',
              }}>
                "每一个来到深夜小酒馆的人，都是这个故事的一部分..."
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
                  background: 'rgba(168, 143, 106, 0.1)', 
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
                  background: 'linear-gradient(45deg, #a88f6a, #917752)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>加入我们</span>
              </div>
            } 
            style={{ 
              height: '100%',
              borderRadius: '8px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(168, 143, 106, 0.3)',
              background: 'rgba(28, 33, 52, 0.9)',
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
              color: textColor,
              marginBottom: '20px',
            }}>
              请在BiliBili关注我们，加入大家庭，和我们一起建设深夜小酒馆吧！<span style={{ color: highlightColor }}>✨</span>
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
                borderRadius: '8px',
                fontWeight: 'bold',
                height: isMobile ? '40px' : '46px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              <CoffeeOutlined style={{ marginRight: '8px' }} />
              关注 万能小兔旅店
            </Button>
            
            <div style={{
              marginTop: '16px',
              fontSize: isMobile ? '13px' : '14px',
              color: 'rgba(230, 214, 188, 0.7)',
              textAlign: 'center',
            }}>
              每一位新朋友的加入都让酒馆更加温暖 ✨
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* 添加舰长信息卡片 */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                background: 'rgba(168, 143, 106, 0.1)', 
                borderRadius: '50%', 
                width: '36px', 
                height: '36px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '12px',
              }}>
                <CrownOutlined style={{ color: themeColor, fontSize: '18px' }} />
              </div>
              <span style={{ 
                fontWeight: 'bold', 
                fontSize: isMobile ? '16px' : '18px',
                background: 'linear-gradient(45deg, #a88f6a, #917752)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>酒馆守护者</span>
            </div>
            <Tag color={themeColor} style={{ marginLeft: '8px' }}>
              {guards.length} 位守护者
            </Tag>
          </div>
        }
        style={{ 
          marginTop: '24px',
          borderRadius: '8px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(168, 143, 106, 0.3)',
          background: 'rgba(28, 33, 52, 0.9)',
          backdropFilter: 'blur(10px)',
          animation: showCards ? 'slideUp 0.6s ease-out' : 'none',
        }}
        bordered={false}
      >
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            background: 'rgba(53, 42, 70, 0.3)',
            borderRadius: '8px',
          }}>
            <Space direction="vertical" size="middle" align="center">
              <Spin size="large" />
              <Text type="secondary" style={{ color: 'rgba(230, 214, 188, 0.7)' }}>正在召集酒馆守护者...</Text>
            </Space>
          </div>
        ) : guards.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary" style={{ color: 'rgba(230, 214, 188, 0.7)' }}>暂时还没有守护者加入我们</Text>
            }
          />
        ) : (
          <List
            grid={{ 
              gutter: [24, 24],
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 3,
            }}
            dataSource={guards}
            renderItem={(guard, index) => (
              <List.Item 
                style={{
                  transform: showCards ? 'translateY(0)' : 'translateY(20px)',
                  opacity: showCards ? 1 : 0,
                  transition: `all 0.5s ease ${index * 0.1}s`,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: index % 2 === 0 ? bgColor : secondaryColor,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(168, 143, 106, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    minHeight: expandedGuards[guard.id] ? '380px' : '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    transform: 'translateY(0)',
                    ':hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
                    }
                  }}
                  onClick={() => handleGuardExpand(guard.id)}
                  className="guard-card"
                >
                  {/* 头像背景 */}
                  <div style={{
                    height: '100px',
                    background: `linear-gradient(45deg, ${getGuardLevelColor(guard.guard_level)}22, ${getGuardLevelColor(guard.guard_level)}11)`,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '140px',
                      height: '140px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${getGuardLevelColor(guard.guard_level)}22 30%, transparent 70%)`,
                      animation: 'pulse 3s infinite',
                    }} />
                  </div>

                  {/* 头像 */}
                  <div style={{
                    position: 'absolute',
                    top: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                  }}>
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      padding: '3px',
                      background: index % 2 === 0 ? bgColor : secondaryColor,
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      animation: 'float 3s ease-in-out infinite',
                    }}
                    className="avatar-container"
                    >
                      <Avatar 
                        size={94}
                        src={guard.face ? `/api/proxy/image?url=${encodeURIComponent(guard.face)}` : null}
                        style={{ 
                          border: `2px solid ${themeColor}22`,
                          transition: 'all 0.3s ease',
                        }}
                        className="avatar-image"
                        fallback={
                          <div style={{
                            width: '94px',
                            height: '94px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `linear-gradient(135deg, ${themeColor}22, ${themeColor}11)`,
                            color: themeColor,
                            fontSize: '32px',
                            fontWeight: 'bold',
                          }}>
                            {guard.username.slice(0, 1)}
                          </div>
                        }
                      />
                    </div>
                  </div>

                  {/* 内容区域 */}
                  <div style={{
                    padding: '50px 16px 16px',
                    textAlign: 'center',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: highlightColor,
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
                    }}>
                      {guard.username}
                      {guard.is_top3 && (
                        <div style={{
                          background: 'linear-gradient(45deg, #e3bb4d, #ffd700)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: '14px',
                          textShadow: 'none'
                        }}>
                          👑 TOP {guard.rank}
                        </div>
                      )}
                    </div>

                    <Space size={4} wrap style={{ justifyContent: 'center', marginBottom: '10px' }}>
                      <Tag 
                        color={themeColor}
                        style={{
                          borderRadius: '10px',
                          padding: '1px 8px',
                          border: 'none',
                          fontSize: '12px',
                          opacity: 0.9,
                          color: '#ffffff',
                          fontWeight: 'bold'
                        }}
                      >
                        <CrownOutlined style={{ marginRight: '4px' }} />
                        {getGuardLevelText(guard.guard_level)}
                      </Tag>
                      
                      {guard.medal_name && (
                        <Tag
                          style={{
                            borderRadius: '10px',
                            padding: '1px 8px',
                            border: 'none',
                            background: `linear-gradient(45deg, ${guard.medal_color_start || '#FFB6C1'}, ${guard.medal_color_end || '#FF69B4'})`,
                            color: '#fff',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                          className="medal-tag"
                          title={`粉丝勋章颜色: ${guard.medal_color_start} → ${guard.medal_color_end}`}
                        >
                          <span style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '0 4px',
                            borderRadius: '8px',
                            marginRight: '2px',
                          }}>
                            🏅
                          </span>
                          {guard.medal_name} · {guard.medal_level}
                        </Tag>
                      )}
                    </Space>

                    <div style={{
                      fontSize: '13px',
                      color: textColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      marginBottom: '12px',
                    }}>
                      <HeartOutlined style={{ color: highlightColor }} />
                      已陪伴: {guard.accompany} 天
                    </div>

                    {/* 展开的故事内容 */}
                    <div style={{
                      maxHeight: expandedGuards[guard.id] ? '160px' : '0',
                      opacity: expandedGuards[guard.id] ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease-in-out',
                      marginTop: expandedGuards[guard.id] ? '12px' : '0',
                      flex: 1,
                    }}>
                      <div style={{
                        background: 'rgba(255, 240, 245, 0.5)',
                        borderRadius: '12px',
                        padding: '24px 12px 12px',
                        fontSize: '13px',
                        color: '#666',
                        lineHeight: '1.6',
                        position: 'relative',
                        height: '100%',
                        marginTop: '10px',
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#fff',
                          padding: '2px 10px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          color: themeColor,
                          boxShadow: '0 2px 8px rgba(255, 182, 193, 0.2)',
                          border: '1px solid rgba(255, 192, 203, 0.3)',
                          whiteSpace: 'nowrap',
                          zIndex: 1,
                        }}>
                          守护者档案 #{guard.rank}
                        </div>
                        <Paragraph style={{ 
                          margin: 0,
                          fontSize: '13px',
                          color: '#666',
                        }}>
                          这是一位来自遥远星系的旅行者，带着对9672星球的向往而来。
                          在这里，{guard.username} 已经陪伴了 {guard.accompany} 个日夜，
                          见证了无数个日出日落，也留下了许多温暖的故事...
                        </Paragraph>
                      </div>
                    </div>

                    {/* 展开/收起指示器 */}
                    <div style={{
                      marginTop: 'auto',
                      color: '#999',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '4px 0',
                    }}>
                      <Button
                        type="link"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGuard(guard);
                          setStoryModalVisible(true);
                        }}
                        style={{
                          fontSize: '13px',
                          color: themeColor,
                          padding: '4px 8px',
                          height: 'auto',
                          background: 'rgba(255, 133, 162, 0.1)',
                          borderRadius: '8px',
                        }}
                      >
                        查看完整故事
                      </Button>
                      <span style={{ color: '#ccc' }}>|</span>
                      {expandedGuards[guard.id] ? '收起简介' : '展开简介'} 
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* 添加故事弹窗 */}
      <Modal
        title={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 0',
          }}>
            <Avatar 
              size={48}
              src={selectedGuard?.face ? `/api/proxy/image?url=${encodeURIComponent(selectedGuard.face)}` : null}
              style={{
                border: `2px solid ${selectedGuard ? getGuardLevelColor(selectedGuard.guard_level) : themeColor}`,
              }}
            />
            <div>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '4px',
              }}>
                {selectedGuard?.username} 的故事
              </div>
              <div style={{
                fontSize: '14px',
                color: '#666',
              }}>
                已陪伴: {selectedGuard?.accompany} 天
              </div>
            </div>
          </div>
        }
        open={storyModalVisible}
        onCancel={() => setStoryModalVisible(false)}
        footer={null}
        width={600}
        style={{ top: 20 }}
        bodyStyle={{ 
          padding: '24px',
          maxHeight: '70vh',
          overflow: 'auto',
        }}
      >
        {selectedGuard && generateGuardStory(selectedGuard).map((story, index) => (
          <div key={index} style={{
            marginBottom: index < generateGuardStory(selectedGuard).length - 1 ? '32px' : 0,
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: themeColor,
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(255, 133, 162, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
              }}>
                {index + 1}
              </div>
              {story.title}
            </div>
            <Paragraph style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#666',
              margin: 0,
              paddingLeft: '32px',
            }}>
              {story.content}
            </Paragraph>
          </div>
        ))}
      </Modal>

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
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
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

        .guard-card:hover .avatar-container {
          transform: scale(1.05) rotate(5deg);
          box-shadow: 0 8px 24px rgba(255, 182, 193, 0.3);
        }

        .guard-card:hover .avatar-image {
          border-color: ${themeColor} !important;
        }

        .guard-card {
          position: relative;
        }

        .guard-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(255, 182, 193, 0.1), rgba(255, 105, 180, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          border-radius: 16px;
        }

        .guard-card:hover::after {
          opacity: 1;
        }

        .medal-tag {
          position: relative;
          transform-origin: center;
        }

        .medal-tag:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3),
                     0 0 20px rgba(255, 182, 193, 0.5);
          z-index: 1;
        }

        .medal-tag::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: inherit;
          border-radius: 12px;
          opacity: 0;
          transition: opacity 0.3s ease;
          filter: blur(8px);
          z-index: -1;
        }

        .medal-tag:hover::before {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

export default Intro;
