// SongList/index.js - 主组件
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, message, Modal, Form, Card, Space, Divider } from 'antd';
import { 
  CoffeeOutlined,
  CustomerServiceOutlined,
  SoundOutlined
} from '@ant-design/icons';
import { useDeviceDetect } from '../../utils/deviceDetector';

// 导入子组件
import MobileView from './MobileView';
import DesktopView from './DesktopView';
import SongForm from './SongForm';
import { 
  highlightColor, 
  bgColor, 
  secondaryColor, 
  themeColor, 
  textColor, 
  themeGradient
} from './constants';

const { Title, Paragraph } = Typography;

function SongList({ isAdmin }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isMobile } = useDeviceDetect();

  // 标签相关状态
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // 新增歌曲对话框
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  // 编辑歌曲对话框
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [currentEditId, setCurrentEditId] = useState(null);

  // 动画状态
  const [showContent, setShowContent] = useState(false);

  // ========= 初始化：获取列表 =========
  useEffect(() => {
    fetchSongs();
    
    // 添加延迟动画效果
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    
    return () => clearTimeout(timer);
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
      styles: {
        mask: {
          backdropFilter: 'blur(5px)',
        },
        header: {
          background: bgColor,
          borderBottom: '1px solid rgba(168, 143, 106, 0.3)',
        },
        body: {
          background: bgColor,
          padding: '20px',
          color: textColor
        },
        footer: {
          background: bgColor,
          borderTop: '1px solid rgba(168, 143, 106, 0.3)',
        }
      },
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

  // 获取筛选后的歌曲
  const filteredSongs = getFilteredSongs();

  return (
    <div style={{ 
      padding: isMobile ? '16px 8px' : '24px',
      position: 'relative',
      minHeight: '100vh',
      background: `linear-gradient(135deg, rgba(28, 33, 52, 0.95) 0%, rgba(53, 42, 70, 0.95) 100%)`,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundImage: `linear-gradient(135deg, rgba(28, 33, 52, 0.95) 0%, rgba(53, 42, 70, 0.95) 100%),
                        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-43-80c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm23 69c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-95 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a88f6a' fill-opacity='0.07' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      transition: 'all 0.5s ease-out',
      opacity: showContent ? 1 : 0,
      transform: showContent ? 'translateY(0)' : 'translateY(20px)',
    }}>
      {/* 装饰性背景元素 */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 143, 106, 0.15) 0%, rgba(168, 143, 106, 0) 70%)',
        top: '10%',
        right: '-50px',
        zIndex: 0,
        pointerEvents: 'none'
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
        pointerEvents: 'none'
      }} />

      {/* 顶部标题区域 */}
      <Card 
        style={{ 
          marginBottom: isMobile ? 20 : 30,
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(168, 143, 106, 0.3)',
          background: 'rgba(28, 33, 52, 0.95)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
        }}
        bordered={false}
      >
        {/* 顶部渐变装饰条 */}
        <div style={{
          height: '6px',
          background: themeGradient,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }} />
        
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Title 
            level={isMobile ? 3 : 2} 
            style={{ 
              margin: '12px 0 16px',
              textAlign: 'center',
              background: 'linear-gradient(45deg, #a88f6a, #e3bb4d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <SoundOutlined style={{ fontSize: isMobile ? '24px' : '28px' }} />
            深夜小酒馆 · 点歌台
            <CustomerServiceOutlined style={{ fontSize: isMobile ? '24px' : '28px' }} />
          </Title>
          
          <Paragraph style={{ 
            fontSize: isMobile ? '14px' : '16px',
            color: textColor,
            textAlign: 'center',
            marginBottom: '8px',
            maxWidth: '700px',
            margin: '0 auto 16px',
          }}>
            欢迎来到小酒馆的点歌台，在这里您可以浏览酒馆精选的音乐，找到属于您的那一抹心情。
          </Paragraph>
          
          <div style={{ 
            margin: '0 auto',
            width: '60px', 
            borderBottom: `2px dashed ${themeColor}44`,
            marginBottom: '16px'
          }} />
        </Space>
      </Card>

      {/* 歌曲列表内容 */}
      <div style={{ 
        position: 'relative',
        zIndex: 1,
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease-out 0.2s',
      }}>
        {isMobile ? (
          <MobileView
            songs={filteredSongs}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={onSearch}
            allTags={allTags}
            selectedTags={selectedTags}
            handleTagSelect={handleTagSelect}
            isAdmin={isAdmin}
            handleOpenAddModal={handleOpenAddModal}
            handleOpenEditModal={handleOpenEditModal}
            handleDeleteSong={handleDeleteSong}
          />
        ) : (
          <DesktopView
            songs={filteredSongs}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={onSearch}
            allTags={allTags}
            selectedTags={selectedTags}
            handleTagSelect={handleTagSelect}
            setSelectedTags={setSelectedTags}
            isAdmin={isAdmin}
            handleOpenAddModal={handleOpenAddModal}
            handleOpenEditModal={handleOpenEditModal}
            handleDeleteSong={handleDeleteSong}
          />
        )}
      </div>

      {/* 新增 & 编辑表单 */}
      <SongForm
        form={addForm}
        onFinish={handleAddSong}
        modalVisible={addModalVisible}
        setModalVisible={setAddModalVisible}
        title="添加新歌曲"
      />

      <SongForm
        form={editForm}
        onFinish={handleEditSong}
        modalVisible={editModalVisible}
        setModalVisible={setEditModalVisible}
        title="编辑歌曲"
      />
      
      {/* 样式定义 */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}

export default SongList; 