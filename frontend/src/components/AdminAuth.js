import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, Modal, Form, Input, message, Avatar, Typography, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

function AdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm] = Form.useForm();

  // 新增：注册表单
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
      const res = await axios.post('/api/login', values);
      if (res.status === 200) {
        message.success('登录成功');
        setIsAdmin(res.data.is_admin);
        setUsername(res.data.username || '用户');
        setShowLoginModal(false);
      }
    } catch (err) {
      message.error(err.response?.data?.message || '登录失败');
    }
  };

  // 处理登出
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      setIsAdmin(false);
      setUsername(null);
      message.success('已登出');
    } catch (err) {
      message.error('登出失败');
    }
  };

  // ========== 注册相关 ==========

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    registerForm.resetFields();
  };

  const handleRegister = async () => {
    try {
      const values = await registerForm.validateFields();
      // 提交到 /api/register
      const res = await axios.post('/api/register', values);
      if (res.status === 201) {
        message.success('注册成功，请登录');
        setShowRegisterModal(false);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        // 用户名重名
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
        // ✅ 未登录: 显示 "管理员登录" + "注册" 按钮
        <div style={{ display: 'flex', gap: '12px' }}>
          <Text style={{ color: '#fff', cursor: 'pointer' }} onClick={() => setShowLoginModal(true)}>
            管理员登录
          </Text>
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
            <Input.Password />
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
            label="B站UID(可选)"
            name="bilibili_uid"
            tooltip="可以在B站个人页面找到，纯数字"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve(); // 可选
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
