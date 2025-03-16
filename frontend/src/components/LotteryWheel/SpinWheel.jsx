// SpinWheel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button, message } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import { useDeviceDetect } from '../../utils/deviceDetector';

// 主题颜色和渐变定义
const themeColor = '#FF85A2';
const themeGradient = 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)';

// 调色板 - 可爱的粉色系
const palette = [
  '#FFB6C1', // Light Pink
  '#FFD1DC', // Pastel Pink
  '#FFC0CB', // Pink
  '#FF69B4', // Hot Pink
  '#FFB7C5', // Cherry Blossom Pink
  '#FFA5B3', // Flamingo Pink
  '#FF85A2', // Rose Pink
  '#FFB3BA', // Baby Pink
];

function SpinWheel({ prizes, result, setResult }) {
  const canvasRef = useRef(null);
  const isSpinningRef = useRef(false);
  const animationIdRef = useRef(null);
  const { isMobile } = useDeviceDetect();

  // 当前转盘角度
  const [rotationAngle, setRotationAngle] = useState(0);

  // ===========================
  // 1) 绘制转盘
  // ===========================
  useEffect(() => {
    drawWheel(rotationAngle);
  }, [prizes, rotationAngle]);

  // 组件卸载时，如果有动画要清理
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
    const radius = Math.min(centerX, centerY) - 20; // 留出更多边距

    ctx.clearRect(0, 0, width, height);

    // 绘制外圈装饰
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2);
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 绘制装饰性圆点
    for (let i = 0; i < 24; i++) {
      const dotAngle = (i * Math.PI * 2) / 24;
      const dotX = centerX + (radius + 15) * Math.cos(dotAngle);
      const dotY = centerY + (radius + 15) * Math.sin(dotAngle);
      
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fillStyle = themeColor;
      ctx.fill();
    }
    ctx.restore();

    const segments = calcSegments(prizes);

    // 绘制扇形和文字
    segments.forEach((seg, i) => {
      const startAngle = seg.startAngle + angle;
      const endAngle = seg.endAngle + angle;

      // 绘制扇形
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = palette[i % palette.length];
      ctx.fill();
      
      // 添加扇形边框
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 绘制文字
      ctx.save();
      const mid = (startAngle + endAngle) / 2;
      const textRadius = radius * 0.65;
      const textX = centerX + Math.cos(mid) * textRadius;
      const textY = centerY + Math.sin(mid) * textRadius;
      
      ctx.translate(textX, textY);
      ctx.rotate(mid + Math.PI / 2);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(seg.name, 0, 0);
      
      // 添加文字阴影效果
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      ctx.restore();
    });

    // 绘制中心装饰
    ctx.save();
    // 外圈
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 内圈
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = themeColor;
    ctx.fill();
    ctx.restore();

    // 指针
    ctx.save();
    ctx.fillStyle = themeColor;
    ctx.beginPath();
    ctx.moveTo(centerX - 15, centerY - radius - 15);
    ctx.lineTo(centerX + 15, centerY - radius - 15);
    ctx.lineTo(centerX, centerY - radius + 5);
    ctx.closePath();
    ctx.fill();
    
    // 指针阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
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

  function randomColor(i) {
    const palette = [
      '#FFD54F', '#4FC3F7', '#AED581',
      '#BA68C8', '#FF8A65', '#90A4AE',
      '#F06292', '#FFF176',
    ];
    return palette[i % palette.length];
  }

  // ===========================
  // 2) 开始抽奖
  // ===========================
  const handleSpin = () => {
    if (isSpinningRef.current) {
      message.warning('正在抽奖，请勿重复点击');
      return;
    }
    const chosen = getRandomPrize();
    const finalAngle = calcTargetAngle(chosen);

    // 清空上一次结果
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
  };

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
    if (!seg) return rotationAngle;

    const midAngle = (seg.startAngle + seg.endAngle) / 2;
    const current = rotationAngle % (2 * Math.PI);

    // 至少转2圈 => 4π
    const revolve = 4 * Math.PI;
    let finalWanted = -Math.PI / 2 - midAngle;

    let neededDelta = finalWanted - current;
    // 保证结果在 0~2π 范围内
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

  // ===========================
  // 3) 渲染
  // ===========================
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      position: 'relative'
    }}>
      <Button 
        type="primary" 
        onClick={handleSpin} 
        icon={<GiftOutlined />}
        style={{ 
          marginBottom: isMobile ? 20 : 24,
          width: isMobile ? '100%' : '200px',
          height: isMobile ? '44px' : '40px',
          fontSize: isMobile ? '16px' : '15px',
          borderRadius: '20px',
          background: themeGradient,
          border: 'none',
          boxShadow: '0 4px 15px rgba(255, 133, 192, 0.3)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transform: isSpinningRef.current ? 'scale(0.98)' : 'scale(1)',
          opacity: isSpinningRef.current ? 0.8 : 1
        }}
        size="large"
        disabled={isSpinningRef.current}
      >
        {isSpinningRef.current ? '抽奖中...' : '开始抽奖'}
      </Button>
      
      <div style={{
        position: 'relative',
        width: 'fit-content',
        margin: '0 auto'
      }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{ 
            borderRadius: '50%',
            maxWidth: '100%',
            height: 'auto',
            boxShadow: '0 8px 24px rgba(255, 133, 162, 0.2)',
            transition: 'all 0.3s ease',
            transform: isSpinningRef.current ? 'scale(1.02)' : 'scale(1)',
            animation: isSpinningRef.current ? 'glow 1.5s ease-in-out infinite alternate' : 'none'
          }}
        />
      </div>

      {/* 添加CSS动画 */}
      <style jsx="true">{`
        @keyframes glow {
          from {
            box-shadow: 0 8px 24px rgba(255, 133, 162, 0.2);
          }
          to {
            box-shadow: 0 8px 36px rgba(255, 133, 162, 0.4);
          }
        }
      `}</style>
    </div>
  );
}

export default SpinWheel;
