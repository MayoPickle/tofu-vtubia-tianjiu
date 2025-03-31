import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Menu, Modal, Form, Input, message, Avatar, Typography, Divider, Button, Space } from 'antd';
import { UserOutlined, LogoutOutlined, LoginOutlined, UserAddOutlined, CoffeeOutlined } from '@ant-design/icons';
import axios from 'axios';
import MD5 from 'crypto-js/md5';
import { useDeviceDetect } from '../utils/deviceDetector';

const { Text } = Typography;

// 主题颜色和渐变定义 - 与Intro.js保持一致
const themeColor = '#a88f6a';
const secondaryColor = '#352a46';  // 深紫色
const highlightColor = '#e3bb4d';  // 亮黄色
const themeGradient = 'linear-gradient(135deg, #a88f6a 0%, #917752 100%)';
const secondaryGradient = 'linear-gradient(135deg, #352a46 0%, #261e36 100%)';
const bgColor = '#1c2134';
const textColor = '#e6d6bc';
const borderColor = 'rgba(168, 143, 106, 0.3)';

function AdminAuth() {
  const navigate = useNavigate();
  const { isMobile } = useDeviceDetect();

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
        message.success({
          content: '登录成功',
          style: { 
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' 
          }
        });
        setIsAdmin(res.data.is_admin);
        setUsername(res.data.username || '用户');
        setShowLoginModal(false);
        
        // 获取当前路径
        const currentPath = window.location.pathname;
        
        // 如果当前在棉花糖页面，根据管理员状态重定向
        if (currentPath === '/cotton-candy' && res.data.is_admin) {
          window.location.href = '/admin/cotton-candy';
        } else if (currentPath === '/admin/cotton-candy' && !res.data.is_admin) {
          window.location.href = '/cotton-candy';
        } else {
          // 其他页面只需刷新即可
          window.location.reload();
        }
      }
    } catch (err) {
      message.error({
        content: err.response?.data?.message || '登录失败',
        style: { 
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' 
        }
      });
    }
  };
  

  // 处理登出
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', null, { withCredentials: true });
      
      // 获取当前路径
      const currentPath = window.location.pathname;
      
      setIsAdmin(false);
      setUsername(null);
      message.success({
        content: '已登出',
        style: { 
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' 
        }
      });
      
      // 如果当前在管理员棉花糖页面，重定向到普通棉花糖页面
      if (currentPath === '/admin/cotton-candy') {
        window.location.href = '/cotton-candy';
      } else {
        // 其他页面导航到首页
        navigate('/intro');
      }
    } catch (err) {
      message.error({
        content: '登出失败',
        style: { 
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' 
        }
      });
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
        password_confirm: hashedPassword,
        bilibili_uid: values.bilibili_uid || null
      });
  
      if (res.status === 201) {
        message.success({
          content: '注册成功，请登录',
          style: { 
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' 
          }
        });
        setShowRegisterModal(false);
      }
    } catch (err) {
      message.error({
        content: err.response?.data?.message || '注册失败',
        style: { 
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' 
        }
      });
    }
  };

  // 渲染移动端界面
  const renderMobileView = () => {
    // 已登录状态
    if (username) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: secondaryColor }} />
            <Text strong style={{ color: textColor }}>{username}</Text>
            {isAdmin && <Text style={{ color: highlightColor }}>(管理员)</Text>}
          </div>
          
          <Space>
            {isAdmin && (
              <Button 
                size="small" 
                style={{
                  background: secondaryGradient,
                  borderColor: 'transparent',
                  color: textColor,
                  borderRadius: '6px'
                }}
                onClick={() => navigate('/admin/users')}
              >
                用户管理
              </Button>
            )}
            
            <Button 
              size="small" 
              danger 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                background: 'rgba(53, 42, 70, 0.5)',
                borderColor: 'rgba(255, 77, 79, 0.5)',
                color: '#ff4d4f',
                borderRadius: '6px'
              }}
            >
              退出
            </Button>
          </Space>
        </div>
      );
    }
    
    // 未登录状态
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button 
          block 
          type="primary" 
          icon={<LoginOutlined />}
          onClick={() => setShowLoginModal(true)}
          style={{
            background: themeGradient,
            borderColor: 'transparent',
            borderRadius: '6px'
          }}
        >
          登录
        </Button>
        
        <Button 
          block 
          icon={<UserAddOutlined />}
          onClick={openRegisterModal}
          style={{
            background: 'rgba(53, 42, 70, 0.5)',
            borderColor: borderColor,
            color: textColor,
            borderRadius: '6px'
          }}
        >
          注册
        </Button>
      </Space>
    );
  };

  // 渲染PC端界面
  const renderDesktopView = () => {
    // 已登录状态
    if (username) {
      const items = [
        {
          key: 'username',
          label: (
            <div style={{ padding: '4px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar icon={<UserOutlined />} style={{ flexShrink: 0, backgroundColor: secondaryColor }} />
                <Text strong style={{ fontSize: '15px', margin: 0, color: textColor }}>{username}</Text>
              </div>
            </div>
          ),
          disabled: true,
        },
        {
          type: 'divider',
          style: { margin: '4px 0', borderColor: borderColor }
        }
      ];
      
      if (isAdmin) {
        items.push({
          key: 'admin-status',
          label: (
            <div style={{ padding: '4px 0', display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: highlightColor, 
                marginRight: '8px',
                flexShrink: 0
              }}></div>
              <Text style={{ color: highlightColor, margin: 0 }}>管理员</Text>
            </div>
          ),
          disabled: true,
        });
        
        items.push({
          key: 'admin',
          label: (
            <div style={{ padding: '4px 0' }}>
              <Link to="/admin/users" style={{ 
                color: themeColor, 
                display: 'block', 
                whiteSpace: 'nowrap',
                fontSize: '14px'
              }}>用户管理</Link>
            </div>
          ),
        });
        
        items.push({
          type: 'divider',
          style: { margin: '4px 0', borderColor: borderColor }
        });
      }
      
      items.push({
        key: 'logout',
        label: (
          <div style={{ padding: '4px 0' }}>
            <a onClick={handleLogout} style={{ 
              color: '#ff4d4f', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '14px'
            }}>
              <LogoutOutlined style={{ fontSize: '14px' }} />
              <span>退出登录</span>
            </a>
          </div>
        ),
      });
      
      return (
        <Dropdown
          menu={{ 
            items,
            style: { 
              width: '140px', // 设置固定宽度
              padding: '8px 4px',
              background: bgColor,
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
              border: `1px solid ${borderColor}`
            } 
          }}
          placement="bottomRight"
          trigger={['click']}
        >
          <div style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '3px 8px', 
            borderRadius: '4px',
            transition: 'background 0.3s',
          }} 
          className="user-dropdown-trigger"
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(168, 143, 106, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Avatar size="small" icon={<UserOutlined />} style={{ flexShrink: 0, backgroundColor: secondaryColor }} />
            <span style={{ color: textColor, fontSize: '14px' }}>{username}</span>
            {isAdmin && (
              <div style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                backgroundColor: highlightColor, 
                marginLeft: '-4px',
                marginTop: '-10px',
                flexShrink: 0
              }}></div>
            )}
          </div>
        </Dropdown>
      );
    }
    
    // 未登录状态
    return (
      <div style={{ color: textColor }}>
        <a 
          style={{ 
            color: textColor,
            transition: 'opacity 0.3s'
          }} 
          onClick={() => setShowLoginModal(true)}
          className="header-link"
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          登录
        </a>
        <Divider type="vertical" style={{ backgroundColor: borderColor }} />
        <a 
          style={{ 
            color: textColor,
            transition: 'opacity 0.3s'
          }} 
          onClick={openRegisterModal}
          className="header-link"
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          注册
        </a>
      </div>
    );
  };

  return (
    <>
      {/* 根据设备类型渲染不同的界面 */}
      {isMobile ? renderMobileView() : renderDesktopView()}

      {/* 登录对话框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CoffeeOutlined style={{ color: highlightColor, marginRight: '10px' }} />
            <span style={{ color: textColor }}>登录</span>
          </div>
        }
        open={showLoginModal}
        onCancel={() => setShowLoginModal(false)}
        onOk={handleLoginSubmit}
        okText="登录"
        cancelText="取消"
        maskClosable={false}
        styles={{
          header: { 
            borderBottom: `1px solid ${borderColor}`,
            padding: '16px 24px',
            background: bgColor
          },
          body: { 
            padding: '24px',
            background: bgColor 
          },
          footer: { 
            borderTop: `1px solid ${borderColor}`,
            background: bgColor 
          },
          mask: { backdropFilter: 'blur(5px)' },
          content: { 
            background: bgColor, 
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
            border: `1px solid ${borderColor}`
          }
        }}
        okButtonProps={{
          style: {
            background: themeGradient,
            borderColor: 'transparent'
          }
        }}
        cancelButtonProps={{
          style: {
            background: 'rgba(53, 42, 70, 0.5)',
            borderColor: borderColor,
            color: textColor
          }
        }}
      >
        <Form
          form={loginForm}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label={<label style={{ color: textColor }}>用户名</label>}
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: highlightColor }} />} 
              placeholder="请输入用户名" 
              style={{ 
                backgroundColor: 'rgba(53, 42, 70, 0.3)', 
                borderColor: borderColor,
                color: textColor
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<label style={{ color: textColor }}>密码</label>}
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              placeholder="请输入密码" 
              style={{ 
                backgroundColor: 'rgba(53, 42, 70, 0.3)', 
                borderColor: borderColor,
                color: textColor
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 注册对话框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserAddOutlined style={{ color: highlightColor, marginRight: '10px' }} />
            <span style={{ color: textColor }}>注册</span>
          </div>
        }
        open={showRegisterModal}
        onOk={handleRegister}
        onCancel={() => setShowRegisterModal(false)}
        okText="注册"
        cancelText="取消"
        maskClosable={false}
        styles={{
          header: { 
            borderBottom: `1px solid ${borderColor}`,
            padding: '16px 24px',
            background: bgColor
          },
          body: { 
            padding: '24px',
            background: bgColor 
          },
          footer: { 
            borderTop: `1px solid ${borderColor}`,
            background: bgColor 
          },
          mask: { backdropFilter: 'blur(5px)' },
          content: { 
            background: bgColor, 
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
            border: `1px solid ${borderColor}`
          }
        }}
        okButtonProps={{
          style: {
            background: themeGradient,
            borderColor: 'transparent'
          }
        }}
        cancelButtonProps={{
          style: {
            background: 'rgba(53, 42, 70, 0.5)',
            borderColor: borderColor,
            color: textColor
          }
        }}
      >
        <Typography.Text style={{ display: 'block', marginBottom: 16, color: 'rgba(230, 214, 188, 0.7)' }}>
          您的密码将使用哈希加密存储，维护者也无法查看密码。
        </Typography.Text>
        <Form form={registerForm} layout="vertical">
          <Form.Item
            name="username"
            label={<label style={{ color: textColor }}>用户名</label>}
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
              { max: 20, message: '用户名最多20个字符' },
            ]}
          >
            <Input 
              placeholder="请输入用户名" 
              style={{ 
                backgroundColor: 'rgba(53, 42, 70, 0.3)', 
                borderColor: borderColor,
                color: textColor
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<label style={{ color: textColor }}>密码</label>}
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password 
              placeholder="请输入密码" 
              style={{ 
                backgroundColor: 'rgba(53, 42, 70, 0.3)', 
                borderColor: borderColor,
                color: textColor
              }}
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label={<label style={{ color: textColor }}>确认密码</label>}
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
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
            <Input.Password 
              placeholder="请再次输入密码" 
              style={{ 
                backgroundColor: 'rgba(53, 42, 70, 0.3)', 
                borderColor: borderColor,
                color: textColor
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="bilibili_uid"
            label={<label style={{ color: textColor }}>B站UID（选填）</label>}
          >
            <Input 
              placeholder="请输入你的B站UID" 
              style={{ 
                backgroundColor: 'rgba(53, 42, 70, 0.3)', 
                borderColor: borderColor,
                color: textColor
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 全局CSS样式 */}
      <style jsx="true">{`
        .ant-dropdown-menu {
          background: ${bgColor} !important;
        }
        
        .ant-dropdown-menu-item:hover {
          background: rgba(168, 143, 106, 0.2) !important;
        }
        
        .ant-divider {
          background-color: ${borderColor} !important;
        }
        
        .ant-form-item-explain-error {
          color: #ff4d4f !important;
        }
        
        .ant-input-affix-wrapper-focused,
        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper:hover,
        .ant-input:focus,
        .ant-input:hover,
        .ant-input-password:hover {
          border-color: ${highlightColor} !important;
          box-shadow: 0 0 0 2px rgba(227, 187, 77, 0.2) !important;
        }
      `}</style>
    </>
  );
}

export default AdminAuth;
