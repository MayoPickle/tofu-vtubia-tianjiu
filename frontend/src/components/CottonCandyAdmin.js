import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  List, 
  Card, 
  Typography, 
  Space, 
  Button, 
  Badge, 
  Tabs, 
  Modal, 
  message,
  Empty,
  Skeleton,
  Pagination,
  Divider,
  Tag
} from 'antd';
import { 
  DeleteOutlined, 
  HeartOutlined, 
  EyeOutlined, 
  CheckOutlined,
  HistoryOutlined,
  InboxOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// 定义粉色主题色
const themeColor = '#FF85A2';
const themeGradient = 'linear-gradient(135deg, #FF85A2 0%, #FF1493 100%)';

const CottonCandyAdmin = ({ isAdmin }) => {
  const [candies, setCandies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [activeTab, setActiveTab] = useState('unread');
  const [currentCandy, setCurrentCandy] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchCandies = async (page = pagination.current, status = activeTab) => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      const readParam = status === 'read' ? 'true' : (status === 'unread' ? 'false' : null);
      const res = await axios.get('/api/cotton_candy', {
        params: {
          page,
          per_page: pagination.pageSize,
          ...(readParam !== null && { read: readParam })
        }
      });
      
      setCandies(res.data.candies);
      setPagination({
        ...pagination,
        current: page,
        total: res.data.total
      });
    } catch (error) {
      console.error('获取棉花糖失败', error);
      message.error('获取棉花糖列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchCandies(1, activeTab);
    }
  }, [isAdmin, activeTab]);

  const handleView = async (candy) => {
    try {
      const res = await axios.get(`/api/cotton_candy/${candy.id}`);
      setCurrentCandy(res.data);
      setModalVisible(true);
      
      // 刷新列表，因为查看后状态会变为已读
      if (!candy.read) {
        fetchCandies(pagination.current, activeTab);
      }
    } catch (error) {
      console.error('获取棉花糖详情失败', error);
      message.error('获取棉花糖详情失败');
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个棉花糖吗？删除后将无法恢复。',
      okText: '确认',
      cancelText: '取消',
      okButtonProps: {
        style: { background: themeColor, borderColor: themeColor }
      },
      onOk: async () => {
        try {
          await axios.delete(`/api/cotton_candy/${id}`);
          message.success('删除成功');
          fetchCandies(pagination.current, activeTab);
        } catch (error) {
          console.error('删除棉花糖失败', error);
          message.error('删除棉花糖失败');
        }
      }
    });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handlePaginationChange = (page) => {
    fetchCandies(page, activeTab);
  };

  const getTabIcon = (tabKey) => {
    switch(tabKey) {
      case 'unread':
        return <InboxOutlined />;
      case 'read':
        return <CheckOutlined />;
      case 'all':
        return <HistoryOutlined />;
      default:
        return <HeartOutlined />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // 如果是今天
    if (date.toDateString() === today.toDateString()) {
      return `今天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // 返回月日时分
    return date.toLocaleString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderItem = (candy) => (
    <List.Item style={{ padding: '8px 0' }}>
      <Card 
        style={{ 
          width: '100%', 
          borderRadius: '12px',
          boxShadow: candy.read ? '0 2px 8px rgba(0, 0, 0, 0.05)' : '0 4px 12px rgba(255, 133, 162, 0.15)',
          border: candy.read ? '1px solid #f0f0f0' : '1px solid rgba(255, 192, 203, 0.3)',
          transition: 'all 0.3s ease',
          transform: candy.read ? 'translateY(0)' : 'translateY(-2px)',
        }}
        hoverable
        actions={[
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(candy)}
            style={{ color: themeColor }}
          >
            查看
          </Button>,
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(candy.id)}
            style={{ color: '#ff4d4f' }}
          >
            删除
          </Button>
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space>
              <Badge status={candy.read ? "default" : "processing"} color={candy.read ? "default" : themeColor} />
              <Text strong style={{ fontSize: '16px' }}>
                {candy.title || '无标题棉花糖'}
              </Text>
              {!candy.read && (
                <Tag color={themeColor} style={{ marginLeft: '8px' }}>
                  新消息
                </Tag>
              )}
            </Space>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <ClockCircleOutlined style={{ marginRight: '4px' }} />
              {formatDate(candy.create_time)}
            </Text>
          </div>

          <Paragraph 
            ellipsis={{ rows: 2 }}
            style={{ 
              margin: '8px 0',
              fontSize: '14px',
              color: '#333',
              background: candy.read ? 'transparent' : 'rgba(255, 240, 245, 0.5)',
              padding: candy.read ? '0' : '8px 12px',
              borderRadius: '6px'
            }}
          >
            {candy.content}
          </Paragraph>

          <div style={{ 
            padding: '6px 10px', 
            borderRadius: '20px',
            background: 'rgba(245, 245, 245, 0.5)',
            display: 'inline-block',
            fontSize: '12px',
            marginTop: '4px'
          }}>
            <HeartOutlined style={{ color: themeColor, marginRight: '4px' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              来自: {candy.sender}
            </Text>
          </div>
        </Space>
      </Card>
    </List.Item>
  );

  if (!isAdmin) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '80vh' 
      }}>
        <Empty 
          description={
            <Text style={{ color: '#666', fontSize: '16px' }}>
              你没有权限查看此页面
            </Text>
          } 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '20px',
      position: 'relative'
    }}>
      {/* 装饰性背景元素 */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,192,203,0.15) 0%, rgba(255,192,203,0) 70%)',
        top: '-50px',
        right: '-50px',
        zIndex: -1,
      }} />
      
      <div style={{
        position: 'absolute',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,105,180,0.1) 0%, rgba(255,105,180,0) 70%)',
        bottom: '20%',
        left: '-30px',
        zIndex: -1,
      }} />
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={2} style={{ 
            marginBottom: '8px',
            background: themeGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}>
            <HeartOutlined style={{ marginRight: '8px' }} /> 棉花糖管理
          </Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            管理收到的所有棉花糖信息
          </Text>
        </div>

        <Card
          bordered={false}
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(5px)',
            overflow: 'hidden',
          }}
        >
          {/* 顶部装饰条 */}
          <div style={{
            height: '4px',
            background: themeGradient,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }} />
          
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            centered
            tabBarStyle={{ marginBottom: '24px' }}
            items={[
              {
                key: 'unread',
                label: (
                  <Space>
                    {getTabIcon('unread')}
                    <span>未读棉花糖</span>
                    {candies.length > 0 && activeTab === 'unread' && (
                      <Badge count={candies.length} style={{ backgroundColor: themeColor }} />
                    )}
                  </Space>
                )
              },
              {
                key: 'read',
                label: (
                  <Space>
                    {getTabIcon('read')}
                    <span>已读棉花糖</span>
                  </Space>
                )
              },
              {
                key: 'all',
                label: (
                  <Space>
                    {getTabIcon('all')}
                    <span>全部棉花糖</span>
                  </Space>
                )
              }
            ]}
          />

          <Skeleton loading={loading} active paragraph={{ rows: 5 }}>
            {candies.length > 0 ? (
              <>
                <List
                  dataSource={candies}
                  renderItem={renderItem}
                  itemLayout="vertical"
                  split={true}
                />
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '30px',
                  padding: '15px 0 5px',
                  borderTop: '1px solid #f0f0f0',
                }}>
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePaginationChange}
                    showSizeChanger={false}
                    showQuickJumper
                  />
                </div>
              </>
            ) : (
              <Empty 
                description={
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    没有{activeTab === 'read' ? '已读' : (activeTab === 'unread' ? '未读' : '')}棉花糖
                  </Text>
                } 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ margin: '40px 0' }}
              />
            )}
          </Skeleton>
        </Card>
      </Space>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <HeartOutlined style={{ color: themeColor, marginRight: '10px', fontSize: '18px' }} />
            <Text strong style={{ fontSize: '16px' }}>
              {currentCandy?.title || '棉花糖详情'}
            </Text>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button 
            key="delete" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setModalVisible(false);
              if (currentCandy) {
                handleDelete(currentCandy.id);
              }
            }}
          >
            删除
          </Button>,
          <Button 
            key="close" 
            type="primary" 
            onClick={() => setModalVisible(false)}
            icon={<CheckOutlined />}
            style={{
              background: themeColor,
              borderColor: themeColor
            }}
          >
            关闭
          </Button>
        ]}
        width={600}
        styles={{
          header: { 
            borderBottom: '1px solid rgba(255, 192, 203, 0.2)',
            padding: '16px 24px'
          },
          body: { padding: '24px' },
          footer: { borderTop: '1px solid rgba(255, 192, 203, 0.2)' },
          mask: { backdropFilter: 'blur(5px)' }
        }}
      >
        {currentCandy && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ 
              background: 'rgba(255, 245, 250, 0.7)', 
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 192, 203, 0.2)'
            }}>
              <Paragraph style={{ 
                whiteSpace: 'pre-wrap',
                fontSize: '15px',
                lineHeight: '1.8',
                margin: 0,
              }}>
                {currentCandy.content}
              </Paragraph>
            </div>
            
            <Divider style={{ margin: '8px 0', borderColor: 'rgba(255, 192, 203, 0.2)' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ 
                padding: '6px 12px', 
                background: 'rgba(245, 245, 245, 0.7)',
                borderRadius: '20px',
              }}>
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  <HeartOutlined style={{ color: themeColor, marginRight: '5px' }} />
                  来自: {currentCandy.sender}
                </Text>
              </div>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                <ClockCircleOutlined style={{ marginRight: '5px' }} />
                {new Date(currentCandy.create_time).toLocaleString()}
              </Text>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default CottonCandyAdmin; 