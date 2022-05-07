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
import PixiApp from '@/utils/parse';
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

  const initStage = () => {
    return new Promise<void>((resolve, reject) => {
      console.log('projectProps', projectProps);
      const stageDOM = stageRef.current;
      const stageWrapDOM = scrollDivRef.current;
      if (stageWrapDOM && stageDOM) {
        if (stageDOM.innerHTML) {
          stageDOM.innerHTML = '';
        }
        window.app = new PixiApp(projectProps);
        stageDOM.appendChild(window.app.view);
        // 初始化画布宽高
        let { domWidth, domHeight } = {
          domWidth: stageWrapDOM.offsetWidth - 120,
          domHeight: stageWrapDOM.offsetHeight - 120,
        };
        if (domWidth > domHeight) {
          window.app.renderer.view.style.height = Math.round(domHeight) + 'px';
          window.app.renderer.view.style.width =
            Math.round((domHeight * projectProps.width) / projectProps.height) +
            'px';
        } else {
          window.app.renderer.view.style.width = Math.round(domWidth) + 'px';
          window.app.renderer.view.style.height =
            Math.round((domWidth / projectProps.width) * projectProps.height) +
            'px';
        }
        window.app.render();
      }
      resolve();
    });
  };

  useEffect(() => {
    if (Object.keys(projectProps).length !== 0) {
      initStage().then(() => {
        console.log('初始化stage完成-->');
      });
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
