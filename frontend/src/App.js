import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Intro from './components/Intro';
import axios from 'axios';
import SongList from './components/SongList';
import AdminAuth from './components/AdminAuth';
import AdminUserList from './components/AdminUserList';
import Observatory from './components/Observatory';
import LotteryWheel from './components/LotteryWheel';

const { Header, Content, Footer } = Layout;

function App() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navParam = params.get('nav');
  const showIntro = navParam !== 'hideIntro';
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* ✅ 左侧：标题 + 菜单 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>9872星球</div>

          {/* ✅ 动态更新选中项 */}
          <Menu theme="dark" mode="horizontal" selectedKeys={[getSelectedMenuKey()]}>
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
          </Menu>
        </div>

        {/* ✅ 右侧：管理员登录/登出组件 */}
        <AdminAuth />
      </Header>

      <Content>
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
      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff' }}>
        © 2025 豆腐观测站
      </Footer>
    </Layout>
  );
}

export default App;
