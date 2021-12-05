import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { useSize } from 'ahooks';
import './index.less';

const Stage = () => {
  // 初始化舞台
  const stageRef = useRef<HTMLDivElement>(null);
  const stageSize = useSize(stageRef);
  useEffect(() => {
    const stageDOM = stageRef.current;
    if (stageDOM) {
      let options = {
        width: 1920, // default: 800 宽度
        height: 1080, // default: 600 高度
        antialias: true, // default: false 反锯齿
        transparent: false, // default: false 透明度
        backgroundColor: 0x000000,
      };
      if (!window.app && !stageDOM.innerHTML) {
        window.app = new PIXI.Application(options);
        stageDOM.appendChild(window.app.view);
      }
    }
    return () => {
      window.app = null;
    };
  }, []);

  return <div className="stage" id="stage" ref={stageRef}></div>;
};

export default Stage;
