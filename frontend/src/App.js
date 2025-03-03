import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Switch } from 'antd';
import Intro from './components/Intro';
import axios from 'axios';
import SongList from './components/SongList';
import AdminAuth from './components/AdminAuth';
import AdminUserList from './components/AdminUserList';
import Observatory from './components/Observatory';
import LotteryWheel from './components/LotteryWheel';
import Live2DBackground from './components/Live2DBackground';
import './components/live2d-fixes.css'; // 导入Live2D样式修复

const { Header, Content, Footer } = Layout;

function App() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navParam = params.get('nav');
  const showIntro = navParam !== 'hideIntro';
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLive2D, setShowLive2D] = useState(true); // 默认显示Live2D模型

  // 使用localStorage保存Live2D显示状态
  useEffect(() => {
    const savedLive2DState = localStorage.getItem('showLive2D');
    if (savedLive2DState !== null) {
      setShowLive2D(savedLive2DState === 'true');
    }
  }, []);

  // 更新Live2D显示状态时保存到localStorage
  useEffect(() => {
    localStorage.setItem('showLive2D', showLive2D);
  }, [showLive2D]);

  // ✅ 动态确定当前路由对应的选中菜单项
  const getSelectedMenuKey = () => {
    if (location.pathname.startsWith('/intro')) return 'intro';
    if (location.pathname.startsWith('/songs')) return 'songs';
    if (location.pathname.startsWith('/lottery')) return 'lottery';
    if (location.pathname.startsWith('/observatory')) return 'observatory';
    return 'intro'; // 默认高亮
  };

  useEffect(() => {
    checkAuth();
  }, []);

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
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Live2D背景组件 */}
      {showLive2D && <Live2DBackground />}
      
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* ✅ 左侧：标题 + 菜单 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>9872星球</div>

          {/* ✅ 动态更新选中项 */}
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[getSelectedMenuKey()]}
          >
            {showIntro && (
              <Menu.Item key="intro">
                <Link to="/intro">介绍</Link>
              </Menu.Item>
            )}
            <Menu.Item key="songs">
              <Link to="/songs">音乐小馆</Link>
            </Menu.Item>

            <Menu.Item key="lottery">
              <Link to="/lottery">抽奖</Link>
            </Menu.Item>

            <Menu.Item key="observatory">
              <Link to="/observatory">观测站</Link>
            </Menu.Item>
            
            {/* Live2D控制开关 */}
            <Menu.Item key="live2d-control">
              <span>
                Live2D:
                <Switch 
                  checked={showLive2D} 
                  onChange={setShowLive2D} 
                  size="small" 
                  style={{ marginLeft: '8px' }} 
                />
              </span>
            </Menu.Item>
          </Menu>
        </div>

        {/* ✅ 右侧：管理员登录/登出组件 */}
        <AdminAuth />
      </Header>

      <Content className="with-live2d-background">
        <Routes>
          <Route path="/intro" element={<Intro />} />
          <Route path="/songs" element={<SongList />} />
          <Route path="/" element={<Navigate to="/intro" />} />
          <Route path="/admin/users" element={<AdminUserList />} />
          <Route path="/lottery" element={<LotteryWheel isLoggedIn={isLoggedIn} />} />
          <Route path="/observatory" element={<Observatory isLoggedIn={isLoggedIn} isAdmin={isAdmin}/>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Content>

      {/* 全局 Footer */}
      <Footer style={{ textAlign: 'center' }}>
        © 2025 豆腐观测站
      </Footer>
    </Layout>
  );
}

export default App;
