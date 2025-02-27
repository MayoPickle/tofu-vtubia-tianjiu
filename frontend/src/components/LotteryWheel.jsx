import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, InputNumber, Button, Space, message, Popconfirm } from 'antd';

function LotteryWheel({ isLoggedIn }) {
  // 1) 默认奖品 (未登录时使用)
  const defaultPrizes = [
    { name: '默认一等奖', probability: 0.2, image: 'https://via.placeholder.com/300?text=默认一等奖' },
    { name: '默认二等奖', probability: 0.3, image: 'https://via.placeholder.com/300?text=默认二等奖' },
    { name: '默认三等奖', probability: 0.5, image: 'https://via.placeholder.com/300?text=默认三等奖' },
  ];

  // 当前可编辑的奖品列表
  const [prizes, setPrizes] = useState(defaultPrizes);

  // 2) 若已登录，则在组件挂载时拉取后端奖品
  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/user/prizes', {
        method: 'GET',
        credentials: 'include', // 携带 session
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
      // 未登录时，使用默认奖品
      setPrizes(defaultPrizes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // 3) 手动保存到后端
  const handleSavePrizes = () => {
    // 如果未登录，这个按钮根本就不会显示，这里可以做个保险提示或直接return
    if (!isLoggedIn) {
      message.warning('请先登录后再保存奖品');
      return;
    }

    // 已登录 => 发 POST
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

  // =========== 抽奖转盘逻辑，与原示例相同 ===========

  const [rotationAngle, setRotationAngle] = useState(0); 
  const [result, setResult] = useState({ name: '', image: '' });
  const isSpinningRef = useRef(false);
  const animationIdRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    drawWheel(rotationAngle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prizes, rotationAngle]);

  const drawWheel = (angleOffset) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, width, height);

    const totalProbability = prizes.reduce((acc, cur) => acc + cur.probability, 0);
    const loseProbability = totalProbability < 1 ? 1 - totalProbability : 0;
    const segments = calcSegments(prizes, loseProbability);

    segments.forEach((seg, index) => {
      const startAngle = seg.startAngle + angleOffset;
      const endAngle = seg.endAngle + angleOffset;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = randomColor(index);
      ctx.fill();

      const midAngle = (startAngle + endAngle) / 2;
      const textX = centerX + Math.cos(midAngle) * radius * 0.65;
      const textY = centerY + Math.sin(midAngle) * radius * 0.65;
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '14px sans-serif';
      ctx.fillText(seg.name, textX, textY);
    });

    // 指针
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY - radius - 10);
    ctx.lineTo(centerX + 10, centerY - radius - 10);
    ctx.lineTo(centerX, centerY - radius + 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const calcSegments = (prizeList, loseProb) => {
    let segments = [...prizeList];
    if (loseProb > 0) {
      segments.push({ name: '未中奖', probability: loseProb, image: '' });
    }
    let currentAngle = 0;
    return segments.map((seg) => {
      const angleSize = seg.probability * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = startAngle + angleSize;
      currentAngle = endAngle;
      return { ...seg, startAngle, endAngle };
    });
  };

  const randomColor = (index) => {
    const colors = [
      '#FFD54F', '#4FC3F7', '#AED581',
      '#BA68C8', '#FF8A65', '#90A4AE',
      '#F06292', '#FFF176',
    ];
    return colors[index % colors.length];
  };

  const handleSpin = () => {
    if (isSpinningRef.current) {
      message.warning('正在抽奖，请勿重复点击');
      return;
    }
    const chosen = getRandomPrize();
    const targetAngle = calcTargetAngle(chosen);
    setResult({ name: '', image: '' });
    isSpinningRef.current = true;

    animateSpinTo(targetAngle, () => {
      isSpinningRef.current = false;
      setResult(chosen);
      if (chosen.name === '未中奖') {
        message.info('很遗憾，未中奖，下次再试试吧~');
      } else {
        message.success(`恭喜抽中了：${chosen.name}`);
      }
    });
  };

  const getRandomPrize = () => {
    const totalProb = prizes.reduce((a, b) => a + b.probability, 0);
    const rand = Math.random();
    let cumulative = 0;
    for (let p of prizes) {
      cumulative += p.probability;
      if (rand < cumulative) {
        return p;
      }
    }
    return { name: '未中奖', probability: 0, image: '' };
  };

  function calcTargetAngle(chosenPrize) {
    // 先算总概率，以及不中奖概率
    let totalProbability = prizes.reduce((acc, cur) => acc + cur.probability, 0);
    const loseProbability = totalProbability < 1 ? 1 - totalProbability : 0;
    const segments = calcSegments(prizes, loseProbability);
  
    // 找到当前中奖奖品所在扇区
    const seg = segments.find((s) => s.name === chosenPrize.name);
    if (!seg) {
      // 理论上不会走到这里
      return rotationAngle;
    }
  
    // 1) 扇区中点(弧度)
    const segmentMid = (seg.startAngle + seg.endAngle) / 2;
  
    // 2) 当前角度(只需关心 0~2π)
    const current = rotationAngle % (2 * Math.PI);
  
    // 3) 需要多转2~3圈
    const randomExtraTurns = 2 + Math.floor(Math.random() * 2);
    const fullTurns = randomExtraTurns * 2 * Math.PI;
  
    // 4) 计算从 current 转到 segmentMid 的差值
    let delta = segmentMid - current;
    if (delta < 0) {
      delta += 2 * Math.PI;
    }
  
    // 5) 由于指针在顶端，需要额外偏移 -Math.PI/2
    const pointerOffset = -Math.PI / 2;
  
    // 6) 得出最终旋转角度
    const finalAngle = rotationAngle + fullTurns + delta + pointerOffset;
  
    return finalAngle;
  }

  const animateSpinTo = (targetAngle, onFinish) => {
    const startAngle = rotationAngle;
    const startTime = performance.now();
    const duration = 3000; 

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = elapsed / duration;
      if (progress >= 1) {
        setRotationAngle(targetAngle);
        onFinish && onFinish();
      } else {
        const eased = easeOutCubic(progress);
        const current = startAngle + (targetAngle - startAngle) * eased;
        setRotationAngle(current);
        animationIdRef.current = requestAnimationFrame(animate);
      }
    };
    animationIdRef.current = requestAnimationFrame(animate);
  };

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  // antd Table
  const columns = [
    {
      title: '奖品名称',
      dataIndex: 'name',
      render: (text, record, idx) => (
        <Input
          value={text}
          onChange={(e) => {
            const newPrizes = [...prizes];
            newPrizes[idx].name = e.target.value;
            setPrizes(newPrizes);
          }}
        />
      ),
    },
    {
      title: '概率(0~1)',
      dataIndex: 'probability',
      render: (val, record, idx) => (
        <InputNumber
          min={0}
          max={1}
          step={0.01}
          value={val}
          onChange={(value) => {
            const newPrizes = [...prizes];
            newPrizes[idx].probability = value || 0;
            setPrizes(newPrizes);
          }}
        />
      ),
    },
    {
      title: '图片链接',
      dataIndex: 'image',
      render: (val, record, idx) => (
        <Input
          value={val}
          onChange={(e) => {
            const newPrizes = [...prizes];
            newPrizes[idx].image = e.target.value;
            setPrizes(newPrizes);
          }}
        />
      ),
    },
    {
      title: '操作',
      render: (val, record, idx) => (
        <Space>
          <Popconfirm
            title="确认删除该奖品？"
            onConfirm={() => {
              const newList = [...prizes];
              newList.splice(idx, 1);
              setPrizes(newList);
            }}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAddPrize = () => {
    setPrizes((prev) => [
      ...prev,
      {
        name: '新奖品',
        probability: 0.0,
        image: 'https://via.placeholder.com/300?text=新奖品',
      },
    ]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>抽奖转盘（带旋转动画，手动保存）</h2>

      {/* 操作按钮：仅在已登录时显示“保存奖品”；添加奖品按钮始终可见（也可自行隐藏） */}
      <Space style={{ marginBottom: 10 }}>
        <Button type="primary" onClick={handleAddPrize}>
          添加奖品
        </Button>

        {/* 如果你也想隐藏“添加奖品”，可以加 isLoggedIn 判断 */}
        {isLoggedIn && (
          <Button onClick={handleSavePrizes}>
            保存奖品
          </Button>
        )}
      </Space>

      {/* 奖品编辑表格 */}
      <Table
        dataSource={prizes}
        columns={columns}
        pagination={false}
        rowKey={(item, idx) => idx}
        style={{ marginBottom: 20 }}
      />

      {/* 抽奖按钮 */}
      <div style={{ marginBottom: 10 }}>
        <Button type="primary" onClick={handleSpin}>
          开始抽奖
        </Button>
      </div>

      {/* 转盘与结果 */}
      <div style={{ display: 'flex', gap: 40 }}>
        <div>
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            style={{ border: '1px dashed #ccc', borderRadius: '50%' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h3>中奖结果：{result.name || '-'}</h3>
          {result.image ? (
            <img
              src={result.image}
              alt={result.name}
              style={{ maxWidth: '300px', border: '1px solid #ccc' }}
            />
          ) : (
            <div style={{ color: '#999' }}>暂无奖品图片</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LotteryWheel;
