// Intro.js
import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

function Intro() {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2}>9872星球的故事</Title>
        <Paragraph>
          欢迎来到 9872星球，这里流传着许多神秘而有趣的传说。据说这里的居民
          喜欢用音乐和故事来表达情感。每到黄昏时分，天空会闪耀七彩流光……
        </Paragraph>
        <Paragraph>
          （TODO：此处要写点什么）
        </Paragraph>
      </Card>
    </div>
  );
}

export default Intro;
