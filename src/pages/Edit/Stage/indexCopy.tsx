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
import { useModel } from 'umi';
import { Application } from '@pixi/app';
import './index.less';
import { epProject } from '@/utils/db';
declare global {
  interface Window {
    app: Application;
  }
}

interface StageProps {
  projectProps: epProject;
}

const Stage: React.FC<StageProps> = ({ projectProps }) => {
  // 初始化舞台
  const stageRef = useRef<HTMLDivElement>(null);
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

  const stageWrapSize = useSize(scrollDivRef);
  const { sizeStage } = useModel('sizeStage');
  useEffect(() => {
    if (!window?.app) return;
    if (
      scrollDivRef?.current &&
      stageWrapSize &&
      sizeStage &&
      Object.keys(stageWrapSize).length !== 0 &&
      stageWrapSize?.width &&
      stageWrapSize?.height
    ) {
      let { domWidth, domHeight } = {
        domWidth: (stageWrapSize?.width * sizeStage) / 100 - 120,
        domHeight: (stageWrapSize?.height * sizeStage) / 100 - 120,
      };
      console.log(domWidth, domHeight);
      if (domWidth > 200 && domHeight > 200) {
        if (domWidth > domHeight) {
          window.app.renderer.view.style.height = Math.round(domHeight) + 'px';
          window.app.renderer.view.style.width =
            Math.round(
              (domHeight * projectProps?.width) / projectProps?.height,
            ) + 'px';
        } else {
          window.app.renderer.view.style.width = Math.round(domWidth) + 'px';
          window.app.renderer.view.style.height =
            Math.round((domWidth / projectProps.width) * projectProps.height) +
            'px';
        }
        scrollDivRef.current.scrollTop =
          (scrollDivRef.current.scrollHeight -
            scrollDivRef.current.offsetHeight) /
          2;
        scrollDivRef.current.scrollLeft =
          (scrollDivRef.current.scrollWidth -
            scrollDivRef.current.offsetWidth) /
          2;
      }
    }

    return () => {};
  }, [stageWrapSize, projectProps, sizeStage]);

  const initCanvas = () => {
    return new Promise<void>((resolve, reject) => {
      const stageDOM = stageRef.current;
      const stageWrapDOM = scrollDivRef.current;
      console.log('projectProps', projectProps);
      if (stageDOM && stageWrapDOM) {
        let options = {
          width: projectProps.width, // default: 800 宽度
          height: projectProps.height, // default: 600 高度
          antialias: true, // default: false 反锯齿
          transparent: false, // default: false 透明度
          resolution: window.devicePixelRatio,
          backgroundColor: '0xFF0000',
          autoDensity: true,
          autoStart: false,
        };
        debugger;
        if (!window.app && !stageDOM.innerHTML) {
          window.app = new PIXI.Application(options);
          let { domWidth, domHeight } = {
            domWidth: stageWrapDOM.offsetWidth - 120,
            domHeight: stageWrapDOM.offsetHeight - 120,
          };
          if (domWidth > domHeight) {
            window.app.renderer.view.style.height =
              Math.round(domHeight) + 'px';
            window.app.renderer.view.style.width =
              Math.round(
                (domHeight * projectProps.width) / projectProps.height,
              ) + 'px';
          } else {
            window.app.renderer.view.style.width = Math.round(domWidth) + 'px';
            window.app.renderer.view.style.height =
              Math.round(
                (domWidth / projectProps.width) * projectProps.height,
              ) + 'px';
          }
          var renderer = window.app.renderer;
          var loader = PIXI.Loader.shared;
          var ticker = PIXI.Ticker.shared;
          var resources = loader.resources;

          let texture = resources['demoImg']?.texture;
          stageDOM.appendChild(window.app.view);
          var raf;
          console.log('texture123', texture);

          if (!texture) {
            loader.add('demoImg', demoImg);
          }
          // loader.load(() => {
          //   var loader = PIXI.Loader.shared;
          //   var ticker = PIXI.Ticker.shared;
          //   ticker.maxFPS = 1;
          //   var resources = loader.resources;
          //   let texture = resources['demoImg']?.texture;
          //   if (texture) {
          //     const demoSprite = new PIXI.Sprite(texture);
          //     demoSprite.width = 1920;
          //     demoSprite.height = 1080;

          //     const container = new PIXI.Container();
          //     const blurFilter1 = new PIXI.filters.BlurFilter();
          //     demoSprite.filters = [blurFilter1];
          //     blurFilter1.blur = 1;
          //     let count = 1;
          //     // ticker.add(() => {
          //     //   count += 1;
          //     //   // const blurAmount = Math.cos(count);
          //     //   blurFilter1.blur = count;
          //     //   // console.log(blurFilter1.blur)
          //     // })
          //     // container.addChild(demoSprite);
          //     // window.app.stage.addChild(container);
          //   }
          // });
          window.app.render();
        }
      }
    });
  };

  useEffect(() => {
    if (Object.keys(projectProps).length !== 0) {
      initCanvas();
    }
    return () => {
      console.log('清除内存');
      window.app = null;
    };
  }, [projectProps]);

  return (
    <div className="stage-wrap" ref={scrollDivRef}>
      <div className="stage" id="stage" ref={stageRef}></div>
    </div>
  );
};

export default Stage;
