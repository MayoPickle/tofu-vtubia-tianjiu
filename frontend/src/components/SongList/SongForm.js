// SongForm.js - 歌曲表单组件
import React from 'react';
import { Modal, Form, Input, Divider, Typography } from 'antd';
import { 
  SoundOutlined, 
  UserOutlined, 
  BookOutlined, 
  TagOutlined, 
  NumberOutlined, 
  LinkOutlined, 
  FileTextOutlined,
  InfoCircleOutlined,
  CoffeeOutlined
} from '@ant-design/icons';
import { bgColor, themeColor, highlightColor, textColor, secondaryColor } from './constants';

const { Text } = Typography;

const SongForm = ({ form, onFinish, modalVisible, setModalVisible, title }) => {
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CoffeeOutlined style={{ color: highlightColor, fontSize: '18px' }} />
          <span style={{ color: textColor }}>{title}</span>
        </div>
      }
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      onOk={onFinish}
      okText="确认"
      cancelText="取消"
      styles={{
        header: {
          background: bgColor,
          borderBottom: '1px solid rgba(168, 143, 106, 0.3)',
          padding: '16px 24px',
        },
        body: {
          background: bgColor,
          padding: '24px',
          color: textColor,
        },
        footer: {
          background: bgColor,
          borderTop: '1px solid rgba(168, 143, 106, 0.3)',
          padding: '12px 24px',
        },
        mask: {
          backdropFilter: 'blur(5px)',
          background: 'rgba(0, 0, 0, 0.5)'
        },
        content: {
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(168, 143, 106, 0.2)',
          overflow: 'hidden',
          background: 'rgba(28, 33, 52, 0.98)',
        },
      }}
      maskClosable={false}
    >
      <div style={{ 
        borderRadius: '4px',
        marginBottom: '16px',
        padding: '12px 16px',
        background: 'rgba(168, 143, 106, 0.1)',
        border: '1px dashed rgba(168, 143, 106, 0.3)',
      }}>
        <Text style={{ color: textColor, fontSize: '14px' }}>
          在这里添加新的音乐作品，为酒馆的夜晚增添一抹色彩✨
        </Text>
      </div>

      <Form 
        form={form} 
        layout="vertical"
        requiredMark={false}
        style={{
          color: textColor,
        }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="title"
            label={<Text style={{ color: textColor }}>歌曲名称</Text>}
            rules={[{ required: true, message: '请输入歌曲名称' }]}
            style={{ flex: 1 }}
          >
            <Input 
              prefix={<SoundOutlined style={{ color: themeColor }} />} 
              placeholder="请输入歌曲名称" 
              style={{
                background: 'rgba(53, 42, 70, 0.3)',
                borderColor: 'rgba(168, 143, 106, 0.3)',
                color: textColor,
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="artist"
            label={<Text style={{ color: textColor }}>歌手</Text>}
            rules={[{ required: true, message: '请输入歌手名' }]}
            style={{ flex: 1 }}
          >
            <Input 
              prefix={<UserOutlined style={{ color: themeColor }} />} 
              placeholder="请输入歌手名" 
              style={{
                background: 'rgba(53, 42, 70, 0.3)',
                borderColor: 'rgba(168, 143, 106, 0.3)',
                color: textColor,
              }}
            />
          </Form.Item>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item 
            name="album" 
            label={<Text style={{ color: textColor }}>专辑</Text>}
            style={{ flex: 2 }}
          >
            <Input 
              prefix={<BookOutlined style={{ color: themeColor }} />} 
              placeholder="请输入专辑名" 
              style={{
                background: 'rgba(53, 42, 70, 0.3)',
                borderColor: 'rgba(168, 143, 106, 0.3)',
                color: textColor,
              }}
            />
          </Form.Item>

          <Form.Item 
            name="year" 
            label={<Text style={{ color: textColor }}>年份</Text>}
            style={{ flex: 1 }}
          >
            <Input 
              type="number" 
              prefix={<NumberOutlined style={{ color: themeColor }} />} 
              placeholder="发行年份" 
              style={{
                background: 'rgba(53, 42, 70, 0.3)',
                borderColor: 'rgba(168, 143, 106, 0.3)',
                color: textColor,
              }}
            />
          </Form.Item>
        </div>

        <Form.Item 
          name="genre" 
          label={<Text style={{ color: textColor }}>风格</Text>}
        >
          <Input 
            prefix={<TagOutlined style={{ color: themeColor }} />} 
            placeholder="请输入音乐风格" 
            style={{
              background: 'rgba(53, 42, 70, 0.3)',
              borderColor: 'rgba(168, 143, 106, 0.3)',
              color: textColor,
            }}
          />
        </Form.Item>

        <Divider style={{ 
          borderColor: 'rgba(168, 143, 106, 0.2)', 
          margin: '16px 0'
        }} dashed />

        <Form.Item 
          name="tags" 
          label={<Text style={{ color: textColor }}>标签</Text>}
          tooltip={{ 
            title: '多个标签用逗号分隔',
            color: secondaryColor
          }}
        >
          <Input 
            prefix={<TagOutlined style={{ color: highlightColor }} />} 
            placeholder="多个标签用逗号分隔，如：流行,摇滚,经典" 
            style={{
              background: 'rgba(53, 42, 70, 0.3)',
              borderColor: 'rgba(168, 143, 106, 0.3)',
              color: textColor,
            }}
          />
        </Form.Item>

        <Form.Item 
          name="link" 
          label={<Text style={{ color: textColor }}>链接</Text>}
        >
          <Input 
            prefix={<LinkOutlined style={{ color: themeColor }} />} 
            placeholder="输入歌曲链接" 
            style={{
              background: 'rgba(53, 42, 70, 0.3)',
              borderColor: 'rgba(168, 143, 106, 0.3)',
              color: textColor,
            }}
          />
        </Form.Item>

        <Form.Item 
          name="meta_data" 
          label={<Text style={{ color: textColor }}>元数据</Text>}
        >
          <Input.TextArea 
            placeholder="例如：JSON格式的歌曲额外信息" 
            rows={2} 
            style={{
              background: 'rgba(53, 42, 70, 0.3)',
              borderColor: 'rgba(168, 143, 106, 0.3)',
              color: textColor,
              resize: 'none'
            }}
          />
        </Form.Item>

        <Form.Item 
          name="description" 
          label={
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Text style={{ color: textColor }}>描述</Text>
              <InfoCircleOutlined style={{ color: highlightColor, fontSize: '12px' }} />
            </div>
          }
        >
          <Input.TextArea 
            placeholder="输入歌曲描述，这将显示在歌曲列表中" 
            rows={3} 
            style={{
              background: 'rgba(53, 42, 70, 0.3)',
              borderColor: 'rgba(168, 143, 106, 0.3)',
              color: textColor,
              resize: 'none'
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SongForm; 