// LotteryResult.jsx
import React from 'react';

function LotteryResult({ result }) {
  return (
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
  );
}

export default LotteryResult;
