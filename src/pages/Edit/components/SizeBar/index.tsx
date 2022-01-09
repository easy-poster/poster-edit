import React, { useState } from 'react';
import { Tooltip } from 'antd';
import { IconFont } from '@/const';
import './index.less';

const MAX_SIZE = 400;
const MIN_SIZE = 25;
const STEP = 25;

const SizeBar = () => {
  const [size, setSize] = useState(50);
  const [isAutoSize, setIsAutoSize] = useState(false);

  const handleAutoSizeOver = () => {
    setIsAutoSize(true);
  };

  const handleChangeAutoSize = () => {
    // 自适应屏幕
  };

  const handleChangeSize = (toAdd: boolean) => {
    if (toAdd) {
      // 加
      if (size >= MAX_SIZE) return;
      setSize(size + STEP);
    } else {
      // 减
      if (size <= MIN_SIZE) return;
      setSize(size - STEP);
    }
  };

  return (
    <div className="sizebar">
      <IconFont
        type="icon-jian"
        style={{
          fontSize: '28px',
          cursor: size <= MIN_SIZE ? 'not-allowed' : 'pointer',
        }}
        onClick={() => handleChangeSize(false)}
      />
      <span
        className="sizemid"
        onMouseOver={handleAutoSizeOver}
        onMouseLeave={() => setIsAutoSize(false)}
        onClick={handleChangeAutoSize}
      >
        {isAutoSize ? (
          <Tooltip
            title="适应屏幕"
            color="#1c1c26"
            overlayInnerStyle={{ borderRadius: '18px' }}
          >
            <IconFont type="icon-zishiying" style={{ fontSize: '28px' }} />
          </Tooltip>
        ) : (
          `${size}%`
        )}
      </span>
      <IconFont
        type="icon-tianjia_huaban"
        style={{
          fontSize: '28px',
          cursor: size >= MAX_SIZE ? 'not-allowed' : 'pointer',
        }}
        onClick={() => handleChangeSize(true)}
      />
    </div>
  );
};

export default SizeBar;
