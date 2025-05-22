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
      title: "1️⃣ 甜梦宇宙的奇幻起源",
      icon: <RocketOutlined />,
      content: (
        <>
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
              🔔 "叮咚！叮咚！hi！猫猫酱~"
            </Text>
          </div>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            欢迎光临「甜梦宇宙」平行世界~✨ 我是晚风甜酒！叫我甜酒、酒汁、甜老板都阔以~
          </Paragraph>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555', marginTop: '16px' }}>
            甜酒酱在这里开了一家专属于甜梦猫的小酒馆~今天是你加入小酒馆的第N天~没错，你变成了甜梦猫~🐱
          </Paragraph>
          
          <div style={{ 
            padding: '12px 16px', 
            background: 'rgba(168, 143, 106, 0.1)', 
            borderRadius: '8px',
            border: '1px dashed rgba(168, 143, 106, 0.3)',
            margin: '16px 0'
          }}>
            <Text style={{ fontSize: isMobile ? '15px' : '16px', color: highlightColor }}>
              🐱 甜梦猫是小酒馆守护者嗷~每只猫尾储存着不同年代的梦境原浆
            </Text>
          </div>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            猫猫们可通过「醉意值」解锁跨次元互动剧情，用梦境能量酿造治愈系酒饮"甜梦酒"🍾
          </Paragraph>
        </>
      )
    },
    {
      title: "2️⃣ 甜梦酒的神奇魔力",
      icon: <CoffeeOutlined />,
      content: (
        <>
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            存下一瓶甜梦酒，酿酒用孤独者的眼泪、恋人的心跳声、旅人的星光记忆，酿出了第一瓶甜梦酒。
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
              ✨ "饮下它的人，能短暂窥见内心最深处的渴望，但代价是失去当晚的梦境（对你不美好的故事会消失）......"
            </Text>
          </div>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            每天夜晚/凌晨会开门营业一直陪伴到天亮~甜老板会轻声提醒：
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
              🌙 "饮下甜梦酒的人，将用一夜梦境交换一次直视内心的勇气。"
            </Text>
          </div>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            每当小猫们来店打卡，甜梦酒醉意值就会更加香醇~醉意值满格的瞬间，焦糖的尾巴扫过我的掌心——原来童年弄丢的纸飞机，一直藏在妈妈的枕头里。
          </Paragraph>
        </>
      )
    },
    {
      title: "3️⃣ 小酒馆的精彩节目",
      icon: <SmileOutlined />,
      content: (
        <>
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555', marginBottom: '20px' }}>
            甜梦酒是旅途中的能量源泉，每一瓶甜梦酒都能为大家提供特殊的能力。在旅途中，猫猫们会遇到各种奇妙的生物和挑战。
          </Paragraph>
          
          <div style={{ 
            padding: '16px', 
            background: 'rgba(53, 42, 70, 0.3)', 
            borderRadius: '8px',
            border: `1px solid ${themeColor}44`,
            margin: '16px 0'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '17px', 
              fontWeight: 'bold',
              color: highlightColor,
              display: 'block',
              marginBottom: '12px'
            }}>
              【小酒馆每日固定节目】
            </Text>
            <Text style={{ fontSize: isMobile ? '15px' : '16px', color: textColor }}>
              🎀独属于小猫的甜酒唱片机<br/>
              点歌歌单：甜酒の歌单 - 哔哩哔哩
            </Text>
          </div>
          
          <div style={{ 
            padding: '16px', 
            background: 'rgba(168, 143, 106, 0.1)', 
            borderRadius: '8px',
            border: '1px dashed rgba(168, 143, 106, 0.3)',
            margin: '16px 0'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '17px', 
              fontWeight: 'bold',
              color: highlightColor,
              display: 'block',
              marginBottom: '12px'
            }}>
              【小酒馆周末限定节目】
            </Text>
            <Text style={{ fontSize: isMobile ? '15px' : '16px', color: textColor }}>
              🎀深夜海龟汤/深夜灵异故事<br/>
              🎀游戏GAME："PICO PARK 2"、"超级鸡马"、"蜡笔小新"、"双影奇境"、"旅者之憩 Travellers Rest"......<br/>
              🎀节日活动：新年活动/情人节/端午节/元宵/圣诞节/中秋节......
            </Text>
          </div>
        </>
      )
    },
    {
      title: "4️⃣ 特色服务与互动",
      icon: <StarOutlined />,
      content: (
        <>
          <div style={{ 
            padding: '16px', 
            background: 'rgba(53, 42, 70, 0.3)', 
            borderRadius: '8px',
            border: `1px solid ${themeColor}44`,
            margin: '16px 0'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '17px', 
              fontWeight: 'bold',
              color: highlightColor,
              display: 'block',
              marginBottom: '12px'
            }}>
              🎀甜梦猫歌曲收集鉴赏
            </Text>
            <Text style={{ fontSize: isMobile ? '15px' : '16px', color: textColor }}>
              收集到20只猫猫的歌曲即可开启<br/>
              收集地址：3826984043@qq.com
            </Text>
          </div>
          
          <div style={{ 
            padding: '16px', 
            background: 'rgba(168, 143, 106, 0.1)', 
            borderRadius: '8px',
            border: '1px dashed rgba(168, 143, 106, 0.3)',
            margin: '16px 0'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '17px', 
              fontWeight: 'bold',
              color: highlightColor,
              display: 'block',
              marginBottom: '12px'
            }}>
              🎀时间酿酒胶囊
            </Text>
            <Text style={{ fontSize: isMobile ? '15px' : '16px', color: textColor }}>
              【Dreamail】约定时间 一周年 开启<br/>
              两周年/三周年.......共同开启时间胶囊，回顾过去，展望未来～<br/>
              邀请甜梦猫写给甜酒的未来祝福，放入特制的时间酿酒胶囊中。
            </Text>
          </div>
          
          <div style={{ 
            padding: '16px', 
            background: 'rgba(53, 42, 70, 0.3)', 
            borderRadius: '8px',
            border: `1px solid ${themeColor}44`,
            margin: '16px 0'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '17px', 
              fontWeight: 'bold',
              color: highlightColor,
              display: 'block',
              marginBottom: '12px'
            }}>
              🎀树洞小酒馆
            </Text>
            <Text style={{ fontSize: isMobile ? '15px' : '16px', color: textColor, marginBottom: '12px', display: 'block' }}>
              收集到20只猫猫的故事即可开启<br/>
              "长夜漫漫，心事有时难言，这里有甜酒陪你，把心事放入树洞心事瓶，专属于你的心灵驿站～"
            </Text>
            <div style={{
              background: 'rgba(168, 143, 106, 0.1)',
              padding: '12px',
              borderRadius: '6px',
              border: '1px dashed rgba(168, 143, 106, 0.3)',
            }}>
              <Text style={{ fontSize: isMobile ? '14px' : '15px', color: textColor, display: 'block', marginBottom: '8px' }}>
                【Dreamail】点击下面的链接即可发送D-Mail给晚风甜酒Lori哦:
              </Text>
              <a 
                href="https://dreamail.cn/send?dm=8a5e047f-302d-459a-bfae-a46b509a08aa"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: highlightColor,
                  textDecoration: 'none',
                  fontSize: isMobile ? '14px' : '15px',
                  wordBreak: 'break-all',
                  display: 'inline-block',
                  padding: '4px 8px',
                  background: 'rgba(227, 187, 77, 0.1)',
                  borderRadius: '4px',
                  border: '1px solid rgba(227, 187, 77, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(227, 187, 77, 0.2)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(227, 187, 77, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                💭 发送悄悄话
              </a>
            </div>
          </div>
        </>
      )
    },
    {
      title: "5️⃣ 守护者福利与奖励",
      icon: <CrownOutlined />,
      content: (
        <>
          <div style={{ 
            padding: '16px', 
            background: 'rgba(168, 143, 106, 0.1)', 
            borderRadius: '8px',
            border: '1px dashed rgba(168, 143, 106, 0.3)',
            margin: '16px 0'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '17px', 
              fontWeight: 'bold',
              color: highlightColor,
              display: 'block',
              marginBottom: '12px'
            }}>
              【给甜梦猫的守护奖励】
            </Text>
            <Text style={{ fontSize: isMobile ? '14px' : '15px', color: textColor, lineHeight: '1.8' }}>
              🍥每天营业投喂1000电池可抽心愿劵截图挑战*1：25种以上随机心愿卷<br/><br/>
              🍥舰长：上舰心愿劵截图挑战*1：学歌劵/冠歌碎片/礼物劵/零食劵/录歌劵/电话劵/奶茶劵/上舰打折劵+绿泡泡群<br/><br/>
              🍥提督：冠歌投稿*1+定制礼物卷*1<br/><br/>
              🍥总督：定制小酒馆的节目*1+总督自定义心愿卷*1（甜老板同意的那种）是大股东嗷！！！
            </Text>
          </div>
          
          <div style={{ 
            padding: '16px', 
            background: 'rgba(53, 42, 70, 0.3)', 
            borderRadius: '8px',
            border: `1px solid ${themeColor}44`,
            margin: '16px 0'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '17px', 
              fontWeight: 'bold',
              color: highlightColor,
              display: 'block',
              marginBottom: '12px'
            }}>
              🍥冲舰奖励
            </Text>
            <Text style={{ fontSize: isMobile ? '14px' : '15px', color: textColor, lineHeight: '1.8' }}>
              （30舰）小甜酒*10份 抽奖<br/>
              （50舰）当天在舰礼物*1<br/>
              （100舰）重装小酒馆，定制甜老板的新衣
            </Text>
          </div>
        </>
      )
    },
    {
      title: "6️⃣ 晚风甜酒的悄悄话",
      icon: <HeartOutlined />,
      content: (
        <>
          <div style={{ 
            padding: '16px', 
            background: 'rgba(168, 143, 106, 0.1)', 
            borderRadius: '8px',
            border: '1px dashed rgba(168, 143, 106, 0.3)',
            margin: '16px 0'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '17px', 
              fontWeight: 'bold',
              color: highlightColor,
              display: 'block',
              marginBottom: '12px'
            }}>
              【营业通知】
            </Text>
            <Text style={{ fontSize: isMobile ? '15px' : '16px', color: textColor }}>
              小企鹅：976217864<br/>
              网某云：晚风甜酒
            </Text>
          </div>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555', marginTop: '16px' }}>
            声音是有温度的，夜晚的声音会发光。我们的相识是从声音开始，透过麦克风穿过耳机，让你更靠近我。
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
              💕 "我喜欢这份小酒馆的故事，我愿意和你一起书写的很长很长，不知道看到这里的猫猫你愿不愿意吖？"
            </Text>
          </div>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            双子座的我可能会有双重性格，每天的好状态取决于肚子有没有吃饱，有没有魔法期，有没有洗香香......
          </Paragraph>
          
          <Paragraph style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.8', color: '#555' }}>
            因为是倒时差营业，对甜酒的身体还是有影响的，猫咪们如果遇到我状态不好的时候，可以贴贴我嘛～
          </Paragraph>
          
          <div style={{ 
            padding: '16px', 
            background: 'rgba(53, 42, 70, 0.3)', 
            borderRadius: '8px',
            border: `1px solid ${themeColor}44`,
            margin: '16px 0'
          }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '17px', 
              fontWeight: 'bold',
              color: highlightColor,
              display: 'block',
              marginBottom: '12px'
            }}>
              📮 意见箱
            </Text>
            <Text style={{ fontSize: isMobile ? '15px' : '16px', color: textColor, marginBottom: '12px', display: 'block' }}>
              要是甜酒有什么不对的地方，可以悄悄告诉我吗～
            </Text>
            <div style={{
              background: 'rgba(168, 143, 106, 0.1)',
              padding: '12px',
              borderRadius: '6px',
              border: '1px dashed rgba(168, 143, 106, 0.3)',
            }}>
              <Text style={{ fontSize: isMobile ? '14px' : '15px', color: textColor, display: 'block', marginBottom: '8px' }}>
                【Dreamail】点击下面的链接即可发送D-Mail给晚风甜酒Lori哦:
              </Text>
              <a 
                href="https://dreamail.cn/send?dm=d62f8683-474c-4bc1-9208-6ef6d7eccc16"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: highlightColor,
                  textDecoration: 'none',
                  fontSize: isMobile ? '14px' : '15px',
                  wordBreak: 'break-all',
                  display: 'inline-block',
                  padding: '4px 8px',
                  background: 'rgba(227, 187, 77, 0.1)',
                  borderRadius: '4px',
                  border: '1px solid rgba(227, 187, 77, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(227, 187, 77, 0.2)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(227, 187, 77, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                💌 发送意见邮件
              </a>
            </div>
          </div>
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
          maxHeight: expandStory ? 'none' : '0',
          overflow: expandStory ? 'visible' : 'hidden',
          transition: expandStory ? 'all 0.8s ease, max-height 0s' : 'all 0.8s ease',
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
              href="https://space.bilibili.com/3546696388708380" 
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
              关注 晚风甜酒Lori
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
                        className="story-button"
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
            background: secondaryColor,
            margin: '-20px -24px 20px',
            padding: '16px 24px',
            borderBottom: `1px solid ${themeColor}44`,
            borderRadius: '8px 8px 0 0',
          }}>
            <Avatar 
              size={48}
              src={selectedGuard?.face ? `/api/proxy/image?url=${encodeURIComponent(selectedGuard.face)}` : null}
              style={{
                border: `2px solid ${selectedGuard ? getGuardLevelColor(selectedGuard.guard_level) : themeColor}`,
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
              }}
            />
            <div>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '4px',
                color: highlightColor,
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
              }}>
                {selectedGuard?.username} 的故事
              </div>
              <div style={{
                fontSize: '14px',
                color: textColor,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <HeartOutlined style={{ color: highlightColor }} />
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
          background: bgColor,
          borderRadius: '0 0 8px 8px',
          position: 'relative',
          backgroundImage: `
            linear-gradient(rgba(28, 33, 52, 0.95), rgba(28, 33, 52, 0.95)),
            url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23a88f6a' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 0h20v20H0V0zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm-8-7a8 8 0 1 1 16 0 8 8 0 0 1-16 0z'/%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
        modalRender={(modal) => (
          <div style={{
            background: bgColor,
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            border: `1px solid ${themeColor}44`,
          }}>
            {/* 酒杯装饰 */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontSize: '24px',
              color: highlightColor,
              textShadow: '0 0 10px rgba(227, 187, 77, 0.5)',
              zIndex: 2,
              transform: 'rotate(15deg)',
              animation: 'float 3s ease-in-out infinite',
            }}>
              🍷
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '15px',
              fontSize: '20px',
              color: highlightColor,
              zIndex: 2,
              transform: 'rotate(-10deg)',
              animation: 'float 4s ease-in-out infinite',
            }}>
              🥃
            </div>
            
            {/* 蜡烛装饰 */}
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '18px',
              fontSize: '18px',
              zIndex: 2,
              animation: 'candleLight 2s ease-in-out infinite',
            }}>
              🕯️
            </div>
            
            {/* 酒桶装饰 */}
            <div style={{
              position: 'absolute',
              bottom: '15px',
              right: '20px',
              fontSize: '20px',
              zIndex: 2,
              animation: 'float 5s ease-in-out infinite',
            }}>
              🪣
            </div>
            
            {/* 装饰性背景元素 */}
            <div style={{
              position: 'absolute',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168, 143, 106, 0.15) 0%, rgba(168, 143, 106, 0) 70%)',
              top: '10%',
              right: '0',
              zIndex: 0,
              pointerEvents: 'none',
              overflow: 'hidden'
            }} />
            
            <div style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(227, 187, 77, 0.1) 0%, rgba(227, 187, 77, 0) 70%)',
              bottom: '10%',
              left: '5%',
              zIndex: 0,
              pointerEvents: 'none',
              overflow: 'hidden'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              {selectedGuard && generateGuardStory(selectedGuard).map((story, index) => (
                <div key={index} style={{
                  marginBottom: index < generateGuardStory(selectedGuard).length - 1 ? '32px' : 0,
                  background: `rgba(${secondaryColor.slice(1).match(/../g).map(hex => parseInt(hex, 16)).join(', ')}, 0.4)`,
                  borderRadius: '8px',
                  padding: '16px',
                  border: `1px solid ${themeColor}22`,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundImage: `
                    linear-gradient(rgba(53, 42, 70, 0.6), rgba(53, 42, 70, 0.6)),
                    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm32-63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a88f6a' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")
                  `,
                  backgroundSize: '100px 100px',
                }}>
                  {/* 玻璃杯反光效果 */}
                  <div className="glass-shine"></div>
                  
                  {/* 装饰性边角 */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '20px',
                    height: '20px',
                    borderTop: `2px solid ${highlightColor}66`,
                    borderLeft: `2px solid ${highlightColor}66`,
                    borderRadius: '4px 0 0 0',
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '20px',
                    height: '20px',
                    borderBottom: `2px solid ${highlightColor}66`,
                    borderRight: `2px solid ${highlightColor}66`,
                    borderRadius: '0 0 4px 0',
                  }} />
                  
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: highlightColor,
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: themeColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      color: '#fff',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                      {story.title}
                    </div>
                  </div>
                  <Paragraph style={{
                    fontSize: '14px',
                    lineHeight: '1.8',
                    color: textColor,
                    margin: 0,
                    paddingLeft: '36px',
                    position: 'relative',
                  }}>
                    <span style={{ 
                      position: 'absolute',
                      left: '0',
                      top: '0',
                      fontSize: '22px',
                      color: `${themeColor}66`,
                      fontFamily: 'serif',
                      lineHeight: '1',
                    }}>❝</span>
                    {story.content}
                    <span style={{ 
                      position: 'absolute',
                      right: '0',
                      bottom: '-10px',
                      fontSize: '22px',
                      color: `${themeColor}66`,
                      fontFamily: 'serif',
                      lineHeight: '1',
                    }}>❞</span>
                  </Paragraph>
                </div>
              ))}
            </div>
          </div>
        )}
        closeIcon={<span style={{ color: textColor }}>×</span>}
      >
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
        
        @keyframes candleLight {
          0%, 100% {
            text-shadow: 0 0 8px rgba(255, 183, 77, 0.6),
                       0 0 12px rgba(255, 183, 77, 0.4),
                       0 0 16px rgba(255, 160, 38, 0.2);
            opacity: 0.9;
          }
          50% {
            text-shadow: 0 0 10px rgba(255, 183, 77, 0.8),
                       0 0 16px rgba(255, 183, 77, 0.6),
                       0 0 20px rgba(255, 160, 38, 0.4);
            opacity: 1;
          }
        }
        
        @keyframes shimmer {
          0% {
            opacity: 0.4;
            transform: skewX(-20deg) translateX(-150%);
          }
          100% {
            opacity: 0.2;
            transform: skewX(-20deg) translateX(250%);
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

        .story-button:hover {
          color: ${highlightColor} !important;
          background: rgba(53, 42, 70, 0.6) !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          border-color: transparent !important;
        }
        
        .glass-shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0) 70%);
          animation: shimmer 3s infinite;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

export default Intro;
