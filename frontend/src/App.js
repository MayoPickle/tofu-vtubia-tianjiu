import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Drawer, Button, Badge, Avatar } from 'antd';
import { 
  MenuOutlined, 
  HeartOutlined, 
  CustomerServiceOutlined, 
  GiftOutlined, 
  RocketOutlined, 
  CoffeeOutlined,
  FireOutlined,
  BulbOutlined,
  ShopOutlined,
  HistoryOutlined,
  CrownOutlined
} from '@ant-design/icons';
import Intro from './components/Intro';
import axios from 'axios';
import SongList from './components/SongList';
import AdminAuth from './components/AdminAuth';
import AdminUserList from './components/AdminUserList';
import Observatory from './components/Observatory';
import LotteryWheel from './components/LotteryWheel';
import Live2DModel from './components/Live2DModel';
import CherryBlossom from './components/CherryBlossom';
import CottonCandy from './components/CottonCandy';
import CottonCandyAdmin from './components/CottonCandyAdmin';
import { useDeviceDetect } from './utils/deviceDetector';
import MobileNavGesture from './components/MobileNavGesture';


const { Header, Content, Footer } = Layout;

// 深夜小酒馆主题色常量
const themeColor = '#a88f6a';
const secondaryColor = '#352a46'; // 深紫色
const highlightColor = '#e3bb4d'; // 亮黄色
const themeGradient = 'linear-gradient(135deg, #a88f6a 0%, #917752 100%)';
const headerGradient = 'linear-gradient(to right, rgba(28, 33, 52, 0.98), rgba(46, 53, 72, 0.98))';
const secondaryGradient = 'linear-gradient(135deg, #352a46 0%, #261e36 100%)'; // 深紫色渐变

function App() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navParam = params.get('nav');
  const showIntro = navParam !== 'hideIntro';
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isMobile } = useDeviceDetect();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [unreadCandyCount, setUnreadCandyCount] = useState(0);

  // ✅ 动态确定当前路由对应的选中菜单项
  const getSelectedMenuKey = () => {
    if (location.pathname.startsWith('/intro')) return 'intro';
    if (location.pathname.startsWith('/songs')) return 'songs';
    if (location.pathname.startsWith('/lottery')) return 'lottery';
    if (location.pathname.startsWith('/observatory')) return 'observatory';
    if (location.pathname.startsWith('/cotton-candy')) return 'cotton-candy';
    if (location.pathname.startsWith('/admin/cotton-candy')) return 'cotton-candy';
    return 'intro'; // 默认高亮
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // 管理员获取未读棉花糖数量
    if (isAdmin) {
      fetchUnreadCandyCount();
    }
    
    // 当登录状态变化时，重定向到正确的页面
    const handleLoginStateChange = () => {
      const currentPath = window.location.pathname;
      
      // 棉花糖页面重定向
      if (currentPath === '/cotton-candy' && isAdmin) {
        window.location.replace('/admin/cotton-candy');
        return;
      } 
      
      if (currentPath === '/admin/cotton-candy' && !isAdmin) {
        window.location.replace('/cotton-candy');
        return;
      }
    };
    
    // 使用setTimeout确保状态已完全更新
    const timer = setTimeout(handleLoginStateChange, 100);
    return () => clearTimeout(timer);
  }, [isAdmin, isLoggedIn, location.pathname]);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/check_auth', {
        withCredentials: true
      });
  
      setIsAdmin(res.data.is_admin);
      setIsLoggedIn(!!res.data.username);
    } catch (error) {
      setIsAdmin(false);
      setIsLoggedIn(false);
    }
  };
  
  const fetchUnreadCandyCount = async () => {
    try {
      const res = await axios.get('/api/cotton_candy/unread_count');
      setUnreadCandyCount(res.data.unread_count);
    } catch (error) {
      console.error('获取未读棉花糖数量失败', error);
    }
  };

  // 菜单项配置
  const menuItems = [
    ...(showIntro ? [{ 
      key: 'intro', 
      label: <Link to="/intro">介绍</Link>, 
      icon: <FireOutlined style={{ fontSize: '16px' }} /> 
    }] : []),
    { 
      key: 'songs', 
      label: <Link to="/songs">音乐小馆</Link>, 
      icon: <CustomerServiceOutlined style={{ fontSize: '16px' }} /> 
    },
    { 
      key: 'lottery', 
      label: <Link to="/lottery">抽奖</Link>, 
      icon: <CrownOutlined style={{ fontSize: '16px' }} /> 
    },
    { 
      key: 'observatory', 
      label: <Link to="/observatory">观测站</Link>, 
      icon: <BulbOutlined style={{ fontSize: '16px' }} /> 
    },
    { 
      key: 'cotton-candy', 
      label: <Link to={isAdmin ? "/admin/cotton-candy" : "/cotton-candy"}>棉花糖</Link>, 
      icon: <ShopOutlined style={{ fontSize: '16px' }} />,
      ...(isAdmin && unreadCandyCount > 0 && { 
        badge: {
          count: unreadCandyCount,
          style: { backgroundColor: '#a88f6a' }
        }
      })
    }
  ];
  
  // 移动端布局
  if (isMobile) {
    return (
      <Layout style={{ 
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        position: 'relative',
        backgroundColor: '#121622'
      }}>
        <CherryBlossom />
        <Header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 16px',
          background: headerGradient,
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          height: '60px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ 
            color: '#e6d6bc', 
            fontSize: '18px', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Avatar 
              size={36} 
              icon={<CoffeeOutlined />} 
              style={{ 
                backgroundColor: 'rgba(168, 143, 106, 0.2)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            />
            <span style={{ 
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)',
              letterSpacing: '1px',
              fontFamily: 'Playfair Display'
            }}>深夜小酒馆</span>
          </div>
          
          <Button
            type="text"
            size="large"
            icon={<MenuOutlined style={{ color: '#e6d6bc', fontSize: '20px' }} />}
            onClick={() => setDrawerVisible(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(168, 143, 106, 0.15)',
              backdropFilter: 'blur(10px)',
              border: 'none',
            }}
          />
        </Header>

        <Drawer
          title={
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              color: '#e6d6bc',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'Playfair Display'
            }}>
              <Avatar 
                size={36} 
                icon={<CoffeeOutlined />} 
                style={{ 
                  background: themeGradient,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}
              />
              <span>深夜小酒馆</span>
            </div>
          }
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={280}
          styles={{
            body: { padding: '12px' },
            header: { 
              padding: '16px 24px', 
              borderBottom: '1px solid rgba(168, 143, 106, 0.2)',
              background: secondaryColor
            },
            mask: { backdropFilter: 'blur(5px)' },
            content: { 
              borderRadius: '8px 0 0 8px',
              overflow: 'hidden',
              background: '#1c2134',
              color: '#e6d6bc'
            }
          }}
          closeIcon={
            <Button 
              type="text" 
              shape="circle" 
              size="small"
              icon={<MenuOutlined />}
              style={{ color: highlightColor }}
            />
          }
        >
          <Menu 
            mode="vertical" 
            selectedKeys={[getSelectedMenuKey()]}
            onClick={() => setDrawerVisible(false)}
            items={menuItems}
            style={{ 
              borderRadius: '12px', 
              marginBottom: '20px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
              border: '1px solid rgba(168, 143, 106, 0.1)',
            }}
            styles={{
              item: {
                borderRadius: '8px',
                margin: '4px 0',
                fontWeight: 500,
              },
              itemSelected: {
                backgroundColor: `${secondaryColor} !important`,
                borderLeft: `3px solid ${highlightColor}`
              }
            }}
          />
          <div style={{ 
            padding: '16px',
            background: 'rgba(255, 245, 250, 0.5)',
            borderRadius: '12px',
            border: '1px solid rgba(168, 143, 106, 0.1)',
          }}>
            <AdminAuth />
          </div>
        </Drawer>

        <Content style={{ 
          padding: '16px', 
          marginBottom: '70px',
          marginTop: '8px',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          boxSizing: 'border-box'
        }} className="mobile-content">
          <Routes>
            <Route path="/intro" element={<Intro />} />
            <Route path="/songs" element={<SongList />} />
            <Route path="/" element={<Navigate to="/intro" />} />
            <Route path="/admin/users" element={<AdminUserList />} />
            <Route path="/lottery" element={<LotteryWheel isLoggedIn={isLoggedIn} />} />
            
            <Route path="/observatory" element={<Observatory isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
            
            <Route 
              path="/cotton-candy" 
              element={isAdmin ? <Navigate to="/admin/cotton-candy" /> : <CottonCandy />} 
            />
            <Route 
              path="/admin/cotton-candy" 
              element={isAdmin ? <CottonCandyAdmin isAdmin={isAdmin} /> : <Navigate to="/cotton-candy" />} 
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          <MobileNavGesture />
        </Content>

        <Footer style={{ 
          textAlign: 'center', 
          color: '#fff',
          position: 'fixed',
          bottom: 0,
          width: '100%',
          padding: '15px 0',
          background: headerGradient,
          zIndex: 1000,
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -4px 15px rgba(255, 133, 162, 0.3)',
          backdropFilter: 'blur(10px)',
          fontSize: '14px',
          fontWeight: '500',
          letterSpacing: '0.5px',
          boxSizing: 'border-box',
          left: 0
        }}>
          © 2025 豆腐观测站 <HeartOutlined style={{ margin: '0 4px' }} /> <br />
          <span style={{ fontSize: '12px', opacity: '0.9' }}>支援邮箱: support@xiaotudd.com</span>
        </Footer>
        
        <Live2DModel />
      </Layout>
    );
  }
  
  // PC端布局
  return (
    <Layout style={{ 
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#121622'
    }}>
      <CherryBlossom />
      <Header style={{ 
        position: 'fixed', 
        zIndex: 1000, 
        width: '100%',
        padding: '0 24px',
        background: headerGradient,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          height: '100%'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            height: '100%',
            gap: '16px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              height: '100%', 
              gap: '12px'
            }}>
              <Avatar 
                size={36} 
                icon={<CoffeeOutlined />} 
                style={{ 
                  background: themeGradient,
                  boxShadow: `0 2px 8px rgba(0, 0, 0, 0.3), 0 0 4px ${highlightColor}`
                }}
              />
              <span style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#e6d6bc',
                letterSpacing: '1px',
                fontFamily: 'Playfair Display'
              }}>
                深夜小酒馆
              </span>
            </div>

            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[getSelectedMenuKey()]}
              items={menuItems}
              style={{ 
                background: 'transparent', 
                borderBottom: 'none',
                flex: 1,
                marginLeft: '20px',
                fontFamily: 'Cormorant Garamond',
                fontSize: '16px',
                color: '#e6d6bc'
              }}
              styles={{
                item: {
                  marginRight: '8px',
                  borderRadius: '4px',
                  overflow: 'hidden'
                },
                itemSelected: {
                  backgroundColor: `${secondaryColor} !important`,
                  borderBottom: `2px solid ${highlightColor} !important`
                },
                itemHover: {
                  backgroundColor: 'rgba(53, 42, 70, 0.7) !important'
                }
              }}
            />
          </div>

          <div style={{
            background: 'rgba(53, 42, 70, 0.3)',
            borderRadius: '12px',
            padding: '4px 12px',
            backdropFilter: 'blur(5px)',
            border: `1px solid rgba(227, 187, 77, 0.2)`
          }}>
            <AdminAuth />
          </div>
        </div>
      </Header>

      <Content style={{ 
        padding: '24px', 
        margin: '64px auto 0', 
        maxWidth: '1200px', 
        width: '100%'
      }}>
        <div style={{ 
          minHeight: 280, 
          paddingTop: '24px',
          paddingBottom: '24px',
          width: '100%',
          color: '#e6d6bc'
        }}>
          <Routes>
            <Route path="/intro" element={<Intro />} />
            <Route path="/songs" element={<SongList />} />
            <Route path="/" element={<Navigate to="/intro" />} />
            <Route path="/admin/users" element={<AdminUserList />} />
            <Route path="/lottery" element={<LotteryWheel isLoggedIn={isLoggedIn} />} />
            
            <Route path="/observatory" element={<Observatory isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
            
            <Route 
              path="/cotton-candy" 
              element={isAdmin ? <Navigate to="/admin/cotton-candy" /> : <CottonCandy />} 
            />
            <Route 
              path="/admin/cotton-candy" 
              element={isAdmin ? <CottonCandyAdmin isAdmin={isAdmin} /> : <Navigate to="/cotton-candy" />} 
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Content>

      <Footer style={{ 
        textAlign: 'center',
        background: '#1c2134',
        color: 'rgba(230, 214, 188, 0.7)',
        borderTop: '1px solid rgba(168, 143, 106, 0.2)'
      }}>
        © 2025 豆腐观测站 <HeartOutlined style={{ margin: '0 4px' }} /> <br />
        <span style={{ fontSize: '12px', opacity: '0.9' }}>支援邮箱: support@xiaotudd.com</span>
      </Footer>
      
      <Live2DModel />
    </Layout>
  );
}

export default App;
