// SpinWheel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button, message } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import { useDeviceDetect } from '../../utils/deviceDetector';

// 主题颜色和渐变定义
const themeColor = '#a88f6a';
const secondaryColor = '#352a46';  // 深紫色
const highlightColor = '#e3bb4d';  // 亮黄色
const themeGradient = 'linear-gradient(135deg, #a88f6a 0%, #917752 100%)';
const secondaryGradient = 'linear-gradient(135deg, #352a46 0%, #261e36 100%)';
const bgColor = '#1c2134';
const textColor = '#e6d6bc';

// 调色板 - 酒馆主题
const palette = [
  '#a88f6a', // 琥珀色
  '#917752', // 深琥珀色
  '#e3bb4d', // 亮黄色
  '#352a46', // 深紫色
  '#261e36', // 暗紫色
  '#1c2134', // 深蓝色
  '#e6d6bc', // 浅米色
  '#4a3f62', // 中紫色
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
      
      // 根据背景色调整文字颜色
      const bgColor = palette[i % palette.length];
      const isDarkBg = ['#352a46', '#261e36', '#1c2134', '#4a3f62'].includes(bgColor);
      
      // 文字颜色：深色背景用亮黄色，浅色背景用白色
      ctx.fillStyle = isDarkBg ? highlightColor : '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 添加文字描边，增强可见度
      ctx.strokeStyle = isDarkBg ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeText(seg.name, 0, 0);
      ctx.fillText(seg.name, 0, 0);
      
      // 添加文字阴影效果
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
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
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button
          type="primary"
          size="large"
          onClick={handleSpin}
          disabled={isSpinningRef.current}
          icon={<GiftOutlined />}
          style={{ 
            background: themeGradient,
            border: 'none',
            height: '46px',
            width: isMobile ? '80%' : '180px',
            fontSize: '16px',
            borderRadius: '8px',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
          }}
        >
          {isSpinningRef.current ? '抽奖中...' : '开始抽奖'}
        </Button>
      </div>
      
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
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
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
            box-shadow: 0 8px 24px rgba(168, 143, 106, 0.3);
          }
          to {
            box-shadow: 0 8px 36px rgba(227, 187, 77, 0.5);
          }
        }
      `}</style>
    </div>
  );
}

export default SpinWheel;
