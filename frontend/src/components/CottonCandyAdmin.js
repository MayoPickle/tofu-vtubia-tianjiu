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
  Pagination
} from 'antd';
import { 
  DeleteOutlined, 
  HeartOutlined, 
  EyeOutlined, 
  CheckOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 定义粉色主题色
const themeColor = '#FF85A2';

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

  const renderItem = (candy) => (
    <List.Item>
      <Card 
        style={{ 
          width: '100%', 
          borderRadius: '12px',
          boxShadow: candy.read ? 'none' : '0 2px 8px rgba(255, 133, 162, 0.2)'
        }}
        actions={[
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(candy)}
          >
            查看
          </Button>,
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(candy.id)}
          >
            删除
          </Button>
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Badge status={candy.read ? "default" : "processing"} color={candy.read ? "default" : themeColor} />
            <Text strong>
              {candy.title || '无标题棉花糖'}
            </Text>
          </Space>

          <Paragraph ellipsis={{ rows: 2 }}>
            {candy.content}
          </Paragraph>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text type="secondary">
              来自: {candy.sender}
            </Text>
            <Text type="secondary">
              {new Date(candy.create_time).toLocaleString()}
            </Text>
          </div>
        </Space>
      </Card>
    </List.Item>
  );

  if (!isAdmin) {
    return (
      <Empty 
        description="你没有权限查看此页面" 
        image={Empty.PRESENTED_IMAGE_SIMPLE} 
      />
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2} style={{ textAlign: 'center', color: themeColor }}>
          <HeartOutlined /> 棉花糖管理
        </Title>

        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          centered
          tabBarStyle={{ color: themeColor }}
          styles={{
            ink: { 
              backgroundColor: themeColor 
            }
          }}
        >
          <TabPane tab="未读棉花糖" key="unread" />
          <TabPane tab="已读棉花糖" key="read" />
          <TabPane tab="全部棉花糖" key="all" />
        </Tabs>

        <Skeleton loading={loading} active paragraph={{ rows: 5 }}>
          {candies.length > 0 ? (
            <>
              <List
                dataSource={candies}
                renderItem={renderItem}
                itemLayout="vertical"
                split={true}
              />
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePaginationChange}
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <Empty description={`没有${activeTab === 'read' ? '已读' : (activeTab === 'unread' ? '未读' : '')}棉花糖`} />
          )}
        </Skeleton>
      </Space>

      <Modal
        title={
          <Space>
            <HeartOutlined style={{ color: themeColor }} />
            <span>{currentCandy?.title || '棉花糖详情'}</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button 
            key="delete" 
            type="text"
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
      >
        {currentCandy && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ 
              background: '#f9f9f9', 
              padding: '16px',
              borderRadius: '8px' 
            }}>
              <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                {currentCandy.content}
              </Paragraph>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">
                来自: {currentCandy.sender}
              </Text>
              <Text type="secondary">
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