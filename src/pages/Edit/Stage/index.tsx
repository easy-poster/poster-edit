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
import { useModel, useSelector } from 'umi';
import { Application } from '@pixi/app';
import './index.less';
import { db, epProject } from '@/utils/db';
import PixiApp, { PixiAppProps } from '@/utils/pixiApp';
import { ItemType } from '@/const';
declare global {
  interface Window {
    app: Application & PixiAppProps;
  }
}

interface StageProps {
  projectProps: epProject;
}

const Stage: React.FC = () => {
  const projectState = useSelector((state) => {
    return state.project.prj;
  });
  const layeres = useSelector((state) => {
    return state.project.layeres;
  });

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
      Object.keys(projectState).length !== 0 &&
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
              (domHeight * projectState?.width) / projectState?.height,
            ) + 'px';
        } else {
          window.app.renderer.view.style.width = Math.round(domWidth) + 'px';
          window.app.renderer.view.style.height =
            Math.round((domWidth / projectState.width) * projectState.height) +
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
  }, [stageWrapSize, projectState, sizeStage]);

  const initProject = async () => {
    // 获取路由参数
    try {
      if (Array.isArray(layeres)) {
        let tempResources = [];
        let promiseArr = [];
        layeres.forEach((it) => {
          switch (it.type) {
            case ItemType.IMAGE:
              let isExist = tempResources.find((resource) => {
                return (resource.alias = it.id);
              });
              if (!isExist && it.resourceId) {
                promiseArr.push(
                  new Promise<void>(async (resolve, reject) => {
                    if (it.from === 'resource') {
                      let resource = await db.epImage.get({
                        id: it.resourceId,
                      });
                      if (resource) {
                        tempResources.push({
                          alias: it.id,
                          source: URL.createObjectURL(resource?.blob),
                          options: { loadType: 2, xhrType: 'document' },
                        });
                      }
                      resolve();
                    } else {
                      tempResources.push({
                        alias: it.id,
                        source: it.src,
                        options: { loadType: 2, xhrType: 'document' },
                      });
                    }
                  }),
                );
              }
              break;
            default:
              break;
          }
        });

        Promise.all(promiseArr).then((result) => {
          let mergeProject = {};
          mergeProject = {
            ...projectState,
            ...{ resources: tempResources },
            layeres,
          };
          console.log('mergeProject', mergeProject);
          initStage(mergeProject).then(() => {
            console.log('初始化stage完成-->');
          });
        });
      }
    } catch (error) {
      console.log('initProject error', error);
    }
  };

  const initStage = (prj) => {
    return new Promise<void>((resolve, reject) => {
      console.log('projectProps', prj);
      const stageDOM = stageRef.current;
      const stageWrapDOM = scrollDivRef.current;
      if (stageWrapDOM && stageDOM) {
        if (stageDOM.innerHTML) {
          stageDOM.innerHTML = '';
        }
        window.app = new PixiApp(prj);
        // 初始化画布宽高
        let { domWidth, domHeight } = {
          domWidth: stageWrapDOM.offsetWidth - 120,
          domHeight: stageWrapDOM.offsetHeight - 120,
        };
        if (domWidth > domHeight) {
          window.app.renderer.view.style.height = Math.round(domHeight) + 'px';
          window.app.renderer.view.style.width =
            Math.round((domHeight * prj.width) / prj.height) + 'px';
        } else {
          window.app.renderer.view.style.width = Math.round(domWidth) + 'px';
          window.app.renderer.view.style.height =
            Math.round((domWidth / prj.width) * prj.height) + 'px';
        }
        stageDOM.appendChild(window.app.view);
        window.app.render();
      }
      resolve();
    });
  };

  useEffect(() => {
    if (Object.keys(projectState).length !== 0) {
      initProject();
    }
    return () => {
      // console.log('清除内存');
      // window.app = null;
    };
  }, [projectState]);

  return (
    <div className="stage-wrap" ref={scrollDivRef}>
      <div className="stage" id="stage" ref={stageRef}></div>
    </div>
  );
};

export default Stage;
