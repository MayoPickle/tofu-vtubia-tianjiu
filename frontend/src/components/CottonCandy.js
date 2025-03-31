import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message, Card, Typography, Space, Divider } from 'antd';
import { SendOutlined, HeartOutlined, LoadingOutlined, CoffeeOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

// 主题颜色和渐变定义 - 与Intro.js保持一致
const themeColor = '#a88f6a';
const secondaryColor = '#352a46';  // 深紫色
const highlightColor = '#e3bb4d';  // 亮黄色
const themeGradient = 'linear-gradient(135deg, #a88f6a 0%, #917752 100%)';
const secondaryGradient = 'linear-gradient(135deg, #352a46 0%, #261e36 100%)';
const bgColor = '#1c2134';
const textColor = '#e6d6bc';

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
      {/* 装饰性背景元素 */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(168, 143, 106, 0.15) 0%, rgba(168, 143, 106, 0) 70%)`,
        top: '-20px',
        right: '-20px',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }} />
      
      <div style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(227, 187, 77, 0.1) 0%, rgba(227, 187, 77, 0) 70%)`,
        bottom: '40px',
        left: '10px',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }} />
      
      <Card
        bordered={false}
        style={{ 
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          background: 'rgba(28, 33, 52, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid rgba(168, 143, 106, 0.3)`,
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          animation: 'slideDown 0.6s ease-out',
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
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ 
              marginBottom: '8px',
              background: themeGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}>
              <CoffeeOutlined style={{ marginRight: '8px' }} /> 发送棉花糖 <CoffeeOutlined style={{ marginLeft: '8px' }} />
            </Title>
            <Paragraph style={{
              fontSize: '16px',
              color: textColor,
              maxWidth: '500px',
              margin: '0 auto',
            }}>
              在这里给主播发送一个可爱的棉花糖吧！你的小心意会被送达~
            </Paragraph>
          </div>

          <Divider style={{ 
            margin: '12px 0', 
            borderColor: `rgba(168, 143, 106, 0.3)` 
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
              label={<Text strong style={{ color: textColor }}>发送人昵称</Text>}
              rules={[{ required: true, message: '请输入发送人昵称' }]}
            >
              <Input 
                placeholder="请输入你的昵称，默认为幽灵DD" 
                allowClear 
                style={{ 
                  borderRadius: '8px',
                  border: `1px solid rgba(168, 143, 106, 0.3)`,
                  padding: '10px 12px',
                  boxShadow: 'none',
                  transition: 'all 0.3s ease',
                  background: 'rgba(53, 42, 70, 0.3)',
                  color: textColor,
                }}
              />
            </Form.Item>

            <Form.Item
              name="title"
              label={<Text strong style={{ color: textColor }}>标题（选填）</Text>}
            >
              <Input 
                placeholder="请输入标题（选填）" 
                allowClear 
                style={{ 
                  borderRadius: '8px',
                  border: `1px solid rgba(168, 143, 106, 0.3)`,
                  padding: '10px 12px',
                  boxShadow: 'none',
                  transition: 'all 0.3s ease',
                  background: 'rgba(53, 42, 70, 0.3)',
                  color: textColor,
                }}
              />
            </Form.Item>

            <Form.Item
              name="content"
              label={<Text strong style={{ color: textColor }}>内容</Text>}
              rules={[{ required: true, message: '请输入棉花糖内容' }]}
            >
              <TextArea
                placeholder="请输入你想对主播说的话"
                autoSize={{ minRows: 4, maxRows: 8 }}
                allowClear
                style={{ 
                  borderRadius: '8px',
                  border: `1px solid rgba(168, 143, 106, 0.3)`,
                  padding: '10px 12px',
                  boxShadow: 'none',
                  resize: 'none',
                  transition: 'all 0.3s ease',
                  marginBottom: '10px',
                  background: 'rgba(53, 42, 70, 0.3)',
                  color: textColor,
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
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                }}
                className="submit-button"
              >
                {submitSuccess ? '发送成功！' : '发送棉花糖'}
              </Button>
            </Form.Item>
          </Form>
          
          <div style={{ 
            textAlign: 'center',
            padding: '8px 16px',
            background: 'rgba(53, 42, 70, 0.4)',
            borderRadius: '8px',
            border: `1px solid rgba(168, 143, 106, 0.2)`
          }}>
            <Text style={{ fontSize: '13px', color: 'rgba(230, 214, 188, 0.7)' }}>
              发送的棉花糖将由管理员查看，请遵守社区规范，不要发送违规内容哦~
            </Text>
          </div>
        </Space>
      </Card>

      {/* 添加CSS动画 */}
      <style jsx="true">{`
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
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
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        input::placeholder, textarea::placeholder {
          color: rgba(230, 214, 188, 0.5) !important;
        }

        input, textarea {
          color: ${textColor} !important;
        }
      `}</style>
    </div>
  );
};

export default CottonCandy; 