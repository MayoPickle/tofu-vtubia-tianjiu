import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message, Card, Typography, Space, Divider } from 'antd';
import { SendOutlined, HeartOutlined, LoadingOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

// 粉色主题颜色
const themeColor = '#FF85A2';
const themeGradient = 'linear-gradient(135deg, #FF85A2 0%, #FF1493 100%)';

const CottonCandy = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await axios.post('/api/cotton_candy', values);
      setSubmitSuccess(true);
      message.success('棉花糖发送成功！');
      form.resetFields();
      
      // 3秒后重置成功状态
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('发送棉花糖失败', error);
      message.error('发送棉花糖失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      position: 'relative',
    }}>
      {/* 装饰性气泡背景 */}
      <div style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,192,203,0.3) 0%, rgba(255,192,203,0) 70%)',
        top: '-20px',
        right: '-20px',
        zIndex: 0,
      }} />
      
      <div style={{
        position: 'absolute',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,105,180,0.2) 0%, rgba(255,105,180,0) 70%)',
        bottom: '40px',
        left: '10px',
        zIndex: 0,
      }} />
      
      <Card
        bordered={false}
        style={{ 
          borderRadius: '16px',
          boxShadow: '0 6px 20px rgba(255, 133, 162, 0.2)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 192, 203, 0.2)',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* 顶部装饰条 */}
        <div style={{
          height: '6px',
          background: themeGradient,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
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
              <HeartOutlined style={{ marginRight: '8px' }} /> 发送棉花糖
            </Title>
            <Paragraph style={{
              fontSize: '16px',
              color: '#666',
              maxWidth: '500px',
              margin: '0 auto',
            }}>
              在这里给主播发送一个可爱的棉花糖吧！你的小心意会被送达~
            </Paragraph>
          </div>

          <Divider style={{ 
            margin: '12px 0', 
            borderColor: 'rgba(255, 133, 162, 0.2)' 
          }}/>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ sender: '幽灵DD' }}
            style={{ transition: 'all 0.3s ease' }}
          >
            <Form.Item
              name="sender"
              label={<Text strong>发送人昵称</Text>}
              rules={[{ required: true, message: '请输入发送人昵称' }]}
            >
              <Input 
                placeholder="请输入你的昵称，默认为幽灵DD" 
                allowClear 
                style={{ 
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 133, 162, 0.3)',
                  padding: '10px 12px',
                  boxShadow: 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            </Form.Item>

            <Form.Item
              name="title"
              label={<Text strong>标题（选填）</Text>}
            >
              <Input 
                placeholder="请输入标题（选填）" 
                allowClear 
                style={{ 
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 133, 162, 0.3)',
                  padding: '10px 12px',
                  boxShadow: 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            </Form.Item>

            <Form.Item
              name="content"
              label={<Text strong>内容</Text>}
              rules={[{ required: true, message: '请输入棉花糖内容' }]}
            >
              <TextArea
                placeholder="请输入你想对主播说的话"
                autoSize={{ minRows: 4, maxRows: 8 }}
                allowClear
                style={{ 
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 133, 162, 0.3)',
                  padding: '10px 12px',
                  boxShadow: 'none',
                  resize: 'none',
                  transition: 'all 0.3s ease',
                  marginBottom: '10px',
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={loading ? <LoadingOutlined /> : <SendOutlined />}
                style={{ 
                  width: '100%', 
                  height: '46px',
                  borderRadius: '10px',
                  border: 'none',
                  background: submitSuccess 
                    ? 'linear-gradient(135deg, #4CAF50, #8BC34A)' 
                    : themeGradient,
                  boxShadow: '0 4px 12px rgba(255, 133, 162, 0.3)',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                }}
              >
                {submitSuccess ? '发送成功！' : '发送棉花糖'}
              </Button>
            </Form.Item>
          </Form>
          
          <div style={{ 
            textAlign: 'center',
            padding: '8px 16px',
            background: 'rgba(255, 230, 240, 0.5)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 192, 203, 0.2)'
          }}>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              发送的棉花糖将由管理员查看，请遵守社区规范，不要发送违规内容哦~
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default CottonCandy; 