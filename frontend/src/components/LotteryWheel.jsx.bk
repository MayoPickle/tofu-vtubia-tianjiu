import React, { useState, useEffect, useRef } from 'react';
import {
  Table, Input, InputNumber, Button, Space,
  message, Popconfirm, Upload
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function LotteryWheel({ isLoggedIn }) {
  // =========================================
  // 1) 默认奖品 (未登录时使用) + 登录逻辑
  // =========================================
  const defaultPrizes = [
    { name: '默认一等奖', probability: 0.2, image: 'https://via.placeholder.com/300?text=默认一等奖' },
    { name: '默认二等奖', probability: 0.3, image: 'https://via.placeholder.com/300?text=默认二等奖' },
    { name: '默认三等奖', probability: 0.5, image: 'https://via.placeholder.com/300?text=默认三等奖' },
  ];

  // 当前可编辑的奖品列表
  const [prizes, setPrizes] = useState(defaultPrizes);

  // 如果已登录，挂载时从后端拉取奖品
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
      // 未登录，直接用默认
      setPrizes(defaultPrizes);
    }
  }, [isLoggedIn]);

  // 手动保存到后端 (数据库)
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

  // =========================================
  // 2) 转盘抽奖逻辑 (融合 StableLotteryWheel)
  // =========================================

  const [rotationAngle, setRotationAngle] = useState(0);
  const [result, setResult] = useState({ name: '', image: '' });
  const isSpinningRef = useRef(false);
  const animationIdRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    drawWheel(rotationAngle);
  }, [prizes, rotationAngle]);

  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  function drawWheel(angle) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, width, height);

    const segments = calcSegments(prizes);

    segments.forEach((seg, i) => {
      const startAngle = seg.startAngle + angle;
      const endAngle = seg.endAngle + angle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = randomColor(i);
      ctx.fill();

      // 扇区文字
      const mid = (startAngle + endAngle) / 2;
      const textX = centerX + Math.cos(mid) * radius * 0.65;
      const textY = centerY + Math.sin(mid) * radius * 0.65;
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '14px sans-serif';
      ctx.fillText(seg.name, textX, textY);
    });

    // 顶部指针
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY - radius - 10);
    ctx.lineTo(centerX + 10, centerY - radius - 10);
    ctx.lineTo(centerX, centerY - radius + 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function calcSegments(prizeList) {
    const total = prizeList.reduce((acc, p) => acc + p.probability, 0);
    const loseProb = total < 1 ? 1 - total : 0;
    let arr = [...prizeList];
    if (loseProb > 0) {
      arr.push({ name: '未中奖', probability: loseProb, image: '' });
    }

    let start = 0;
    return arr.map((item) => {
      const size = item.probability * 2 * Math.PI;
      const seg = {
        ...item,
        startAngle: start,
        endAngle: start + size,
      };
      start += size;
      return seg;
    });
  }

  function handleSpin() {
    if (isSpinningRef.current) {
      message.warning('正在抽奖，请勿重复点击');
      return;
    }
    const chosen = getRandomPrize();
    const finalAngle = calcTargetAngle(chosen);

    setResult({ name: '', image: '' });
    isSpinningRef.current = true;

    animateSpinTo(finalAngle, () => {
      isSpinningRef.current = false;
      setResult(chosen);
      if (chosen.name === '未中奖') {
        message.info('很遗憾，未中奖~');
      } else {
        message.success(`恭喜中到：${chosen.name}`);
      }
    });
  }

  function getRandomPrize() {
    const total = prizes.reduce((acc, p) => acc + p.probability, 0);
    const rand = Math.random();
    let sum = 0;
    for (const p of prizes) {
      sum += p.probability;
      if (rand < sum) return p;
    }
    // 没命中 => 未中奖
    return { name: '未中奖', probability: 0, image: '' };
  }

  function calcTargetAngle(chosenPrize) {
    const segs = calcSegments(prizes);
    const seg = segs.find((s) => s.name === chosenPrize.name);
    if (!seg) {
      return rotationAngle;
    }
    const midAngle = (seg.startAngle + seg.endAngle) / 2;
    const current = rotationAngle % (2 * Math.PI);

    // 至少转 2 圈 => 4π
    const revolve = 4 * Math.PI;
    let finalWanted = -Math.PI / 2 - midAngle;

    let neededDelta = finalWanted - current;
    neededDelta = ((neededDelta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    return rotationAngle + revolve + neededDelta;
  }

  function animateSpinTo(target, onFinish) {
    const startAngle = rotationAngle;
    const startTime = performance.now();
    const duration = 4000;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = elapsed / duration;
      if (progress >= 1) {
        setRotationAngle(target);
        onFinish && onFinish();
      } else {
        const eased = easeOutCubic(progress);
        const current = startAngle + (target - startAngle) * eased;
        setRotationAngle(current);
        animationIdRef.current = requestAnimationFrame(tick);
      }
    }
    animationIdRef.current = requestAnimationFrame(tick);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // ==================================
  // 4) 图片上传处理 (前端)
  // ==================================
  const handleImageUpload = (file, idx) => {
    // 1. 用 FormData 包装文件
    const formData = new FormData();
    formData.append('image', file);

    // 2. 调用后端上传接口
    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // 3. 更新 prizes[idx].image
          const newPrizes = [...prizes];
          newPrizes[idx].image = data.url; // 后端返回的图片地址
          setPrizes(newPrizes);
          message.success('图片上传成功');
        } else {
          message.error('图片上传失败');
        }
      })
      .catch((err) => {
        console.error('图片上传错误', err);
        message.error('网络异常，上传失败');
      });

    // 为了阻止 antd 默认的上传行为，返回 false
    return false;
  };

  // ==============================
  // 5) antd 表格
  // ==============================
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
      title: '图片',
      dataIndex: 'image',
      render: (val, record, idx) => (
        <Space>
          {/* 上传按钮 */}
          <Upload
            beforeUpload={(file) => handleImageUpload(file, idx)}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>上传</Button>
          </Upload>

          {/* 也可让用户手动写图片链接 */}
          <Input
            style={{ width: 200 }}
            value={val}
            placeholder="或在此粘贴图片链接"
            onChange={(e) => {
              const newPrizes = [...prizes];
              newPrizes[idx].image = e.target.value;
              setPrizes(newPrizes);
            }}
          />

          {/* 预览缩略图 */}
          {val ? (
            <img
              src={val}
              alt="奖品图片"
              style={{ width: 50, height: 50, objectFit: 'cover', border: '1px solid #ccc' }}
            />
          ) : (
            <div style={{ color: '#999' }}>暂无</div>
          )}
        </Space>
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
        image: '',
      },
    ]);
  };

  // 颜色
  function randomColor(i) {
    const palette = [
      '#FFD54F', '#4FC3F7', '#AED581',
      '#BA68C8', '#FF8A65', '#90A4AE',
      '#F06292', '#FFF176',
    ];
    return palette[i % palette.length];
  }

  // ==============================
  // 6) 渲染
  // ==============================
  return (
    <div style={{ padding: 20 }}>
      <h2>抽奖转盘（可上传图片 + 后端保存）</h2>

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

      {/* antd 表格 */}
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

      {/* 转盘区域 + 结果 */}
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
