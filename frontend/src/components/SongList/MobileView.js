// MobileView.js - 移动端视图组件
import React from 'react';
import { Input, Button, List, Card, Typography, Select, Space, Empty, Divider, Tag } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CustomerServiceOutlined, 
  CoffeeOutlined, 
  FireOutlined,
  HeartOutlined,
  CalendarOutlined,
  TagsOutlined
} from '@ant-design/icons';
import SongTags from './SongTags';
import { themeColor, bgColor, secondaryColor, highlightColor, textColor, themeGradient, secondaryGradient } from './constants';

const { Text, Paragraph, Title } = Typography;
const { Option } = Select;

const MobileView = ({ 
  songs, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  onSearch, 
  allTags, 
  selectedTags, 
  handleTagSelect, 
  isAdmin, 
  handleOpenAddModal, 
  handleOpenEditModal, 
  handleDeleteSong 
}) => {
  return (
    <div style={{ padding: '16px', paddingTop: '0' }}>
      <Card 
        style={{ 
          marginBottom: '20px',
          background: 'rgba(28, 33, 52, 0.7)',
          borderRadius: '8px',
          borderColor: 'rgba(168, 143, 106, 0.3)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ 
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
              style={{ 
                flex: 1,
                borderRadius: '8px',
                background: 'rgba(28, 33, 52, 0.6)',
                borderColor: 'rgba(168, 143, 106, 0.3)',
                color: textColor,
                height: '32px',
                display: 'flex',
                alignItems: 'center'
              }}
              allowClear
              className="search-input"
            />
            <Button 
              type="primary" 
              onClick={() => onSearch(searchTerm)}
              icon={<SearchOutlined />}
              style={{
                background: themeGradient,
                borderColor: 'rgba(168, 143, 106, 0.5)',
                borderRadius: '8px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              搜索
            </Button>
          </div>
          
          <div style={{ 
            position: 'relative',
            marginTop: '4px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              marginBottom: '6px'
            }}>
              <TagsOutlined style={{ color: highlightColor }} />
              <Text style={{ color: textColor, fontSize: '14px' }}>
                按标签筛选:
              </Text>
            </div>
            
            <Select
              mode="multiple"
              style={{ 
                width: '100%',
                borderRadius: '8px',
                height: '32px'
              }}
              placeholder="选择标签进行筛选"
              value={selectedTags}
              onChange={handleTagSelect}
              maxTagCount="responsive"
              options={allTags.map(tag => ({ label: tag, value: tag }))}
              showSearch
              optionFilterProp="label"
              className="tag-select"
              dropdownClassName="tag-dropdown"
              popupMatchSelectWidth={false}
              listHeight={250}
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
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginTop: '8px' 
            }}>
              {selectedTags.length > 0 && (
                <Button 
                  type="link" 
                  size="small"
                  onClick={() => handleTagSelect([])}
                  style={{
                    color: highlightColor,
                    padding: '4px 10px',
                    background: 'rgba(227, 187, 77, 0.1)',
                    borderRadius: '12px',
                    height: 'auto',
                    fontSize: '12px',
                    border: 'none'
                  }}
                >
                  清除已选标签
                </Button>
              )}
              
              {isAdmin && (
                <Button 
                  type="primary" 
                  onClick={handleOpenAddModal}
                  icon={<PlusOutlined />}
                  style={{
                    background: secondaryGradient,
                    borderColor: highlightColor,
                    borderRadius: '8px',
                    marginLeft: 'auto'
                  }}
                >
                  添加
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      <div style={{ position: 'relative' }}>
        {loading ? (
          <div style={{ 
            padding: '40px 0',
            textAlign: 'center',
            background: 'rgba(28, 33, 52, 0.6)',
            borderRadius: '8px',
            border: '1px solid rgba(168, 143, 106, 0.2)',
            marginBottom: '16px'
          }}>
            <div className="loader"></div>
            <Text style={{ display: 'block', marginTop: '16px', color: textColor }}>
              正在为您准备歌单...
            </Text>
          </div>
        ) : songs.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text style={{ color: textColor }}>
                暂无歌曲，或没有符合条件的歌曲
              </Text>
            }
            style={{
              padding: '40px 0',
              background: 'rgba(28, 33, 52, 0.6)',
              borderRadius: '8px',
              border: '1px solid rgba(168, 143, 106, 0.2)',
              color: textColor
            }}
          />
        ) : (
          <List
            dataSource={songs}
            renderItem={(item, index) => (
              <Card 
                key={item.id}
                style={{ 
                  marginBottom: '16px',
                  background: index % 2 === 0 ? 'rgba(28, 33, 52, 0.7)' : 'rgba(53, 42, 70, 0.6)',
                  borderRadius: '8px',
                  borderColor: index % 2 === 0 ? 'rgba(168, 143, 106, 0.3)' : 'rgba(227, 187, 77, 0.2)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  animation: `fadeIn 0.5s ease ${index * 0.1}s both`
                }}
                className="song-card"
                bodyStyle={{ padding: '16px' }}
                hoverable
              >
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '10px' 
                      }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: index % 2 === 0 ? 'rgba(168, 143, 106, 0.2)' : 'rgba(53, 42, 70, 0.5)',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                        }}>
                          <CoffeeOutlined style={{ 
                            color: highlightColor, 
                            fontSize: '18px',
                            animation: 'float 3s ease-in-out infinite',
                          }} />
                        </div>
                        <Title 
                          level={5}
                          style={{ 
                            margin: 0,
                            color: textColor,
                            fontSize: '18px',
                          }}
                          ellipsis={{ rows: 1 }}
                        >
                          {item.title}
                        </Title>
                      </div>
                      
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CustomerServiceOutlined style={{ color: themeColor }} />
                          <Text style={{ color: 'rgba(230, 214, 188, 0.9)' }} ellipsis>
                            {item.artist}
                          </Text>
                        </div>
                        
                        {item.album && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FireOutlined style={{ 
                              color: index % 2 === 0 ? highlightColor : themeColor 
                            }} />
                            <Text style={{ 
                              color: 'rgba(230, 214, 188, 0.8)',
                              fontSize: '13px'
                            }} ellipsis>
                              专辑: {item.album}
                            </Text>
                          </div>
                        )}
                        
                        {item.year && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CalendarOutlined style={{ color: themeColor }} />
                            <Text style={{ 
                              color: 'rgba(230, 214, 188, 0.7)',
                              fontSize: '13px' 
                            }}>
                              {item.year}
                            </Text>
                          </div>
                        )}
                      </Space>
                    </div>
                    
                    {item.link && (
                      <div style={{ marginLeft: '8px' }}>
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            color: textColor,
                            background: themeGradient,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s',
                            textDecoration: 'none',
                          }}
                          className="play-button"
                        >
                          <CustomerServiceOutlined style={{ fontSize: '20px' }} />
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {item.description && (
                    <div style={{ 
                      margin: '12px 0',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderLeft: `3px solid ${themeColor}` 
                    }}>
                      <Paragraph 
                        style={{ 
                          color: 'rgba(230, 214, 188, 0.8)',
                          margin: 0,
                          fontSize: '13px',
                          lineHeight: '1.6'
                        }}
                        ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}
                      >
                        {item.description}
                      </Paragraph>
                    </div>
                  )}
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '8px' 
                  }}>
                    <SongTags tags={item.tags} selectedTags={selectedTags} setSelectedTags={null} />
                    
                    {isAdmin && (
                      <Space>
                        <Button 
                          type="text" 
                          icon={<EditOutlined style={{ color: highlightColor }} />}
                          onClick={() => handleOpenEditModal(item)}
                          style={{
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            border: '1px solid rgba(168, 143, 106, 0.3)',
                            background: 'rgba(28, 33, 52, 0.6)'
                          }}
                        />
                        <Button 
                          type="text" 
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteSong(item.id)}
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
                      </Space>
                    )}
                  </div>
                </div>
              </Card>
            )}
          />
        )}
      </div>
      
      <style jsx="true">{`
        .song-card {
          overflow: hidden;
        }
        
        .song-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
        
        .play-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }
        
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
            transform: translateY(-3px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        .loader {
          border: 4px solid rgba(168, 143, 106, 0.2);
          border-left: 4px solid ${highlightColor};
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
        
        .search-input .ant-input-clear-icon {
          margin-top: -2px;
        }
      `}</style>
    </div>
  );
};

export default MobileView; 