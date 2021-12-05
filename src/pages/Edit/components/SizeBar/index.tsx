import React, { useState } from 'react';
import { Tooltip } from 'antd';
import { IconFont } from '@/const';
import './index.less';

const SizeBar = () => {
  const [size, setSize] = useState(25);
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
    } else {
      // 减
    }
  };

  return (
    <div className="sizebar">
      <IconFont
        type="icon-jian"
        style={{ fontSize: '28px' }}
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
        style={{ fontSize: '28px' }}
        onClick={() => handleChangeSize(true)}
      />
    </div>
  );
};

export default SizeBar;
