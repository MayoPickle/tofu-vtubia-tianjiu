import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Intro from './components/Intro';
import SongList from './components/SongList';
import AdminAuth from './components/AdminAuth';

const { Header, Content } = Layout;

function App() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navParam = params.get('nav');  
  const showIntro = navParam !== 'hideIntro';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* ✅ 左侧：标题 + 菜单 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>9872星球</div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['intro']} style={{ flex: 1 }}>
            {showIntro && (
              <Menu.Item key="intro">
                <Link to="/intro">介绍</Link>
              </Menu.Item>
            )}
            <Menu.Item key="songs">
              <Link to="/songs">音乐小馆</Link>
            </Menu.Item>
          </Menu>
        </div>

        {/* ✅ 右侧：管理员登录/登出组件 */}
        <AdminAuth />

      </Header>

      <Content style={{ background: '#fff' }}>
        <Routes>
          <Route path="/intro" element={<Intro />} />
          <Route path="/songs" element={<SongList />} />
          <Route path="/" element={<Navigate to="/intro" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
