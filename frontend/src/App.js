import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Drawer, Button } from 'antd';
import { MenuOutlined, HeartOutlined, CustomerServiceOutlined, GiftOutlined, RocketOutlined, CoffeeOutlined } from '@ant-design/icons';
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

  const menuItems = [
    ...(showIntro ? [{ key: 'intro', label: <Link to="/intro">介绍</Link>, icon: <HeartOutlined /> }] : []),
    { key: 'songs', label: <Link to="/songs">音乐小馆</Link>, icon: <CustomerServiceOutlined /> },
    { key: 'lottery', label: <Link to="/lottery">抽奖</Link>, icon: <GiftOutlined /> },
    { key: 'observatory', label: <Link to="/observatory">观测站</Link>, icon: <RocketOutlined /> },
    { 
      key: 'cotton-candy', 
      label: <Link to={isAdmin ? "/admin/cotton-candy" : "/cotton-candy"}>棉花糖</Link>, 
      icon: <CoffeeOutlined />,
      ...(isAdmin && unreadCandyCount > 0 && { badge: unreadCandyCount })
    }
  ];
  
  // 移动端布局
  if (isMobile) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <CherryBlossom />
        <Header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 16px',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 2px 8px rgba(255, 133, 162, 0.3)'
        }}>
          <div style={{ 
            color: '#fff', 
            fontSize: '18px', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <HeartOutlined /> 9672星球
          </div>
          
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: '#fff', fontSize: '18px' }} />}
            onClick={() => setDrawerVisible(true)}
          />
        </Header>

        <Drawer
          title={<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><HeartOutlined /> 9672星球</div>}
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{
            body: { padding: 0 },
            header: { fontSize: '18px', fontWeight: 'bold' }
          }}
        >
          <Menu 
            mode="vertical" 
            selectedKeys={[getSelectedMenuKey()]}
            onClick={() => setDrawerVisible(false)}
            items={menuItems}
            style={{ borderRadius: '12px', margin: '8px' }}
          />
          <div style={{ padding: '16px' }}>
            <AdminAuth />
          </div>
        </Drawer>

        <Content style={{ 
          padding: '16px', 
          marginBottom: '56px',
          marginTop: '16px'
        }} className="mobile-content">
          <Routes>
            <Route path="/intro" element={<Intro />} />
            <Route path="/songs" element={<SongList />} />
            <Route path="/" element={<Navigate to="/intro" />} />
            <Route path="/admin/users" element={<AdminUserList />} />
            <Route path="/lottery" element={<LotteryWheel isLoggedIn={isLoggedIn} />} />
            
            {/* 正常渲染观测站组件，不使用动态key */}
            <Route path="/observatory" element={<Observatory isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
            
            {/* 使用条件渲染来决定显示哪个棉花糖组件 */}
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

          {/* 添加移动端滑动手势支持 */}
          <MobileNavGesture />
        </Content>

        <Footer style={{ 
          textAlign: 'center', 
          color: '#fff',
          position: 'fixed',
          bottom: 0,
          width: '100%',
          padding: '10px 0',
          zIndex: 1000,
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -2px 8px rgba(255, 133, 162, 0.3)'
        }}>
          © 2025 豆腐观测站 <HeartOutlined />
        </Footer>
        
        {/* ✅ Live2D 模型 */}
        <Live2DModel />
      </Layout>
    );
  }
  
  // PC端布局 (保留原来的布局)
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <CherryBlossom />
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 2px 8px rgba(255, 133, 162, 0.3)',
        padding: '0 24px'
      }}>
        {/* ✅ 左侧：标题 + 菜单 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '30px',
          flex: '1'
        }}>
          <div style={{ 
            color: '#fff', 
            fontSize: '20px', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}>
            <HeartOutlined /> 9672星球
          </div>

          {/* ✅ 动态更新选中项 */}
          <Menu 
            theme="dark" 
            mode="horizontal" 
            selectedKeys={[getSelectedMenuKey()]} 
            items={menuItems}
            style={{
              flex: '1',
              minWidth: '500px'
            }} 
          />
        </div>

        {/* ✅ 右侧：管理员登录/登出组件 */}
        <AdminAuth />
      </Header>

      <Content style={{ 
        padding: '24px',
        marginTop: '16px'
      }}>
        <Routes>
          <Route path="/intro" element={<Intro />} />
          <Route path="/songs" element={<SongList />} />
          <Route path="/" element={<Navigate to="/intro" />} />
          <Route path="/admin/users" element={<AdminUserList />} />
          <Route path="/lottery" element={<LotteryWheel isLoggedIn={isLoggedIn} />} />
          
          {/* 正常渲染观测站组件，不使用动态key */}
          <Route path="/observatory" element={<Observatory isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
          
          {/* 使用条件渲染来决定显示哪个棉花糖组件 */}
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
      </Content>

      {/* 全局 Footer */}
      <Footer style={{ 
        textAlign: 'center', 
        color: '#fff',
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 -2px 8px rgba(255, 133, 162, 0.3)',
        marginTop: '16px'
      }}>
        © 2025 豆腐观测站 <HeartOutlined />
      </Footer>
      
      {/* ✅ Live2D 模型 */}
      <Live2DModel />
    </Layout>
  );
}

export default App;
