// SongList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, Button, Modal, Form, message, Space } from 'antd';

function SongList() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 是否管理员
  const [isAdmin, setIsAdmin] = useState(false);

  // 新增歌曲对话框
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  // 编辑歌曲对话框
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [currentEditId, setCurrentEditId] = useState(null);

  // ========= 初始化：获取列表 & 检查是否管理员 =========
  useEffect(() => {
    fetchSongs();
    checkAuth();
  }, []);

  // 获取歌曲列表
  const fetchSongs = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(
        search ? `/api/songs?search=${search}` : '/api/songs'
      );
      // 从响应中提取songs数组
      const songsData = res.data.songs;
      // 确保数据是数组
      setSongs(Array.isArray(songsData) ? songsData : []);
    } catch (error) {
      console.error('Error fetching songs:', error);
      message.error('获取歌曲列表失败');
      setSongs([]); // 出错时设为空数组
    } finally {
      setLoading(false);
    }
  };

  // 检查当前登录状态，获取是否 admin
  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/check_auth', { withCredentials: true });
      setIsAdmin(res.data.is_admin);
    } catch (err) {
      console.error('Error checking auth:', err);
      setIsAdmin(false);
    }
  };

  // ======== 搜索 ========
  const onSearch = (value) => {
    setSearchTerm(value);
    fetchSongs(value);
  };

  // ======== 新增歌曲 ========
  const handleOpenAddModal = () => {
    if (!isAdmin) {
      message.warning('请先登录管理员账号');
      return;
    }
    addForm.resetFields();
    setAddModalVisible(true);
  };

  const handleAddSong = async () => {
    try {
      const values = await addForm.validateFields();
      if (values.year) {
        values.year = parseInt(values.year, 10);
      }
      await axios.post('/api/songs', values, { withCredentials: true });
      message.success('添加歌曲成功');
      setAddModalVisible(false);
      fetchSongs(searchTerm);
    } catch (err) {
      console.error('Error adding song:', err);
      if (err.response?.status === 403) {
        message.error('没有管理员权限，无法添加');
      } else {
        message.error('添加失败');
      }
    }
  };

  // ======== 编辑 ========
  const handleOpenEditModal = (record) => {
    if (!isAdmin) {
      message.warning('请先登录管理员账号');
      return;
    }
    setCurrentEditId(record.id);
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

  const handleEditSong = async () => {
    try {
      const values = await editForm.validateFields();
      if (values.year) {
        values.year = parseInt(values.year, 10);
      }
      await axios.put(`/api/songs/${currentEditId}`, values, { withCredentials: true });
      message.success('编辑歌曲成功');
      setEditModalVisible(false);
      setCurrentEditId(null);
      fetchSongs(searchTerm);
    } catch (err) {
      console.error('Error editing song:', err);
      if (err.response?.status === 403) {
        message.error('没有管理员权限，无法编辑');
      } else {
        message.error('编辑失败');
      }
    }
  };

  // ======== 删除 ========
  const handleDeleteSong = async (id) => {
    if (!isAdmin) {
      message.warning('请先登录管理员账号');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这首歌曲吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await axios.delete(`/api/songs/${id}`, { withCredentials: true });
          message.success('删除成功');
          fetchSongs(searchTerm);
        } catch (error) {
          console.error('Error deleting song:', error);
          if (error.response?.status === 403) {
            message.error('没有管理员权限，无法删除');
          } else {
            message.error('删除失败');
          }
        }
      },
    });
  };

  // 表格列
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <h1>歌曲列表</h1>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 20 
      }}>
        {/* 搜索栏 + 添加歌曲按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
      </div>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={Array.isArray(songs) ? songs : []}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* 添加歌曲弹窗 */}
      <Modal
        title="添加新歌曲"
        visible={addModalVisible}
        onOk={handleAddSong}
        onCancel={() => setAddModalVisible(false)}
        okText="提交"
        cancelText="取消"
      >
        <Form form={addForm} layout="vertical">
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

      {/* 编辑歌曲弹窗 */}
      <Modal
        title="编辑歌曲"
        visible={editModalVisible}
        onOk={handleEditSong}
        onCancel={() => setEditModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={editForm} layout="vertical">
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
