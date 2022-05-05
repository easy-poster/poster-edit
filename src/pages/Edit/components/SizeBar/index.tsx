import React, { useState } from 'react';
import { Slider, Tooltip } from 'antd';
import { IconFont } from '@/const';
import './index.less';
import { useModel } from 'umi';

const MAX_SIZE = 400;
const MIN_SIZE = 25;

const SizeBar = () => {
  const { sizeStage, setSizeStage } = useModel('sizeStage');
  const [isAutoSize, setIsAutoSize] = useState(false);

  const handleAutoSizeOver = () => {
    setIsAutoSize(true);
  };

  const handleChangeAutoSize = () => {
    // 自适应屏幕
    setSizeStage(200);
  };

  const handleChangeSize = (value: number) => {
    setSizeStage(value);
  };

  return (
    <div className="sizebar">
      <Slider
        tipFormatter={null}
        min={MIN_SIZE}
        max={MAX_SIZE}
        value={sizeStage}
        onChange={handleChangeSize}
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
          `${sizeStage}%`
        )}
      </span>
    </div>
  );
};

export default SizeBar;
