import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { useSize } from 'ahooks';
import { useModel } from 'umi';
import { initApp } from '@/app';
import './index.less';

export default function IndexPage() {
  const pixiRef = useRef<HTMLDivElement>(null);
  const size = useSize(pixiRef);
  const { initialState, loading, error, refresh, setInitialState } =
    useModel('@@initialState');

  // 初始化
  useEffect(() => {
    let type = 'WebGL';
    if (!PIXI.utils.isWebGLSupported()) {
      type = 'canvas';
    }
    PIXI.utils.sayHello(type);

    // 初始化舞台
    let app = initStage();
    if (app) {
      setInitialState({
        app,
      });
    }
    return () => {};
  }, []);

  const initStage = () => {
    let stageDom = document.getElementById('pixiId');
    let width = stageDom?.clientWidth;
    let height = stageDom?.clientHeight;
    let app;
    if (!app) {
      app = new PIXI.Application({
        width: width,
        height: height,
        antialias: true,
        resolution: 1, // window.devicePixelRatio,
        backgroundAlpha: 1,
        backgroundColor: 0x1d9ce0,
      });
    }
    if (!stageDom?.innerHTML) {
      stageDom?.appendChild(app.view);
    }
    return app;
  };

  useEffect(() => {
    let app = initialState?.app;
    if (app && size.width && size.height) {
      console.log(app);
      app.renderer.autoResize = true;
      app.renderer.resize(size.width, size.height);
    }

    return () => {};
  }, [size]);

  return (
    <div className="home">
      <h1 className="title">Page index</h1>
      <div className="pixi" ref={pixiRef} id="pixiId"></div>
    </div>
  );
}
