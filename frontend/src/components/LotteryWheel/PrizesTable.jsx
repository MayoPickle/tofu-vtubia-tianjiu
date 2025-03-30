// PrizesTable.jsx
import React from 'react';
import { Table, Input, InputNumber, Button, Space, Popconfirm, Upload, message, Card, List, Form, Empty } from 'antd';
import { UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useDeviceDetect } from '../../utils/deviceDetector';

// 主题颜色和渐变定义
const themeColor = '#a88f6a';
const secondaryColor = '#352a46';  // 深紫色
const highlightColor = '#e3bb4d';  // 亮黄色
const themeGradient = 'linear-gradient(135deg, #a88f6a 0%, #917752 100%)';
const secondaryGradient = 'linear-gradient(135deg, #352a46 0%, #261e36 100%)';
const bgColor = '#1c2134';
const textColor = '#e6d6bc';

// 这里也可以把图片上传逻辑放到容器里；
// 如果要在这里写，就直接在组件里 fetch('/api/upload') 即可。
// 为了简洁，演示时就直接写在 columns 里。
function PrizesTable({ prizes, setPrizes }) {
  const { isMobile } = useDeviceDetect();

  // 自定义表格样式
  const tableStyles = `
    .custom-table .ant-table {
      background-color: transparent !important;
      color: ${textColor};
    }
    
    .custom-table .ant-table-thead > tr > th {
      background-color: rgba(53, 42, 70, 0.7) !important;
      color: ${textColor} !important;
      border-color: rgba(168, 143, 106, 0.3) !important;
    }
    
    .custom-table .table-row-light {
      background-color: rgba(28, 33, 52, 0.8) !important;
    }
    
    .custom-table .table-row-dark {
      background-color: rgba(53, 42, 70, 0.6) !important;
    }
    
    .custom-table .ant-table-tbody > tr > td {
      border-color: rgba(168, 143, 106, 0.2) !important;
      color: ${textColor};
    }
    
    .custom-table .ant-table-tbody > tr:hover > td {
      background-color: rgba(227, 187, 77, 0.1) !important;
    }
  `;

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
          const newPrizes = [...prizes];
          newPrizes[idx].image = data.url;
          setPrizes(newPrizes);
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

  // 更新奖品名称
  const handleNameChange = (value, idx) => {
    const newPrizes = [...prizes];
    newPrizes[idx].name = value;
    setPrizes(newPrizes);
  };

  // 更新概率
  const handleProbabilityChange = (value, idx) => {
    const newPrizes = [...prizes];
    newPrizes[idx].probability = value || 0;
    setPrizes(newPrizes);
  };

  // 更新图片链接
  const handleImageUrlChange = (value, idx) => {
    const newPrizes = [...prizes];
    newPrizes[idx].image = value;
    setPrizes(newPrizes);
  };

  // 删除奖品
  const handleDeletePrize = (idx) => {
    const newList = [...prizes];
    newList.splice(idx, 1);
    setPrizes(newList);
  };

  // 移动端列表视图
  const renderMobileView = () => {
    if (!prizes || prizes.length === 0) {
      return <Empty description="暂无奖品" />;
    }

    return (
      <List
        dataSource={prizes}
        renderItem={(item, idx) => (
          <List.Item style={{ padding: 0, marginBottom: 12 }}>
            <Card 
              size="small" 
              style={{ 
                width: '100%',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                background: idx % 2 === 0 ? bgColor : secondaryColor,
                border: '1px solid rgba(168, 143, 106, 0.3)'
              }}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontWeight: 500, 
                    color: highlightColor
                  }}>
                    奖品 {idx + 1}
                  </span>
                  <Popconfirm
                    title="确认删除该奖品？"
                    onConfirm={() => handleDeletePrize(idx)}
                  >
                    <Button 
                      danger 
                      type="text" 
                      size="small"
                      icon={<DeleteOutlined />}
                      style={{ color: themeColor }}
                    />
                  </Popconfirm>
                </div>
              }
              headStyle={{
                background: 'transparent',
                borderBottom: `1px solid rgba(168, 143, 106, 0.2)`
              }}
            >
              <Form layout="vertical">
                <Form.Item 
                  label={<span style={{ color: textColor }}>奖品名称</span>} 
                  style={{ marginBottom: 12 }}
                >
                  <Input
                    value={item.name}
                    onChange={(e) => handleNameChange(e.target.value, idx)}
                    placeholder="请输入奖品名称"
                    style={{ 
                      background: 'rgba(53, 42, 70, 0.4)',
                      color: textColor,
                      borderColor: 'rgba(168, 143, 106, 0.3)'
                    }}
                  />
                </Form.Item>
                
                <Form.Item 
                  label={<span style={{ color: textColor }}>概率(0~1)</span>} 
                  style={{ marginBottom: 12 }}
                >
                  <InputNumber
                    min={0}
                    max={1}
                    step={0.01}
                    value={item.probability}
                    onChange={(value) => handleProbabilityChange(value, idx)}
                    style={{ 
                      width: '100%',
                      background: 'rgba(53, 42, 70, 0.4)',
                      color: textColor,
                      borderColor: 'rgba(168, 143, 106, 0.3)'
                    }}
                    placeholder="奖品抽中概率"
                  />
                </Form.Item>
                
                <Form.Item 
                  label={<span style={{ color: textColor }}>图片</span>} 
                  style={{ marginBottom: 8 }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Input
                      value={item.image}
                      placeholder="粘贴图片链接"
                      onChange={(e) => handleImageUrlChange(e.target.value, idx)}
                      style={{ 
                        background: 'rgba(53, 42, 70, 0.4)',
                        color: textColor,
                        borderColor: 'rgba(168, 143, 106, 0.3)'
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
                          style={{ background: themeGradient, borderColor: themeColor }}
                        >
                          上传图片
                        </Button>
                      </Upload>
                      
                      {item.image && (
                        <img
                          src={item.image}
                          alt="奖品图片"
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #eee',
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
        title: <span style={{ color: textColor }}>奖品名称</span>,
        dataIndex: 'name',
        render: (text, record, idx) => (
          <Input
            value={text}
            onChange={(e) => handleNameChange(e.target.value, idx)}
            placeholder="请输入奖品名称"
            style={{ 
              width: '90%',
              background: 'rgba(53, 42, 70, 0.4)',
              color: textColor,
              borderColor: 'rgba(168, 143, 106, 0.3)'
            }}
          />
        ),
      },
      {
        title: <span style={{ color: textColor }}>概率(0~1)</span>,
        dataIndex: 'probability',
        width: 120,
        render: (val, record, idx) => (
          <InputNumber
            min={0}
            max={1}
            step={0.01}
            value={val}
            onChange={(value) => handleProbabilityChange(value, idx)}
            style={{ 
              width: '100%',
              background: 'rgba(53, 42, 70, 0.4)',
              color: textColor,
              borderColor: 'rgba(168, 143, 106, 0.3)'
            }}
          />
        ),
      },
      {
        title: <span style={{ color: textColor }}>图片</span>,
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
                style={{ background: themeGradient, borderColor: themeColor }}
              >
                上传
              </Button>
            </Upload>

            <Input
              style={{ 
                width: 200,
                background: 'rgba(53, 42, 70, 0.4)',
                color: textColor,
                borderColor: 'rgba(168, 143, 106, 0.3)'
              }}
              value={val}
              placeholder="或在此粘贴图片链接"
              onChange={(e) => handleImageUrlChange(e.target.value, idx)}
            />

            {val ? (
              <img
                src={val}
                alt="奖品图片"
                style={{
                  width: 48,
                  height: 48,
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid rgba(168, 143, 106, 0.3)',
                }}
              />
            ) : (
              <div style={{ color: textColor }}>暂无</div>
            )}
          </Space>
        ),
      },
      {
        title: <span style={{ color: textColor }}>操作</span>,
        width: 80,
        render: (val, record, idx) => (
          <Space>
            <Popconfirm
              title="确认删除该奖品？"
              onConfirm={() => handleDeletePrize(idx)}
            >
              <Button 
                danger 
                size="small"
                icon={<DeleteOutlined />}
                style={{ 
                  backgroundColor: 'rgba(53, 42, 70, 0.6)', 
                  borderColor: themeColor, 
                  color: highlightColor 
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
      <Table
        dataSource={Array.isArray(prizes) ? prizes : []}
        columns={updatedColumns}
        pagination={false}
        rowKey={(item, idx) => idx}
        style={{ marginBottom: 20 }}
        bordered
        size="middle"
        className="custom-table"
        rowClassName={(record, index) => 
          index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
        }
      />
    );
  };

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}
      <style jsx="true">{tableStyles}</style>
    </>
  );
}

export default PrizesTable;
