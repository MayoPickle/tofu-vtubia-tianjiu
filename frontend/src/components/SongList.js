// SongList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, Button, Modal, Form, message, Space, Card, List, Typography, Tag, Select } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  HeartOutlined, 
  CustomerServiceOutlined, 
  StarOutlined,
  BulbOutlined, 
  FireOutlined, 
  ShopOutlined, 
  CoffeeOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useDeviceDetect } from '../utils/deviceDetector';

const { Text, Title } = Typography;
const { Option } = Select;

// 深夜小酒馆主题颜色和渐变定义
const themeColor = '#a88f6a';
const secondaryColor = '#352a46';  // 深紫色
const highlightColor = '#e3bb4d';  // 亮黄色
const themeGradient = 'linear-gradient(135deg, #a88f6a 0%, #917752 100%)';
const secondaryGradient = 'linear-gradient(135deg, #352a46 0%, #261e36 100%)';
const bgColor = '#1c2134';
const textColor = '#e6d6bc';

function SongList() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isMobile } = useDeviceDetect();

  // 标签相关状态
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

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
      const songsArray = Array.isArray(songsData) ? songsData : [];
      setSongs(songsArray);
      
      // 提取所有唯一标签
      const tagsSet = new Set();
      songsArray.forEach(song => {
        if (song.tags) {
          song.tags.split(',').forEach(tag => tagsSet.add(tag.trim()));
        }
      });
      setAllTags(Array.from(tagsSet).sort());
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
      tags: record.tags,
      link: record.link,
      description: record.description
    });
    setEditModalVisible(true);
  };

  const handleEditSong = async () => {
    try {
      const values = await editForm.validateFields();
      if (values.year) {
        values.year = parseInt(values.year, 10);
      }
      await axios.put(`/api/songs/${currentEditId}`, values, {
        withCredentials: true
      });
      message.success('更新成功');
      setEditModalVisible(false);
      fetchSongs(searchTerm);
    } catch (err) {
      console.error('Error updating song:', err);
      if (err.response?.status === 403) {
        message.error('没有管理员权限，无法编辑');
      } else {
        message.error('更新失败');
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
      content: '确定要删除这首歌曲吗？此操作不可恢复。',
      onOk: async () => {
        try {
          await axios.delete(`/api/songs/${id}`, { withCredentials: true });
          message.success('删除成功');
          fetchSongs(searchTerm);
        } catch (err) {
          console.error('Error deleting song:', err);
          if (err.response?.status === 403) {
            message.error('没有管理员权限，无法删除');
          } else {
            message.error('删除失败');
          }
        }
      },
    });
  };

  // 处理标签筛选
  const handleTagSelect = (selectedValues) => {
    setSelectedTags(selectedValues);
  };

  // 获取筛选后的歌曲列表
  const getFilteredSongs = () => {
    if (selectedTags.length === 0) {
      return songs;
    }
    return songs.filter(song => {
      if (!song.tags) return false;
      const songTags = song.tags.split(',').map(tag => tag.trim());
      return selectedTags.some(tag => songTags.includes(tag));
    });
  };

  // ========================== 表格配置 ==========================
  const columns = [
    {
      title: '歌曲名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CoffeeOutlined style={{ color: themeColor, fontSize: '18px' }} />
          <span style={{ color: textColor }}>{text}</span>
        </div>
      ),
    },
    {
      title: '歌手',
      dataIndex: 'artist',
      key: 'artist',
      render: (text) => <span style={{ color: 'rgba(230, 214, 188, 0.8)' }}>{text}</span>,
    },
    {
      title: '专辑',
      dataIndex: 'album',
      key: 'album',
      responsive: ['lg']
    },
    {
      title: '风格',
      dataIndex: 'genre',
      key: 'genre',
      responsive: ['lg']
    },
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      width: 80
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: tags => renderSongTags(tags)
    },
    {
      title: 'Meta',
      dataIndex: 'meta_data',
      key: 'meta_data',
      responsive: ['xl']
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      responsive: ['lg']
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        isAdmin ? (
          <Space>
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => handleOpenEditModal(record)}
            />
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger 
              onClick={() => handleDeleteSong(record.id)}
            />
          </Space>
        ) : null
      ),
    },
  ];

  // ======== 渲染单个歌曲的标签 ========
  const renderSongTags = (tags) => {
    if (!tags) return null;
    
    return (
      <div style={{ marginTop: '8px' }}>
        {tags.split(',').map((tag, index) => (
          <Tag 
            key={tag} 
            style={{ 
              marginBottom: '6px',
              background: index % 3 === 0 ? 'rgba(168, 143, 106, 0.15)' : 
                          index % 3 === 1 ? 'rgba(53, 42, 70, 0.2)' : 
                          'rgba(227, 187, 77, 0.15)',
              borderColor: index % 3 === 0 ? 'rgba(168, 143, 106, 0.5)' : 
                           index % 3 === 1 ? 'rgba(53, 42, 70, 0.5)' : 
                           'rgba(227, 187, 77, 0.4)',
              color: index % 3 === 2 ? '#261e36' : '#e6d6bc'
            }}
            onClick={() => {
              if (!selectedTags.includes(tag.trim())) {
                setSelectedTags([...selectedTags, tag.trim()]);
              }
            }}
          >
            {tag.trim()}
          </Tag>
        ))}
      </div>
    );
  };

  // ======== 渲染表单组件 ========
  const renderSongForm = (form, onFinish, modalVisible, setModalVisible, title) => (
    <Modal
      title={title}
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      onOk={onFinish}
      styles={{
        header: {
          background: bgColor,
          borderBottom: '1px solid rgba(168, 143, 106, 0.3)',
        },
        body: {
          background: bgColor,
          padding: '20px',
        },
        footer: {
          background: bgColor,
          borderTop: '1px solid rgba(168, 143, 106, 0.3)',
        },
        mask: {
          backdropFilter: 'blur(5px)',
        },
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="歌曲名称"
          rules={[{ required: true, message: '请输入歌曲名称' }]}
        >
          <Input placeholder="请输入歌曲名称" />
        </Form.Item>
        
        <Form.Item
          name="artist"
          label="歌手"
          rules={[{ required: true, message: '请输入歌手名' }]}
        >
          <Input placeholder="请输入歌手名" />
        </Form.Item>
        
        <Form.Item name="album" label="专辑">
          <Input placeholder="请输入专辑名" />
        </Form.Item>

        <Form.Item name="genre" label="风格">
          <Input placeholder="请输入音乐风格" />
        </Form.Item>

        <Form.Item name="year" label="年份">
          <Input type="number" placeholder="请输入发行年份" />
        </Form.Item>

        <Form.Item name="meta_data" label="元数据">
          <Input.TextArea placeholder="例如：JSON格式的歌曲额外信息" rows={2} />
        </Form.Item>

        <Form.Item name="tags" label="标签">
          <Input placeholder="多个标签用逗号分隔，如：流行,摇滚,经典" />
        </Form.Item>
      </Form>
    </Modal>
  );

  // ======== 移动端 - 列表渲染 ========
  const renderMobileView = () => {
    const filteredSongs = getFilteredSongs();

    return (
      <div style={{ padding: '16px', paddingTop: '0' }}>
        <div style={{ 
          marginBottom: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input
              placeholder="搜索歌曲名或歌手"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={() => onSearch(searchTerm)}
              style={{ flex: 1 }}
              prefix={<SearchOutlined style={{ color: themeColor }} />}
              allowClear
            />
            <Button 
              type="primary" 
              onClick={() => onSearch(searchTerm)}
              icon={<SearchOutlined />}
            >
              搜索
            </Button>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Select
              mode="multiple"
              style={{ flex: 1 }}
              placeholder="按标签筛选"
              value={selectedTags}
              onChange={handleTagSelect}
              maxTagCount="responsive"
            >
              {allTags.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
            
            {isAdmin && (
              <Button 
                type="primary" 
                onClick={handleOpenAddModal}
                icon={<PlusOutlined />}
              >
                添加
              </Button>
            )}
          </div>
        </div>
        
        <List
          itemLayout="vertical"
          dataSource={filteredSongs}
          loading={loading}
          renderItem={(item, index) => (
            <Card 
              style={{ 
                marginBottom: '16px',
                background: index % 2 === 0 ? bgColor : secondaryColor,
                borderColor: index % 2 === 0 ? 'rgba(168, 143, 106, 0.3)' : 'rgba(227, 187, 77, 0.2)',
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <List.Item
                key={item.id}
                actions={isAdmin ? [
                  <Button 
                    type="text" 
                    icon={<EditOutlined style={{ color: highlightColor }} />} 
                    onClick={() => handleOpenEditModal(item)}
                  >
                    编辑
                  </Button>,
                  <Button 
                    type="text" 
                    danger
                    icon={<DeleteOutlined />} 
                    onClick={() => handleDeleteSong(item.id)}
                  >
                    删除
                  </Button>
                ] : []}
              >
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CoffeeOutlined style={{ color: highlightColor, fontSize: '18px' }} />
                      <Text 
                        style={{ 
                          color: textColor, 
                          fontSize: '18px',
                          fontFamily: 'Playfair Display'
                        }}
                        strong
                      >
                        {item.title}
                      </Text>
                    </div>
                  }
                  description={
                    <div>
                      <Text style={{ color: 'rgba(230, 214, 188, 0.8)' }}>
                        <CustomerServiceOutlined style={{ marginRight: '5px', color: themeColor }} />
                        {item.artist}
                      </Text>
                      <br />
                      {item.album && (
                        <Text style={{ color: 'rgba(230, 214, 188, 0.7)' }}>
                          <FireOutlined style={{ marginRight: '5px', color: secondaryColor === bgColor ? highlightColor : themeColor }} />
                          专辑: {item.album}
                        </Text>
                      )}
                      {item.year && (
                        <Text style={{ marginLeft: '10px', color: 'rgba(230, 214, 188, 0.7)' }}>
                          • {item.year}
                        </Text>
                      )}
                    </div>
                  }
                />

                {item.link && (
                  <div style={{ margin: '10px 0' }}>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        color: highlightColor,
                        border: `1px solid ${highlightColor}`,
                        borderRadius: '4px',
                        transition: 'all 0.3s',
                        textDecoration: 'none',
                        marginTop: '8px'
                      }}
                    >
                      <CustomerServiceOutlined style={{ marginRight: '5px' }} />
                      播放歌曲
                    </a>
                  </div>
                )}

                {item.description && (
                  <div style={{ margin: '10px 0', color: 'rgba(230, 214, 188, 0.7)' }}>
                    {item.description}
                  </div>
                )}

                {renderSongTags(item.tags)}
              </List.Item>
            </Card>
          )}
        />
      </div>
    );
  };

  // ======== PC端 - 表格渲染 ========
  const renderDesktopView = () => {
    const filteredSongs = getFilteredSongs();

    return (
      <>
        <Card
          style={{ 
            marginBottom: '24px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(168, 143, 106, 0.2)',
            background: bgColor,
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <Input
              placeholder="搜索歌曲..."
              prefix={<SearchOutlined style={{ color: highlightColor }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={() => onSearch(searchTerm)}
              style={{ 
                width: '320px',
                borderRadius: '8px',
                border: '1px solid rgba(168, 143, 106, 0.3)'
              }}
            />
            
            <Select
              mode="multiple"
              allowClear
              style={{ 
                width: '200px',
                borderRadius: '8px'
              }}
              placeholder="标签筛选"
              value={selectedTags}
              onChange={handleTagSelect}
              options={allTags.map(tag => ({ label: tag, value: tag }))}
              showSearch
              optionFilterProp="label"
            />

            {selectedTags.length > 0 && (
              <Button 
                type="link"
                onClick={() => setSelectedTags([])}
                style={{ color: highlightColor }}
              >
                清除筛选
              </Button>
            )}

            <div style={{ flex: 1 }} />

            {isAdmin && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenAddModal}
                style={{
                  background: secondaryGradient,
                  border: `1px solid ${highlightColor}`,
                  borderRadius: '8px',
                  height: '40px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}
              >
                添加歌曲
              </Button>
            )}
          </div>
        </Card>

        <Table
          columns={columns}
          dataSource={filteredSongs}
          rowKey="id"
          loading={loading}
          style={{
            background: bgColor,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(168, 143, 106, 0.2)',
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 首歌曲`,
            style: {
              marginTop: '16px',
              textAlign: 'center',
              color: textColor
            }
          }}
        />
      </>
    );
  };

  return (
    <div style={{ 
      padding: isMobile ? '16px 8px' : '24px',
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(28, 33, 52, 0.8) 0%, rgba(53, 42, 70, 0.8) 100%)'
    }}>
      {/* 装饰性背景元素 */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 143, 106, 0.1) 0%, rgba(168, 143, 106, 0) 70%)',
        top: '10%',
        right: '-50px',
        zIndex: 0,
      }} />
      
      <div style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(227, 187, 77, 0.1) 0%, rgba(227, 187, 77, 0) 70%)',
        bottom: '10%',
        left: '-30px',
        zIndex: 0,
      }} />

      <Title 
        level={2} 
        style={{ 
          margin: '16px 0 24px',
          textAlign: 'center',
          color: highlightColor,
          fontFamily: 'Playfair Display',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <CoffeeOutlined />
        音乐小馆
        <CoffeeOutlined />
      </Title>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {isMobile ? renderMobileView() : renderDesktopView()}
      </div>

      {renderSongForm(addForm, handleAddSong, addModalVisible, setAddModalVisible, '添加歌曲')}
      {renderSongForm(editForm, handleEditSong, editModalVisible, setEditModalVisible, '编辑歌曲')}
    </div>
  );
}

export default SongList;
