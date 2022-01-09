import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import * as PIXI from 'pixi.js';
import demoImg from '@/assets/bg/demo.jpg';
import { useSize } from 'ahooks';
import './index.less';

const Stage = () => {
  // 初始化舞台
  const stageRef = useRef<HTMLDivElement>(null);
  const stageSize = useSize(stageRef);

  const initCanvas = () => {
    return new Promise<void>((resolve, reject) => {
      const stageDOM = stageRef.current;
      if (stageDOM) {
        let options = {
          width: 4320, // default: 800 宽度
          height: 2580, // default: 600 高度
          antialias: true, // default: false 反锯齿
          transparent: false, // default: false 透明度
          backgroundColor: 0x000000,
          autoStart: false,
        };
        if (!window.app && !stageDOM.innerHTML) {
          window.app = new PIXI.Application(options);
          var renderer = app.renderer;
          var loader = PIXI.Loader.shared;
          var ticker = PIXI.Ticker.shared;
          var resources = loader.resources;
          let texture = resources['demoImg']?.texture;
          stageDOM.appendChild(window.app.view);
          var raf;
          console.log('texture', texture);
          if (!texture) {
            loader.add('demoImg', demoImg);
          }
          loader.load(() => {
            var loader = PIXI.Loader.shared;
            var ticker = PIXI.Ticker.shared;
            var resources = loader.resources;
            let texture = resources['demoImg']?.texture;
            if (texture) {
              const demoSprite = new PIXI.Sprite(texture);
              const container = new PIXI.Container();
              container.addChild(demoSprite);
              window.app.stage.addChild(container);
              window.app.render();
            }
          });
        }
      }
    });
  };

  useEffect(() => {
    initCanvas();
    return () => {
      console.log('清除内存');
      window.app = null;
    };
  }, []);

  // 画布大小缩放
  const scrollDivRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!scrollDivRef.current) {
      return;
    }
    // 居中展示
    scrollDivRef.current.scrollTop =
      (scrollDivRef.current.scrollHeight - scrollDivRef.current.offsetHeight) /
      2;
    scrollDivRef.current.scrollLeft =
      (scrollDivRef.current.scrollWidth - scrollDivRef.current.offsetWidth) / 2;

    return () => {};
  }, []);

  return (
    <div className="stage-wrap" ref={scrollDivRef}>
      <div className="stage" id="stage" ref={stageRef}></div>
    </div>
  );
};

export default Stage;
