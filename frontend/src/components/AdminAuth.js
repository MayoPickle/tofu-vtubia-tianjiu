import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Menu, Modal, Form, Input, message, Avatar, Typography, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import MD5 from 'crypto-js/md5';

const { Text } = Typography;

function AdminAuth() {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm] = Form.useForm();

  // 注册表单
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerForm] = Form.useForm();

  useEffect(() => {
    checkAuth();
  }, []);

  // 检查是否已登录
  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/check_auth');
      if (res.data.is_admin) {
        setIsAdmin(true);
      }
      setUsername(res.data.username || null);
    } catch (err) {
      setIsAdmin(false);
      setUsername(null);
    }
  };

  // 提交登录
  const handleLoginSubmit = async () => {
    try {
      const values = await loginForm.validateFields();
      const hashedPassword = MD5(values.password).toString(); // 对密码进行 MD5 加密
  
      // 发送加密后的密码
      const res = await axios.post('/api/login', {
        username: values.username,
        password: hashedPassword
      });
  
      if (res.status === 200) {
        message.success('登录成功');
        setIsAdmin(res.data.is_admin);
        setUsername(res.data.username || '用户');
        setShowLoginModal(false);
        window.location.reload();
      }
    } catch (err) {
      message.error(err.response?.data?.message || '登录失败');
    }
  };
  

  // 处理登出
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', null, { withCredentials: true });
      setIsAdmin(false);
      setUsername(null);
      message.success('已登出');
      navigate('/intro');
    } catch (err) {
      message.error('登出失败');
    }
  };

  // 注册逻辑
  const openRegisterModal = () => {
    setShowRegisterModal(true);
    registerForm.resetFields();
  };

  const handleRegister = async () => {
    try {
      const values = await registerForm.validateFields();
      const hashedPassword = MD5(values.password).toString(); // 对密码进行 MD5 加密
  
      // 提交到 /api/register
      const res = await axios.post('/api/register', {
        username: values.username,
        password: hashedPassword,
        bilibili_uid: values.bilibili_uid || null
      });
  
      if (res.status === 201) {
        message.success('注册成功，请登录');
        setShowRegisterModal(false);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        message.error(err.response?.data?.message || '用户名已被占用');
      } else {
        message.error(err.response?.data?.message || '注册失败');
      }
    }
  };
  

  // 下拉菜单
  const menu = (
    <Menu>
      <Menu.Item key="user-info" disabled>
        <Text strong>{username || '未登录'}</Text>
      </Menu.Item>
      <Menu.Item key="role" disabled>
        {isAdmin ? '管理员' : '普通用户'}
      </Menu.Item>
      {isAdmin ? (
        <Menu.Item key="manage-users">
          <Link to="/admin/users">用户管理</Link>
        </Menu.Item>
      ) : null}
      <Menu.Divider />
      <Menu.Item key="logout" danger onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {username ? (
        // ✅ 已登录
        <Dropdown overlay={menu} placement="bottomRight">
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#fff' }}>
            <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff' }}>{username}</Text>
          </div>
        </Dropdown>
      ) : (
        // ✅ 未登录: 显示 "登录" + "注册" 按钮
        <div style={{ display: 'flex', gap: '12px' }}>
          <Text style={{ color: '#fff', cursor: 'pointer' }} onClick={() => setShowLoginModal(true)}>
            登录
          </Text>
          <Divider type="vertical" style={{ background: '#fff', height: '24px' }} />
          <Text style={{ color: '#fff', cursor: 'pointer' }} onClick={openRegisterModal}>
            注册
          </Text>
        </div>
      )}

      {/* 登录弹窗 */}
      <Modal
        title="登录"
        open={showLoginModal}
        onOk={handleLoginSubmit}
        onCancel={() => setShowLoginModal(false)}
        okText="登录"
        cancelText="取消"
      >
        {/* 重制密码提示 */}
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          如果忘记登录密码，请联系管理员重制。
        </Text>
        <Form form={loginForm} layout="vertical">
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入登录账户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 注册弹窗 */}
      <Modal
        title="注册新用户"
        open={showRegisterModal}
        onOk={handleRegister}
        onCancel={() => setShowRegisterModal(false)}
        okText="注册"
        cancelText="取消"
      >
        {/* 密码存储安全提示 */}
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          密码将以哈希形式加密存储在数据库中，网站维护者不会得知你的密码。
        </Text>

        <Form form={registerForm} layout="vertical">
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="用户名将作为登录账户" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请设置密码" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请再次输入密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>
          <Form.Item
            label="B站UID(可选)"
            name="bilibili_uid"
            tooltip="可以在B站个人页面找到，纯数字。提供UID可以自动获取头像等信息"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  if (/^\d+$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject('B站UID必须是数字');
                },
              },
            ]}
          >
            <Input placeholder="例如1234567" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AdminAuth;
