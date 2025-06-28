import React from 'react';
import { Card, Input, InputNumber, Upload, Button, Space, Form, message } from 'antd';
import { GiftOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { useDeviceDetect } from '../../utils/deviceDetector';

const { TextArea } = Input;

// 深夜小酒馆主题颜色常量
const themeColor = '#a88f6a';
const secondaryColor = '#352a46';
const highlightColor = '#e3bb4d';
const bgColor = '#1c2134';
const textColor = '#e6d6bc';

function GiftSetting({ gift, setGift, onSave }) {
  const { isMobile } = useDeviceDetect();

  // 图片上传
  const handleImageUpload = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setGift({ ...gift, image: data.url });
          message.success('图片上传成功');
        } else {
          message.error(data.message || '图片上传失败');
        }
      })
      .catch((err) => {
        console.error('图片上传错误', err);
        message.error('网络异常，上传失败');
      });

    // 阻止 antd 默认上传行为
    return false;
  };

  const handleNameChange = (value) => {
    setGift({ ...gift, name: value });
  };

  const handleDescriptionChange = (value) => {
    setGift({ ...gift, description: value });
  };

  const handleQuantityChange = (value) => {
    setGift({ ...gift, quantity: value || 1 });
  };

  const handleImageUrlChange = (value) => {
    setGift({ ...gift, image: value });
  };

  return (
    <Card 
      title={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: highlightColor,
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            <GiftOutlined />
            礼品设置
          </div>
          {onSave && (
            <Button
              onClick={onSave}
              icon={<SaveOutlined />}
              style={{ 
                background: `linear-gradient(135deg, ${themeColor} 0%, #917752 100%)`,
                border: `1px solid ${themeColor}`,
                color: '#fff',
                borderRadius: '12px',
                height: '36px',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '500',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(168, 143, 106, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
              }}
              title="保存到本地浏览器"
            >
              本地保存
            </Button>
          )}
        </div>
      }
      style={{ 
        backgroundColor: 'rgba(28, 33, 52, 0.95)',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(168, 143, 106, 0.15)',
        border: '1px solid rgba(196, 163, 115, 0.3)',
        backdropFilter: 'blur(10px)'
      }}
      bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
    >
      <Form layout="vertical">
        <Form.Item 
          label={<span style={{ color: textColor }}>礼品名称</span>} 
          style={{ marginBottom: 16 }}
        >
          <Input
            value={gift.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="请输入礼品名称，如：牛奶"
            prefix={<GiftOutlined style={{ color: highlightColor }} />}
            style={{ 
              borderRadius: '8px',
              background: 'rgba(28, 33, 52, 0.6)',
              borderColor: 'rgba(168, 143, 106, 0.3)',
              color: textColor
            }}
          />
        </Form.Item>

        <Form.Item 
          label={<span style={{ color: textColor }}>礼品描述</span>} 
          style={{ marginBottom: 16 }}
        >
          <TextArea
            value={gift.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="请输入礼品描述，如：美味的牛奶一瓶"
            rows={3}
            style={{ 
              borderRadius: '8px',
              background: 'rgba(28, 33, 52, 0.6)',
              borderColor: 'rgba(168, 143, 106, 0.3)',
              color: textColor
            }}
          />
        </Form.Item>

        <Form.Item 
          label={<span style={{ color: textColor }}>数量</span>} 
          style={{ marginBottom: 16 }}
        >
          <InputNumber
            min={1}
            value={gift.quantity}
            onChange={handleQuantityChange}
            style={{ 
              width: '100%', 
              borderRadius: '8px',
              background: 'rgba(28, 33, 52, 0.6)',
              borderColor: 'rgba(168, 143, 106, 0.3)',
              color: textColor
            }}
            placeholder="礼品数量"
          />
        </Form.Item>

        <Form.Item label={<span style={{ color: textColor }}>礼品图片</span>}>
          <Space direction={isMobile ? 'vertical' : 'horizontal'} style={{ width: '100%' }}>
            <Upload
              beforeUpload={handleImageUpload}
              showUploadList={false}
            >
              <Button 
                icon={<UploadOutlined />} 
                type="primary"
                style={{ 
                  backgroundColor: themeColor, 
                  borderColor: themeColor,
                  borderRadius: '8px'
                }}
              >
                上传图片
              </Button>
            </Upload>

            <Input
              style={{ 
                width: isMobile ? '100%' : '300px',
                borderRadius: '8px',
                background: 'rgba(28, 33, 52, 0.6)',
                borderColor: 'rgba(168, 143, 106, 0.3)',
                color: textColor
              }}
              value={gift.image}
              placeholder="或在此粘贴图片链接"
              onChange={(e) => handleImageUrlChange(e.target.value)}
            />
          </Space>

          {gift.image && (
            <div style={{ 
              marginTop: 16, 
              textAlign: 'center',
              padding: '16px',
              backgroundColor: 'rgba(198, 163, 115, 0.1)',
              borderRadius: '12px',
              border: '1px dashed ' + themeColor
            }}>
              <img
                src={gift.image}
                alt="礼品图片"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  border: '2px solid ' + themeColor,
                }}
              />
              <div style={{ 
                marginTop: '8px', 
                color: themeColor,
                fontWeight: 500
              }}>
                {gift.name} × {gift.quantity}
              </div>
              {gift.description && (
                <div style={{ 
                  marginTop: '4px', 
                  color: 'rgba(230, 214, 188, 0.7)',
                  fontSize: '14px'
                }}>
                  {gift.description}
                </div>
              )}
            </div>
          )}
        </Form.Item>
      </Form>
      
      <style jsx="true">{`
        .ant-input {
          color: ${textColor} !important;
        }
        
        .ant-input::placeholder {
          color: rgba(230, 214, 188, 0.5) !important;
        }
        
        .ant-input-number {
          color: ${textColor} !important;
        }
        
        .ant-input-number-input {
          color: ${textColor} !important;
        }
        
        .ant-input-number-input::placeholder {
          color: rgba(230, 214, 188, 0.5) !important;
        }
        
        .ant-input-affix-wrapper .ant-input {
          color: ${textColor} !important;
        }
        
        .ant-input-affix-wrapper .ant-input::placeholder {
          color: rgba(230, 214, 188, 0.5) !important;
        }
      `}</style>
    </Card>
  );
}

export default GiftSetting; 