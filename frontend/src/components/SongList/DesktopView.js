// DesktopView.js - 桌面端视图组件
import React from 'react';
import { Table, Input, Button, Card, Select, Space, Tag, Tooltip, Typography } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CoffeeOutlined,
  CustomerServiceOutlined,
  TagOutlined,
  CalendarOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  TagsOutlined
} from '@ant-design/icons';
import SongTags from './SongTags';
import { themeColor, bgColor, highlightColor, secondaryGradient, textColor, secondaryColor, themeGradient } from './constants';

const { Text, Link } = Typography;

const DesktopView = ({ 
  songs, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  onSearch, 
  allTags, 
  selectedTags, 
  handleTagSelect, 
  setSelectedTags,
  isAdmin, 
  handleOpenAddModal, 
  handleOpenEditModal, 
  handleDeleteSong 
}) => {
  // 表格列定义
  const columns = [
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
          <CoffeeOutlined />
          <span>歌曲</span>
        </div>
      ),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text, record) => {
        const hasLink = !!record.link;
        
        return (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            paddingLeft: '8px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(168, 143, 106, 0.1)',
              transition: 'all 0.3s ease',
              animation: 'float 4s ease-in-out infinite',
              boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <CoffeeOutlined style={{ 
                color: highlightColor, 
                fontSize: '18px',
              }} />
            </div>
            
            <Space direction="vertical" size={0} style={{ flex: 1 }}>
              <Text 
                style={{ 
                  color: textColor, 
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
                ellipsis={{ tooltip: text }}
              >
                {text}
              </Text>
              
              {record.genre && (
                <Text 
                  style={{ 
                    color: 'rgba(230, 214, 188, 0.6)', 
                    fontSize: '12px'
                  }}
                >
                  {record.genre}
                </Text>
              )}
            </Space>
            
            {hasLink && (
              <Tooltip title="播放歌曲" placement="top" color={secondaryColor}>
                <a
                  href={record.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: highlightColor,
                    background: 'rgba(53, 42, 70, 0.3)',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    marginLeft: 'auto'
                  }}
                  className="play-link"
                >
                  <PlayCircleOutlined />
                </a>
              </Tooltip>
            )}
          </div>
        );
      },
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
          <CustomerServiceOutlined />
          <span>歌手</span>
        </div>
      ),
      dataIndex: 'artist',
      key: 'artist',
      ellipsis: true,
      width: '15%',
      render: (text) => (
        <Text 
          style={{ 
            color: 'rgba(230, 214, 188, 0.9)', 
            fontSize: '14px',
            transition: 'all 0.3s ease',
          }}
          ellipsis={{ tooltip: text }}
          className="artist-text"
        >
          {text}
        </Text>
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
          <InfoCircleOutlined />
          <span>专辑</span>
        </div>
      ),
      dataIndex: 'album',
      key: 'album',
      responsive: ['md'],
      ellipsis: true,
      width: '12%',
      render: (text) => text ? (
        <Text 
          style={{ 
            color: 'rgba(230, 214, 188, 0.8)', 
            fontSize: '14px' 
          }}
          ellipsis={{ tooltip: text }}
        >
          {text}
        </Text>
      ) : null,
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
          <CalendarOutlined />
          <span>年份</span>
        </div>
      ),
      dataIndex: 'year',
      key: 'year',
      align: 'center',
      width: '8%',
      responsive: ['md'],
      render: year => year ? (
        <Tag
          style={{
            background: 'rgba(168, 143, 106, 0.1)',
            borderColor: 'rgba(168, 143, 106, 0.4)',
            color: textColor,
            borderRadius: '12px',
            fontSize: '12px',
            padding: '0 10px',
            margin: 0,
            display: 'inline-block'
          }}
        >
          {year}
        </Tag>
      ) : null,
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
          <TagOutlined />
          <span>标签</span>
        </div>
      ),
      dataIndex: 'tags',
      key: 'tags',
      width: '25%',
      render: tags => <SongTags tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
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
          <FileTextOutlined />
          <span>描述</span>
        </div>
      ),
      dataIndex: 'description',
      key: 'description',
      responsive: ['lg'],
      ellipsis: true,
      render: text => text ? (
        <Text 
          style={{ 
            color: 'rgba(230, 214, 188, 0.7)',
            fontSize: '13px' 
          }}
          ellipsis={{ tooltip: text, rows: 2 }}
        >
          {text}
        </Text>
      ) : null,
    },
  ];
  
  // 如果是管理员，添加操作列
  if (isAdmin) {
    columns.push({
      title: '操作',
      key: 'action',
      width: '100px',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="编辑" placement="top" color={secondaryColor}>
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => handleOpenEditModal(record)}
              style={{
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                border: '1px solid rgba(168, 143, 106, 0.3)',
                background: 'rgba(28, 33, 52, 0.6)',
                color: highlightColor
              }}
            />
          </Tooltip>
          <Tooltip title="删除" placement="top" color={secondaryColor}>
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger 
              onClick={() => handleDeleteSong(record.id)}
              style={{
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                border: '1px solid rgba(240, 85, 85, 0.3)',
                background: 'rgba(28, 33, 52, 0.6)'
              }}
            />
          </Tooltip>
        </Space>
      ),
    });
  }

  return (
    <>
      <Card
        style={{ 
          marginBottom: '24px',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(168, 143, 106, 0.2)',
          background: 'rgba(28, 33, 52, 0.7)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
        }}
        bodyStyle={{ padding: '20px' }}
        bordered={false}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            position: 'relative', 
            flex: '0 0 320px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              marginBottom: '2px'
            }}>
              <SearchOutlined style={{ color: highlightColor }} />
              <Text style={{ color: textColor, fontSize: '14px' }}>搜索歌曲:</Text>
            </div>
            <Input
              placeholder="输入歌曲名称或歌手..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={() => onSearch(searchTerm)}
              style={{ 
                width: '100%',
                borderRadius: '8px',
                border: '1px solid rgba(168, 143, 106, 0.3)',
                background: 'rgba(28, 33, 52, 0.6)',
                color: textColor,
                height: '32px',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center'
              }}
              allowClear
              className="search-input"
            />
          </div>
          
          <div style={{ 
            position: 'relative', 
            flex: '1 1 200px', 
            minWidth: '200px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              marginBottom: '2px'
            }}>
              <TagsOutlined style={{ color: highlightColor }} />
              <Text style={{ color: textColor, fontSize: '14px' }}>标签筛选:</Text>
            </div>
            <Select
              mode="multiple"
              allowClear
              style={{ 
                width: '100%',
                height: '32px'
              }}
              placeholder="选择标签进行筛选"
              value={selectedTags}
              onChange={handleTagSelect}
              options={allTags.map(tag => ({ label: tag, value: tag }))}
              showSearch
              optionFilterProp="label"
              className="tag-select"
              dropdownClassName="tag-dropdown"
              popupMatchSelectWidth={false}
              listHeight={280}
              tagRender={(props) => (
                <Tag 
                  {...props} 
                  style={{
                    background: 'rgba(227, 187, 77, 0.2)',
                    borderColor: highlightColor,
                    color: textColor,
                    borderRadius: '10px',
                    marginRight: '4px'
                  }}
                />
              )}
            />
          </div>

          {selectedTags.length > 0 && (
            <Button 
              type="link"
              onClick={() => setSelectedTags([])}
              style={{ 
                color: highlightColor,
                padding: '4px 12px',
                height: 'auto',
                fontSize: '14px',
                background: 'rgba(227, 187, 77, 0.1)',
                borderRadius: '8px',
                border: 'none',
                marginTop: '24px'
              }}
            >
              清除筛选
            </Button>
          )}

          <div style={{ flex: '0 0 auto', marginLeft: 'auto', marginTop: '24px' }}>
            {isAdmin && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenAddModal}
                style={{
                  background: themeGradient,
                  border: `1px solid ${themeColor}`,
                  borderRadius: '8px',
                  height: '40px',
                  padding: '0 24px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                添加歌曲
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Table
        columns={columns}
        dataSource={songs}
        rowKey="id"
        loading={loading}
        style={{
          background: 'transparent'
        }}
        rowClassName={(record, index) => 
          index % 2 === 0 ? 'even-row' : 'odd-row'
        }
        className="songs-table"
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
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: (
            <div style={{ 
              padding: '40px 0',
              color: textColor,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CoffeeOutlined style={{ fontSize: '32px', marginBottom: '16px', color: themeColor }} />
              <Text style={{ color: textColor }}>暂无歌曲，或没有符合条件的歌曲</Text>
            </div>
          )
        }}
      />
      
      <style jsx="true">{`
        .songs-table .ant-table {
          background: transparent !important;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .songs-table .ant-table-container {
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(168, 143, 106, 0.2);
          overflow: hidden;
        }
        
        .songs-table .ant-table-thead > tr > th {
          background: rgba(28, 33, 52, 0.95) !important;
          border-bottom: 1px solid rgba(168, 143, 106, 0.3) !important;
          color: ${textColor};
          padding: 16px;
        }
        
        .songs-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid rgba(168, 143, 106, 0.1) !important;
          padding: 12px 16px;
          transition: all 0.3s ease;
        }
        
        .songs-table .even-row {
          background: rgba(28, 33, 52, 0.8) !important;
        }
        
        .songs-table .odd-row {
          background: rgba(53, 42, 70, 0.5) !important;
        }
        
        .songs-table .ant-table-tbody > tr:hover > td {
          background: rgba(168, 143, 106, 0.1) !important;
        }
        
        .songs-table .ant-pagination-item {
          background: rgba(28, 33, 52, 0.8);
          border-color: rgba(168, 143, 106, 0.3);
        }
        
        .songs-table .ant-pagination-item a {
          color: ${textColor};
        }
        
        .songs-table .ant-pagination-item-active {
          background: rgba(168, 143, 106, 0.2);
          border-color: ${themeColor};
        }
        
        .songs-table .ant-pagination-item-active a {
          color: ${highlightColor};
        }
        
        .songs-table .ant-pagination-prev button, 
        .songs-table .ant-pagination-next button {
          background: rgba(28, 33, 52, 0.8);
          color: ${textColor};
          border-color: rgba(168, 143, 106, 0.3);
        }
        
        .songs-table .ant-empty-description {
          color: ${textColor};
        }
        
        .songs-table .ant-table-tbody > tr.ant-table-row:hover .artist-text {
          color: ${highlightColor} !important;
        }
        
        .play-link:hover {
          background: rgba(227, 187, 77, 0.2) !important;
          transform: scale(1.1);
          box-shadow: 0 0 12px rgba(227, 187, 77, 0.3);
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        /* 自定义搜索输入框样式 */
        .search-input input {
          color: ${textColor} !important;
          font-size: 14px;
          height: 30px;
          line-height: 1;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          padding-left: 12px !important;
          margin-top: -2px;
        }
        
        .search-input input::placeholder {
          color: rgba(230, 214, 188, 0.5) !important;
        }
        
        .search-input .ant-input-clear-icon {
          margin-top: -2px;
        }
        
        /* 自定义标签选择器样式 */
        .tag-select .ant-select-selector {
          background: rgba(28, 33, 52, 0.6) !important;
          border-color: rgba(168, 143, 106, 0.3) !important;
          border-radius: 8px !important;
          height: 32px !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          display: flex;
          align-items: center;
        }
        
        .tag-select .ant-select-selection-placeholder {
          color: rgba(230, 214, 188, 0.5) !important;
        }
        
        .tag-select .ant-select-selection-item {
          color: ${textColor} !important;
        }
        
        /* 下拉菜单样式 */
        .tag-dropdown {
          background: rgba(28, 33, 52, 0.9) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(168, 143, 106, 0.3);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }
        
        .tag-dropdown .ant-select-item {
          color: ${textColor} !important;
          transition: all 0.3s ease;
          padding: 8px 12px;
        }
        
        .tag-dropdown .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
          background: rgba(168, 143, 106, 0.1) !important;
        }
        
        .tag-dropdown .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
          background: rgba(168, 143, 106, 0.2) !important;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};

export default DesktopView; 