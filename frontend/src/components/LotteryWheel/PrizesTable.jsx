// PrizesTable.jsx
import React from 'react';
import { Table, Input, InputNumber, Button, Space, Popconfirm, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

// 这里也可以把图片上传逻辑放到容器里；
// 如果要在这里写，就直接在组件里 fetch('/api/upload') 即可。
// 为了简洁，演示时就直接写在 columns 里。
function PrizesTable({ prizes, setPrizes }) {
  // 图片上传
  const handleImageUpload = (file, idx) => {
    const formData = new FormData();
    formData.append('image', file);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const newPrizes = [...prizes];
          newPrizes[idx].image = data.url;
          setPrizes(newPrizes);
          message.success('图片上传成功');
        } else {
          message.error('图片上传失败');
        }
      })
      .catch((err) => {
        console.error('图片上传错误', err);
        message.error('网络异常，上传失败');
      });

    // 阻止 antd 默认上传行为
    return false;
  };

  const columns = [
    {
      title: '奖品名称',
      dataIndex: 'name',
      render: (text, record, idx) => (
        <Input
          value={text}
          onChange={(e) => {
            const newPrizes = [...prizes];
            newPrizes[idx].name = e.target.value;
            setPrizes(newPrizes);
          }}
        />
      ),
    },
    {
      title: '概率(0~1)',
      dataIndex: 'probability',
      render: (val, record, idx) => (
        <InputNumber
          min={0}
          max={1}
          step={0.01}
          value={val}
          onChange={(value) => {
            const newPrizes = [...prizes];
            newPrizes[idx].probability = value || 0;
            setPrizes(newPrizes);
          }}
        />
      ),
    },
    {
      title: '图片',
      dataIndex: 'image',
      render: (val, record, idx) => (
        <Space>
          <Upload
            beforeUpload={(file) => handleImageUpload(file, idx)}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>上传</Button>
          </Upload>

          <Input
            style={{ width: 200 }}
            value={val}
            placeholder="或在此粘贴图片链接"
            onChange={(e) => {
              const newPrizes = [...prizes];
              newPrizes[idx].image = e.target.value;
              setPrizes(newPrizes);
            }}
          />

          {val ? (
            <img
              src={val}
              alt="奖品图片"
              style={{
                width: 50,
                height: 50,
                objectFit: 'cover',
                border: '1px solid #ccc',
              }}
            />
          ) : (
            <div style={{ color: '#999' }}>暂无</div>
          )}
        </Space>
      ),
    },
    {
      title: '操作',
      render: (val, record, idx) => (
        <Space>
          <Popconfirm
            title="确认删除该奖品？"
            onConfirm={() => {
              const newList = [...prizes];
              newList.splice(idx, 1);
              setPrizes(newList);
            }}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={prizes}
      columns={columns}
      pagination={false}
      rowKey={(item, idx) => idx}
      style={{ marginBottom: 20 }}
    />
  );
}

export default PrizesTable;
