import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message, Card, Typography, Space } from 'antd';
import { SendOutlined, HeartOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

const CottonCandy = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await axios.post('/api/cotton_candy', values);
      message.success('棉花糖发送成功！');
      form.resetFields();
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
      padding: '20px'
    }}>
      <Card
        bordered={false}
        style={{ 
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(255, 133, 162, 0.2)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ color: '#FF85A2' }}>
              <HeartOutlined /> 发送棉花糖
            </Title>
            <Paragraph>
              在这里给主播发送一个可爱的棉花糖吧！你的小心意会被送达~
            </Paragraph>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ sender: '幽灵DD' }}
          >
            <Form.Item
              name="sender"
              label="发送人昵称"
              rules={[{ required: true, message: '请输入发送人昵称' }]}
            >
              <Input placeholder="请输入你的昵称，默认为幽灵DD" allowClear />
            </Form.Item>

            <Form.Item
              name="title"
              label="标题（选填）"
            >
              <Input placeholder="请输入标题（选填）" allowClear />
            </Form.Item>

            <Form.Item
              name="content"
              label="内容"
              rules={[{ required: true, message: '请输入棉花糖内容' }]}
            >
              <TextArea
                placeholder="请输入你想对主播说的话"
                autoSize={{ minRows: 4, maxRows: 8 }}
                allowClear
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SendOutlined />}
                style={{ 
                  width: '100%', 
                  height: '40px',
                  borderRadius: '8px',
                  background: '#FF85A2',
                  borderColor: '#FF85A2'
                }}
              >
                发送棉花糖
              </Button>
            </Form.Item>
          </Form>
          
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              发送的棉花糖将由管理员查看，请遵守社区规范，不要发送违规内容哦~
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default CottonCandy; 