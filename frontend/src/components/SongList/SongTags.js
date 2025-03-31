// SongTags.js - 歌曲标签组件
import React from 'react';
import { Tag, Tooltip } from 'antd';
import { TagOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { themeColor, secondaryColor, highlightColor, textColor } from './constants';

// 渲染单个歌曲的标签
const SongTags = ({ tags, selectedTags, setSelectedTags }) => {
  if (!tags) return null;
  
  const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
  
  // 颜色配置
  const getTagStyle = (index) => {
    const styles = [
      {
        background: 'rgba(168, 143, 106, 0.15)',
        borderColor: 'rgba(168, 143, 106, 0.5)',
        color: textColor
      },
      {
        background: 'rgba(53, 42, 70, 0.2)',
        borderColor: 'rgba(53, 42, 70, 0.5)',
        color: textColor
      },
      {
        background: 'rgba(227, 187, 77, 0.15)',
        borderColor: 'rgba(227, 187, 77, 0.4)',
        color: '#261e36'
      },
    ];
    
    return styles[index % styles.length];
  };
  
  // 点击标签的处理函数
  const handleTagClick = (tag) => {
    if (setSelectedTags && !selectedTags?.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  return (
    <div style={{ 
      marginTop: '8px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px'
    }}>
      {tagArray.map((tag, index) => {
        const isSelected = selectedTags?.includes(tag);
        const style = getTagStyle(index);
        
        return (
          <Tooltip 
            key={tag} 
            title={isSelected ? "已选择" : (setSelectedTags ? "点击筛选" : "")}
            color={secondaryColor}
            placement="top"
          >
            <Tag 
              icon={
                index % 2 === 0 ? 
                <TagOutlined style={{ fontSize: '10px' }} /> : 
                <CustomerServiceOutlined style={{ fontSize: '10px' }} />
              }
              style={{ 
                ...style,
                marginBottom: '2px',
                marginRight: '0',
                borderRadius: '12px',
                padding: '2px 10px',
                fontSize: '12px',
                cursor: setSelectedTags ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                border: isSelected ? `1px solid ${highlightColor}` : `1px solid ${style.borderColor}`,
                boxShadow: isSelected ? `0 0 8px ${highlightColor}66` : 'none',
                opacity: isSelected ? 1 : 0.85,
              }}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Tag>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default SongTags; 