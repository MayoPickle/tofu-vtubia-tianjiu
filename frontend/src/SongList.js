import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  message,
  Space,
} from 'antd';

/**
 * SongList 组件 - 展示、搜索、增改删歌曲
 */
function SongList() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  // 搜索关键词
  const [searchTerm, setSearchTerm] = useState('');

  // 控制“添加歌曲”对话框
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  // 控制“编辑歌曲”对话框
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [currentEditId, setCurrentEditId] = useState(null);

  // 获取歌曲列表
  const fetchSongs = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(
        search ? `/api/songs?search=${search}` : '/api/songs'
      );
      setSongs(res.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
      message.error('获取歌曲列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取全部歌曲
  useEffect(() => {
    fetchSongs();
  }, []);

  // 搜索功能
  const onSearch = (value) => {
    setSearchTerm(value);
    fetchSongs(value);
  };

  // ==========  新增歌曲  ==========
  const handleOpenAddModal = () => {
    addForm.resetFields(); // 重置表单
    setAddModalVisible(true);
  };

  // 提交创建
  const handleAddSong = async () => {
    try {
      const values = await addForm.validateFields();
      // year 转为数字
      if (values.year) {
        values.year = parseInt(values.year, 10);
      }
      await axios.post('/api/songs', values);
      message.success('添加歌曲成功');
      setAddModalVisible(false);
      fetchSongs(searchTerm); // 刷新列表
    } catch (err) {
      console.error('Error adding song:', err);
      if (err.response) {
        message.error(err.response.data.message || '添加歌曲失败');
      } else if (err.errorFields) {
        // Form 校验错误，不弹 message
      } else {
        message.error('添加歌曲失败');
      }
    }
  };

  // ==========  编辑歌曲  ==========
  const handleOpenEditModal = (record) => {
    setCurrentEditId(record.id);
    // 把当前选中的歌曲数据填到表单
    editForm.setFieldsValue({
      title: record.title,
      artist: record.artist,
      album: record.album,
      genre: record.genre,
      year: record.year,
      meta_data: record.meta_data,
    });
    setEditModalVisible(true);
  };

  // 提交编辑
  const handleEditSong = async () => {
    try {
      const values = await editForm.validateFields();
      if (values.year) {
        values.year = parseInt(values.year, 10);
      }
      await axios.put(`/api/songs/${currentEditId}`, values);
      message.success('编辑歌曲成功');
      setEditModalVisible(false);
      setCurrentEditId(null);
      fetchSongs(searchTerm);
    } catch (err) {
      console.error('Error editing song:', err);
      if (err.response) {
        message.error(err.response.data.message || '编辑歌曲失败');
      } else if (err.errorFields) {
        // Form 校验错误，不弹 message
      } else {
        message.error('编辑歌曲失败');
      }
    }
  };

  // ==========  删除歌曲  ==========
  const handleDeleteSong = async (id) => {
    console.log("handleDeleteSong clicked, id=", id);
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这首歌曲吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await axios.delete(`/api/songs/${id}`);
          message.success('删除成功');
          fetchSongs(searchTerm);
        } catch (error) {
          console.error('Error deleting song:', error);
          message.error('删除失败');
        }
      },
    });
  };

  // antd Table 的列配置
  const columns = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '歌手', dataIndex: 'artist', key: 'artist' },
    { title: '专辑', dataIndex: 'album', key: 'album' },
    { title: '风格', dataIndex: 'genre', key: 'genre' },
    { title: '年份', dataIndex: 'year', key: 'year', width: 80 },
    { title: 'Meta', dataIndex: 'meta_data', key: 'meta_data' },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleOpenEditModal(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDeleteSong(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: 20 }}>歌曲列表</h1>

      {/* 搜索框 & 新增按钮 */}
      <div style={{ display: 'flex', marginBottom: 20, gap: '16px' }}>
        <Input.Search
          placeholder="搜索歌曲或歌手..."
          onSearch={onSearch}
          allowClear
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleOpenAddModal}>
          添加歌曲
        </Button>
      </div>

      {/* 表格展示歌曲 */}
      <Table
        columns={columns}
        dataSource={songs}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }} // 每页显示条数
      />

      {/* ========== 新增歌曲 Modal ========== */}
      <Modal
        title="添加新歌曲"
        visible={addModalVisible}
        onOk={handleAddSong}
        onCancel={() => setAddModalVisible(false)}
        okText="提交"
        cancelText="取消"
      >
        <Form
          form={addForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入歌曲标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="歌手"
            name="artist"
            rules={[{ required: true, message: '请输入歌手名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="专辑" name="album">
            <Input />
          </Form.Item>
          <Form.Item label="风格" name="genre">
            <Input />
          </Form.Item>
          <Form.Item label="年份" name="year">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Meta" name="meta_data">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== 编辑歌曲 Modal ========== */}
      <Modal
        title="编辑歌曲"
        visible={editModalVisible}
        onOk={handleEditSong}
        onCancel={() => setEditModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={editForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入歌曲标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="歌手"
            name="artist"
            rules={[{ required: true, message: '请输入歌手名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="专辑" name="album">
            <Input />
          </Form.Item>
          <Form.Item label="风格" name="genre">
            <Input />
          </Form.Item>
          <Form.Item label="年份" name="year">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Meta" name="meta_data">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SongList;
