import React from 'react';
import { Table, Input, InputNumber, Button, Space, Popconfirm, Upload, message, Card, List, Form, Empty } from 'antd';
import { UploadOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useDeviceDetect } from '../../utils/deviceDetector';

// 深夜小酒馆主题颜色常量
const themeColor = '#a88f6a';
const secondaryColor = '#352a46';
const highlightColor = '#e3bb4d';
const bgColor = '#1c2134';
const textColor = '#e6d6bc';

function MembersTable({ members, setMembers }) {
  const { isMobile } = useDeviceDetect();

  // 图片上传
  const handleImageUpload = (file, idx) => {
    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          const newMembers = [...members];
          newMembers[idx].image = data.url;
          setMembers(newMembers);
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

  // 更新人员名称
  const handleNameChange = (value, idx) => {
    const newMembers = [...members];
    newMembers[idx].name = value;
    setMembers(newMembers);
  };

  // 更新权重（概率）
  const handleProbabilityChange = (value, idx) => {
    const newMembers = [...members];
    newMembers[idx].probability = value || 1;
    setMembers(newMembers);
  };

  // 更新图片链接
  const handleImageUrlChange = (value, idx) => {
    const newMembers = [...members];
    newMembers[idx].image = value;
    setMembers(newMembers);
  };

  // 删除人员
  const handleDeleteMember = (idx) => {
    const newList = [...members];
    newList.splice(idx, 1);
    setMembers(newList);
  };

  // 移动端列表视图
  const renderMobileView = () => {
    if (!members || members.length === 0) {
      return (
        <Empty 
          description={
            <span style={{ color: textColor }}>暂无人员</span>
          }
          style={{ 
            background: `rgba(${parseInt(bgColor.slice(1, 3), 16)}, ${parseInt(bgColor.slice(3, 5), 16)}, ${parseInt(bgColor.slice(5, 7), 16)}, 0.8)`,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid rgba(168, 143, 106, 0.2)`
          }}
        />
      );
    }

    return (
      <List
        dataSource={members}
        renderItem={(item, idx) => (
          <List.Item style={{ padding: 0, marginBottom: 12 }}>
            <Card 
              size="small" 
              style={{ 
                width: '100%',
                background: 'rgba(28, 33, 52, 0.8)',
                border: '1px solid rgba(168, 143, 106, 0.2)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                borderRadius: '12px'
              }}
              headStyle={{
                background: 'rgba(53, 42, 70, 0.6)',
                borderBottom: '1px solid rgba(168, 143, 106, 0.2)',
                borderRadius: '12px 12px 0 0'
              }}
              bodyStyle={{
                background: 'transparent'
              }}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontWeight: 500, 
                    color: highlightColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <UserOutlined />
                    人员 {idx + 1}
                  </span>
                  <Popconfirm
                    title="确认删除该人员？"
                    onConfirm={() => handleDeleteMember(idx)}
                    okButtonProps={{ 
                      style: { 
                        backgroundColor: themeColor, 
                        borderColor: themeColor 
                      } 
                    }}
                  >
                    <Button 
                      danger 
                      type="text" 
                      size="small"
                      icon={<DeleteOutlined />}
                      style={{ color: highlightColor }}
                    />
                  </Popconfirm>
                </div>
              }
            >
              <Form layout="vertical">
                <Form.Item 
                  label={<span style={{ color: textColor }}>人员名称</span>} 
                  style={{ marginBottom: 12 }}
                >
                  <Input
                    value={item.name}
                    onChange={(e) => handleNameChange(e.target.value, idx)}
                    placeholder="请输入人员名称"
                    style={{
                      background: 'rgba(28, 33, 52, 0.6)',
                      borderColor: 'rgba(168, 143, 106, 0.3)',
                      color: textColor
                    }}
                  />
                </Form.Item>
                
                <Form.Item 
                  label={<span style={{ color: textColor }}>权重(数值越大被选中概率越高)</span>} 
                  style={{ marginBottom: 12 }}
                >
                  <InputNumber
                    min={0.1}
                    step={0.1}
                    value={item.probability}
                    onChange={(value) => handleProbabilityChange(value, idx)}
                    style={{ 
                      width: '100%',
                      background: 'rgba(28, 33, 52, 0.6)',
                      borderColor: 'rgba(168, 143, 106, 0.3)',
                      color: textColor
                    }}
                    placeholder="设置权重"
                  />
                </Form.Item>
                
                <Form.Item 
                  label={<span style={{ color: textColor }}>头像</span>} 
                  style={{ marginBottom: 8 }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Input
                      value={item.image}
                      placeholder="粘贴头像链接"
                      onChange={(e) => handleImageUrlChange(e.target.value, idx)}
                      style={{
                        background: 'rgba(28, 33, 52, 0.6)',
                        borderColor: 'rgba(168, 143, 106, 0.3)',
                        color: textColor
                      }}
                    />
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Upload
                        beforeUpload={(file) => handleImageUpload(file, idx)}
                        showUploadList={false}
                      >
                        <Button 
                          icon={<UploadOutlined />} 
                          size="small"
                          type="primary"
                          style={{ backgroundColor: themeColor, borderColor: themeColor }}
                        >
                          上传头像
                        </Button>
                      </Upload>
                      
                      {item.image && (
                        <img
                          src={item.image}
                          alt="人员头像"
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: 'cover',
                            borderRadius: '50%',
                            border: `2px solid ${themeColor}`,
                            background: bgColor
                          }}
                        />
                      )}
                    </div>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </List.Item>
        )}
      />
    );
  };

  // 桌面端表格视图
  const renderDesktopView = () => {
    const updatedColumns = [
      {
        title: (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: highlightColor,
            fontSize: '15px',
            fontWeight: 'bold'
          }}>
            <UserOutlined />
            <span>人员名称</span>
          </div>
        ),
        dataIndex: 'name',
        render: (text, record, idx) => (
          <Input
            value={text}
            onChange={(e) => handleNameChange(e.target.value, idx)}
            placeholder="请输入人员名称"
            style={{ 
              width: '90%',
              background: 'rgba(28, 33, 52, 0.6)',
              borderColor: 'rgba(168, 143, 106, 0.3)',
              color: textColor
            }}
            prefix={<UserOutlined style={{ color: highlightColor }} />}
          />
        ),
      },
      {
        title: (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: highlightColor,
            fontSize: '15px',
            fontWeight: 'bold'
          }}>
            <span>权重</span>
          </div>
        ),
        dataIndex: 'probability',
        width: 120,
        render: (val, record, idx) => (
          <InputNumber
            min={0.1}
            step={0.1}
            value={val}
            onChange={(value) => handleProbabilityChange(value, idx)}
            style={{ 
              width: '100%',
              background: 'rgba(28, 33, 52, 0.6)',
              borderColor: 'rgba(168, 143, 106, 0.3)',
              color: textColor
            }}
            placeholder="权重"
          />
        ),
      },
      {
        title: (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: highlightColor,
            fontSize: '15px',
            fontWeight: 'bold'
          }}>
            <span>头像</span>
          </div>
        ),
        dataIndex: 'image',
        responsive: ['md'],
        render: (val, record, idx) => (
          <Space>
            <Upload
              beforeUpload={(file) => handleImageUpload(file, idx)}
              showUploadList={false}
            >
              <Button 
                icon={<UploadOutlined />} 
                type="primary"
                size="small"
                style={{ backgroundColor: themeColor, borderColor: themeColor }}
              >
                上传
              </Button>
            </Upload>

            <Input
              style={{ 
                width: 200,
                background: 'rgba(28, 33, 52, 0.6)',
                borderColor: 'rgba(168, 143, 106, 0.3)',
                color: textColor
              }}
              value={val}
              placeholder="或在此粘贴头像链接"
              onChange={(e) => handleImageUrlChange(e.target.value, idx)}
            />

            {val ? (
              <img
                src={val}
                alt="人员头像"
                style={{
                  width: 48,
                  height: 48,
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: `2px solid ${themeColor}`,
                  background: bgColor
                }}
              />
            ) : (
              <div style={{ 
                color: 'rgba(230, 214, 188, 0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <UserOutlined />
                暂无头像
              </div>
            )}
          </Space>
        ),
      },
      {
        title: (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: highlightColor,
            fontSize: '15px',
            fontWeight: 'bold'
          }}>
            <span>操作</span>
          </div>
        ),
        width: 80,
        render: (val, record, idx) => (
          <Space>
            <Popconfirm
              title="确认删除该人员？"
              onConfirm={() => handleDeleteMember(idx)}
            >
              <Button 
                danger 
                size="small"
                icon={<DeleteOutlined />}
                style={{ 
                  backgroundColor: 'rgba(28, 33, 52, 0.6)', 
                  borderColor: 'rgba(240, 85, 85, 0.3)', 
                  color: '#ff6b6b'
                }}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <>
        <Table
          dataSource={Array.isArray(members) ? members : []}
          columns={updatedColumns}
          pagination={false}
          rowKey={(item, idx) => idx}
          style={{ 
            marginBottom: 20,
            background: 'transparent'
          }}
          rowClassName={(record, index) => 
            index % 2 === 0 ? 'members-even-row' : 'members-odd-row'
          }
          className="members-table"
          bordered
          size="middle"
        />
        
        <style jsx="true">{`
          .members-table .ant-table {
            background: transparent !important;
            border-radius: 16px;
            overflow: hidden;
          }
          
          .members-table .ant-table-container {
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(168, 143, 106, 0.2);
            overflow: hidden;
          }
          
          .members-table .ant-table-thead > tr > th {
            background: rgba(28, 33, 52, 0.95) !important;
            border-bottom: 1px solid rgba(168, 143, 106, 0.3) !important;
            border-right: 1px solid rgba(168, 143, 106, 0.1) !important;
            color: ${textColor} !important;
            padding: 16px;
            font-weight: bold;
            font-size: 14px;
          }
          
          .members-table .ant-table-tbody > tr > td {
            border-bottom: 1px solid rgba(168, 143, 106, 0.1) !important;
            border-right: 1px solid rgba(168, 143, 106, 0.1) !important;
            padding: 12px 16px;
            transition: all 0.3s ease;
          }
          
          .members-table .members-even-row {
            background: rgba(28, 33, 52, 0.8) !important;
          }
          
          .members-table .members-odd-row {
            background: rgba(53, 42, 70, 0.5) !important;
          }
          
          .members-table .ant-table-tbody > tr:hover > td {
            background: rgba(168, 143, 106, 0.1) !important;
          }
          
          .members-table .ant-input {
            color: ${textColor} !important;
          }
          
          .members-table .ant-input::placeholder {
            color: rgba(230, 214, 188, 0.5) !important;
          }
          
          .members-table .ant-input-number {
            color: ${textColor} !important;
          }
          
          .members-table .ant-input-number-input {
            color: ${textColor} !important;
          }
        `}</style>
      </>
    );
  };

  return isMobile ? renderMobileView() : renderDesktopView();
}

export default MembersTable; 