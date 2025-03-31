// AdminUserList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Space, Typography, Card, List, Avatar, Tag, Tooltip, Badge } from 'antd';
import { UserOutlined, KeyOutlined, CrownOutlined, ReloadOutlined, TeamOutlined, StarOutlined, UserSwitchOutlined, CoffeeOutlined } from '@ant-design/icons';
import { useDeviceDetect } from '../utils/deviceDetector';

const { Title, Text } = Typography;

// 主题颜色和渐变定义 - 与Intro.js保持一致
const themeColor = '#a88f6a';
const secondaryColor = '#352a46';  // 深紫色
const highlightColor = '#e3bb4d';  // 亮黄色
const themeGradient = 'linear-gradient(135deg, #a88f6a 0%, #917752 100%)';
const secondaryGradient = 'linear-gradient(135deg, #352a46 0%, #261e36 100%)';
const bgColor = '#1c2134';
const textColor = '#e6d6bc';
const borderColor = 'rgba(168, 143, 106, 0.3)';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const { isMobile } = useDeviceDetect();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
      // 添加淡入效果
      setTimeout(() => setFadeIn(true), 100);
    } catch (err) {
      message.error({
        content: err.response?.data?.message || '获取用户列表失败',
        style: { borderRadius: '10px' }
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId, username) => {
    try {
      await axios.post(`/api/users/${userId}/reset_password`); 
      message.success({
        content: `用户 ${username} 密码已重置为 'xiaotu123'`,
        icon: <KeyOutlined style={{ color: highlightColor }} />,
        style: { 
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' 
        }
      });
    } catch (err) {
      message.error({
        content: err.response?.data?.message || '重置密码失败',
        style: { borderRadius: '10px' }
      });
    }
  };

  const handleToggleAdmin = async (userId, username, isCurrentlyAdmin) => {
    try {
      const res = await axios.post(`/api/users/${userId}/toggle_admin`);
      message.success({
        content: `${username} ${isCurrentlyAdmin ? '已取消管理员权限' : '已设为管理员'}`,
        icon: <CrownOutlined style={{ color: isCurrentlyAdmin ? '#888' : highlightColor }} />,
        style: { 
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' 
        }
      });
      setUsers((prev) => prev.map(u => {
        if (u.id === userId) {
          return { ...u, is_admin: res.data.is_admin };
        }
        return u;
      }));
    } catch (err) {
      message.error({
        content: err.response?.data?.message || '更新管理员权限失败',
        style: { borderRadius: '10px' }
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 随机颜色生成器，为用户头像选择不同的柔和颜色
  const getAvatarColor = (userId) => {
    const colors = [
      themeColor, secondaryColor, highlightColor, '#614092', 
      '#917752', '#48385f', '#d5a520', '#4a3072'
    ];
    return colors[userId % colors.length];
  };

  // 渲染用户标签 (管理员状态)
  const renderAdminTag = (isAdmin) => (
    isAdmin ? (
      <Tag color={highlightColor} style={{ 
        borderRadius: '12px', 
        display: 'inline-flex', 
        alignItems: 'center', 
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}>
        <CrownOutlined style={{ marginRight: '4px' }} />管理员
      </Tag>
    ) : (
      <Tag color={secondaryColor} style={{ 
        borderRadius: '12px',
        display: 'inline-flex', 
        alignItems: 'center'
      }}>
        <UserOutlined style={{ marginRight: '4px' }} />普通用户
      </Tag>
    )
  );

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id', 
      width: 60,
      render: (id) => (
        <Text strong style={{ color: textColor }}>{id}</Text>
      )
    },
    { 
      title: '用户信息', 
      dataIndex: 'username', 
      key: 'username',
      render: (username, record) => (
        <Space>
          <Avatar 
            style={{ 
              backgroundColor: getAvatarColor(record.id),
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} 
            icon={<UserOutlined />}
          />
          <Space direction="vertical" size={0}>
            <Text strong style={{ color: textColor }}>{username}</Text>
            <Text style={{ fontSize: '12px', color: 'rgba(230, 214, 188, 0.7)' }}>
              B站UID: {record.bilibili_uid || '未绑定'}
            </Text>
          </Space>
        </Space>
      ),
      responsive: ['sm']
    },
    {
      title: '权限',
      dataIndex: 'is_admin',
      key: 'is_admin',
      render: (isAdmin) => renderAdminTag(isAdmin),
      responsive: ['sm']
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        const isAdmin = record.is_admin;
        return (
          <Space direction={isMobile ? 'vertical' : 'horizontal'} size="small">
            <Button 
              size={isMobile ? 'small' : 'middle'} 
              icon={<KeyOutlined />}
              onClick={() => handleResetPassword(record.id, record.username)}
              style={{
                borderRadius: '8px',
                transition: 'all 0.3s',
                background: 'rgba(53, 42, 70, 0.5)',
                border: `1px solid ${borderColor}`,
                color: textColor
              }}
              className="action-button"
            >
              重置密码
            </Button>
            <Button 
              size={isMobile ? 'small' : 'middle'} 
              type={isAdmin ? 'default' : 'primary'}
              icon={isAdmin ? <UserSwitchOutlined /> : <CrownOutlined />}
              onClick={() => handleToggleAdmin(record.id, record.username, isAdmin)}
              style={{
                borderRadius: '8px',
                transition: 'all 0.3s',
                ...(isAdmin ? {
                  background: 'rgba(53, 42, 70, 0.5)',
                  border: `1px solid ${borderColor}`,
                  color: textColor
                } : {
                  background: themeGradient,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                })
              }}
              className="action-button"
            >
              {isAdmin ? '取消管理员' : '设为管理员'}
            </Button>
          </Space>
        );
      },
    }
  ];

  // 移动端列表视图
  const renderMobileList = () => (
    <List
      loading={loading}
      dataSource={users}
      renderItem={user => (
        <Card 
          size="small" 
          hoverable
          style={{ 
            marginBottom: '12px',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            border: `1px solid ${borderColor}`,
            overflow: 'hidden',
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.3s ease',
            transitionDelay: `${user.id % 10 * 50}ms`,
            background: 'rgba(28, 33, 52, 0.8)',
          }}
          className="user-card"
        >
          <List.Item.Meta
            avatar={
              <Avatar 
                size="large" 
                style={{ 
                  backgroundColor: getAvatarColor(user.id),
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} 
                icon={<UserOutlined />} 
              />
            }
            title={
              <Space>
                <Text strong style={{ fontSize: '16px', color: textColor }}>{user.username}</Text>
                {renderAdminTag(user.is_admin)}
              </Space>
            }
            description={
              <Space direction="vertical" size={2} style={{ marginTop: '4px' }}>
                <Text style={{ fontSize: '13px', color: 'rgba(230, 214, 188, 0.7)' }}>
                  <span style={{ color: 'rgba(230, 214, 188, 0.9)' }}>ID:</span> {user.id}
                </Text>
                <Text style={{ fontSize: '13px', color: 'rgba(230, 214, 188, 0.7)' }}>
                  <span style={{ color: 'rgba(230, 214, 188, 0.9)' }}>B站UID:</span> {user.bilibili_uid || '未绑定'}
                </Text>
              </Space>
            }
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            marginTop: '12px',
            borderTop: `1px dashed ${borderColor}`,
            paddingTop: '12px'
          }}>
            <Button 
              size="small" 
              icon={<KeyOutlined />}
              onClick={() => handleResetPassword(user.id, user.username)}
              style={{
                flex: 1,
                marginRight: '8px',
                borderRadius: '8px',
                background: 'rgba(53, 42, 70, 0.5)',
                border: `1px solid ${borderColor}`,
                color: textColor,
                transition: 'all 0.3s',
              }}
              className="action-button"
            >
              重置密码
            </Button>
            <Button 
              size="small" 
              type={user.is_admin ? 'default' : 'primary'}
              icon={user.is_admin ? <UserSwitchOutlined /> : <CrownOutlined />}
              onClick={() => handleToggleAdmin(user.id, user.username, user.is_admin)}
              style={{
                flex: 1,
                borderRadius: '8px',
                transition: 'all 0.3s',
                ...(user.is_admin ? {
                  background: 'rgba(53, 42, 70, 0.5)',
                  border: `1px solid ${borderColor}`,
                  color: textColor
                } : {
                  background: themeGradient,
                  border: 'none',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                })
              }}
              className="action-button"
            >
              {user.is_admin ? '取消管理员' : '设为管理员'}
            </Button>
          </div>
        </Card>
      )}
    />
  );

  return (
    <div style={{ 
      padding: isMobile ? '16px 8px' : '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* 装饰性背景元素 */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(168, 143, 106, 0.15) 0%, rgba(168, 143, 106, 0) 70%)`,
        top: isMobile ? '5%' : '10%',
        right: '-50px',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }} />
      
      <div style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(227, 187, 77, 0.1) 0%, rgba(227, 187, 77, 0) 70%)`,
        bottom: isMobile ? '5%' : '10%',
        left: '-30px',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }} />
      
      {/* 标题区域 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: isMobile ? '16px' : '24px',
      }}>
        <div style={{ 
          background: 'rgba(53, 42, 70, 0.4)', 
          borderRadius: '50%', 
          width: isMobile ? '40px' : '48px', 
          height: isMobile ? '40px' : '48px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginRight: '16px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
        }}>
          <CoffeeOutlined style={{ 
            color: highlightColor, 
            fontSize: isMobile ? '20px' : '24px' 
          }} />
        </div>
        <div>
          <Title 
            level={isMobile ? 3 : 2} 
            style={{ 
              margin: 0,
              fontSize: isMobile ? '20px' : '26px',
              background: themeGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            用户管理
          </Title>
          <Text style={{ color: textColor, fontSize: isMobile ? '13px' : '14px' }}>
            总用户数: <Badge count={users.length} style={{ backgroundColor: highlightColor }} />
          </Text>
        </div>
        
        {/* 刷新按钮 */}
        <Tooltip title="刷新用户列表">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchUsers}
            loading={loading}
            style={{
              marginLeft: 'auto',
              borderRadius: '50%',
              width: isMobile ? '34px' : '36px',
              height: isMobile ? '34px' : '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${borderColor}`,
              color: highlightColor,
              background: 'rgba(53, 42, 70, 0.4)',
              transition: 'all 0.3s ease',
            }}
            className="refresh-button"
          />
        </Tooltip>
      </div>
      
      {/* 卡片容器 */}
      <Card
        bordered={false}
        style={{
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          border: `1px solid ${borderColor}`,
          overflow: 'hidden',
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease',
          background: 'rgba(28, 33, 52, 0.95)',
          animation: 'slideDown 0.6s ease-out',
        }}
        bodyStyle={{ 
          padding: isMobile ? '12px 8px' : '16px'
        }}
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
        
        {isMobile ? renderMobileList() : (
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={Array.isArray(users) ? users : []}
            scroll={{ x: 'max-content' }}
            pagination={{
              defaultPageSize: 10,
              size: isMobile ? 'small' : 'default',
              style: { marginTop: '16px' }
            }}
            rowClassName={(record, index) => 
              `table-row ${fadeIn ? 'fade-in' : ''}`
            }
            style={{ transition: 'all 0.3s ease' }}
          />
        )}
      </Card>

      {/* 全局CSS样式 */}
      <style jsx="true">{`
        .user-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }
        
        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
          background: rgba(53, 42, 70, 0.8) !important;
        }
        
        .refresh-button:hover {
          transform: rotate(180deg);
          background: rgba(53, 42, 70, 0.7);
        }
        
        .table-row {
          transition: all 0.3s ease;
        }
        
        .table-row:hover {
          background-color: rgba(53, 42, 70, 0.4) !important;
        }
        
        .fade-in {
          animation: fadeInAnimation 0.5s ease forwards;
        }
        
        @keyframes fadeInAnimation {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
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
        
        /* 美化表格样式 */
        .ant-table {
          background: transparent !important;
          color: ${textColor} !important;
        }
        
        .ant-table-thead > tr > th {
          background: rgba(53, 42, 70, 0.5) !important;
          color: ${textColor} !important;
          font-weight: bold;
          border-bottom: 1px solid ${borderColor} !important;
        }
        
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid ${borderColor} !important;
          color: ${textColor} !important;
          background: transparent !important;
        }
        
        .ant-table-tbody > tr.ant-table-row:hover > td {
          background: rgba(53, 42, 70, 0.4) !important;
        }
        
        /* 表格分页器样式 */
        .ant-pagination-item-active {
          border-color: ${highlightColor} !important;
          background: rgba(168, 143, 106, 0.2) !important;
        }
        
        .ant-pagination-item-active a {
          color: ${highlightColor} !important;
        }
        
        .ant-pagination-item a {
          color: ${textColor} !important;
        }
        
        .ant-pagination-prev button, 
        .ant-pagination-next button,
        .ant-pagination-jump-prev button,
        .ant-pagination-jump-next button {
          color: ${textColor} !important;
          background: rgba(53, 42, 70, 0.3) !important;
          border-color: ${borderColor} !important;
        }
        
        .ant-empty-description {
          color: ${textColor} !important;
        }
      `}</style>
    </div>
  );
}

export default AdminUserList;
