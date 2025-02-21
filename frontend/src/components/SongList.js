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

function SongList() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 是否管理员登录
  const [isAdmin, setIsAdmin] = useState(false);

  // 登录表单相关
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm] = Form.useForm();

  // 新增歌曲对话框
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  // 编辑歌曲对话框
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [currentEditId, setCurrentEditId] = useState(null);

  // ========== 初始化: 获取歌曲列表 & 检查是否已登录管理员 ==========
  useEffect(() => {
    fetchSongs();
    checkAuth();
  }, []);

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

  // 前端检查是否已登录
  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/check_auth');
      setIsAdmin(res.data.is_admin);
    } catch (err) {
      console.error('Error checking auth:', err);
      // 如果出错，就认为没登录
      setIsAdmin(false);
    }
  };

  // ========== 搜索 ==========
  const onSearch = (value) => {
    setSearchTerm(value);
    fetchSongs(value);
  };

  // ========== 登录 & 登出 ==========
  const handleLoginSubmit = async () => {
    try {
      const values = await loginForm.validateFields();
      const res = await axios.post('/api/login', values);
      if (res.status === 200) {
        message.success('登录成功');
        setIsAdmin(true);
        setShowLoginModal(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        message.error(err.response.data.message || '登录失败');
      } else if (err.errorFields) {
        // 表单校验错误，不弹 message
      } else {
        message.error('登录失败');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      setIsAdmin(false);
      message.success('已登出');
    } catch (err) {
      console.error('Logout error:', err);
      message.error('登出失败');
    }
  };

  // ========== 新增歌曲 ==========
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
      await axios.post('/api/songs', values);
      message.success('添加歌曲成功');
      setAddModalVisible(false);
      fetchSongs(searchTerm);
    } catch (err) {
      console.error('Error adding song:', err);
      if (err.response && err.response.status === 403) {
        message.error('没有管理员权限，无法添加');
      } else {
        message.error('添加失败');
      }
    }
  };

  // ========== 编辑 ==========
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
      await axios.put(`/api/songs/${currentEditId}`, values);
      message.success('编辑歌曲成功');
      setEditModalVisible(false);
      setCurrentEditId(null);
      fetchSongs(searchTerm);
    } catch (err) {
      console.error('Error editing song:', err);
      if (err.response && err.response.status === 403) {
        message.error('没有管理员权限，无法编辑');
      } else {
        message.error('编辑失败');
      }
    }
  };

  // ========== 删除 ==========
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
          await axios.delete(`/api/songs/${id}`);
          message.success('删除成功');
          fetchSongs(searchTerm);
        } catch (error) {
          console.error('Error deleting song:', error);
          if (error.response && error.response.status === 403) {
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
      {/* 顶部标题与右上角登录/登出按钮 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <h1>歌曲列表</h1>
      </div>

      {/* 搜索栏 + 添加歌曲按钮 + 管理员登录/登出按钮 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        
        {/* 左侧：搜索栏 + 添加歌曲按钮 */}
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

        {/* 右侧：管理员状态和登出按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAdmin ? (
            <>
              <span>已登录为管理员</span>
              <Button onClick={handleLogout}>登出</Button>
            </>
          ) : (
            <Button type="primary" onClick={() => setShowLoginModal(true)}>
              管理员登录
            </Button>
          )}
        </div>

      </div>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={songs}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* 登录对话框 */}
      <Modal
        title="管理员登录"
        visible={showLoginModal}
        onOk={handleLoginSubmit}
        onCancel={() => setShowLoginModal(false)}
        okText="登录"
        cancelText="取消"
      >
        <Form form={loginForm} layout="vertical">
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加歌曲 */}
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

      {/* 编辑歌曲 */}
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
