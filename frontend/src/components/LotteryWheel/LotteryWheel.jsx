// LotteryWheel.jsx
import React, { useState, useEffect } from 'react';
import { Button, Space, message } from 'antd';
import { defaultPrizes } from './constants';
import PrizesTable from './PrizesTable';
import SpinWheel from './SpinWheel';
import LotteryResult from './LotteryResult';

function LotteryWheel({ isLoggedIn }) {
  // ============================
  // 1) 管理奖品列表
  // ============================
  const [prizes, setPrizes] = useState(defaultPrizes);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/user/prizes', {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error('无法获取用户奖品数据');
          return res.json();
        })
        .then((data) => {
          setPrizes(data);
        })
        .catch((err) => {
          console.error('拉取奖品失败:', err);
          message.error('拉取用户奖品信息失败，使用默认奖品');
          setPrizes(defaultPrizes);
        });
    } else {
      // 未登录直接使用默认
      setPrizes(defaultPrizes);
    }
  }, [isLoggedIn]);

  // 手动保存到后端
  const handleSavePrizes = () => {
    if (!isLoggedIn) {
      message.warning('请先登录后再保存奖品');
      return;
    }
    fetch('/api/user/prizes', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prizes),
    })
      .then((res) => {
        if (!res.ok) throw new Error('保存奖品信息失败');
        return res.json();
      })
      .then(() => {
        message.success('奖品信息已成功保存到后端');
      })
      .catch((err) => {
        console.error(err);
        message.error('保存奖品信息出错');
      });
  };

  // ============================
  // 2) 增加新奖品
  // ============================
  const handleAddPrize = () => {
    setPrizes((prev) => [
      ...prev,
      {
        name: '新奖品',
        probability: 0.0,
        image: '',
      },
    ]);
  };

  // ============================
  // 3) 存放抽奖结果
  // ============================
  const [result, setResult] = useState({ name: '', image: '' });

  // ============================
  // 4) 页面渲染
  // ============================
  return (
    <div style={{ padding: 20 }}>
      <h2>抽奖转盘</h2>

      <Space style={{ marginBottom: 10 }}>
        <Button type="primary" onClick={handleAddPrize}>
          添加奖品
        </Button>
        {isLoggedIn && (
          <Button onClick={handleSavePrizes}>
            保存奖品
          </Button>
        )}
      </Space>

      {/* 奖品表格 */}
      <PrizesTable prizes={prizes} setPrizes={setPrizes} />

      {/* 转盘 + 抽奖结果并排 */}
      <div style={{ display: 'flex', gap: 40, marginTop: 20 }}>
        <SpinWheel prizes={prizes} result={result} setResult={setResult} />
        <LotteryResult result={result} />
      </div>
    </div>
  );
}

export default LotteryWheel;
