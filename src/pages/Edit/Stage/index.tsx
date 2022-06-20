import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import * as PIXI from 'pixi.js';
import demoImg from '@/assets/bg/demo.jpg';
import { useReactive, useSetState, useSize } from 'ahooks';
import { useDispatch, useModel, useSelector } from 'umi';
import { Application } from '@pixi/app';
import './index.less';
import { db, epProject } from '@/utils/db';
import PixiApp, { PixiAppProps } from '@/utils/pixiApp';
import { ItemType } from '@/const';
import tools from '@/utils/tools';
import { drawRect, drawCircle } from './zoomComponent';

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
  const dispatch = useDispatch();

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
          // 精灵监听回调(要在初始化舞台前执行)
          appCallback();
          initStage(mergeProject).then(() => {
            console.log('初始化stage完成-->');
            window.app.start();
          });
        });
      }
    } catch (error) {
      console.log('initProject error', error);
    }
  };

  const isMouseDown = useRef(false);
  const mouse = useReactive({
    mouseOffsetX: 0,
    mouseOffsetY: 0,
  });

  const appCallback = () => {
    PixiApp.setCallback('parseItem', (item, sprite) => {
      if (window?.app?.stage) {
        const CUT = 10;
        const PADDIND = 40;
        const GUIDE = 'GUIDE';

        let GuideContainer = window.app.stage.children.find(
          (it) => it?.id === GUIDE,
        );
        let ContaineARR = window?.app?.stage?.children || [];
        for (let i = ContaineARR.length - 1; i > 0; i--) {
          if (ContaineARR[i]?.id === GUIDE) {
            GuideContainer = ContaineARR[i];
          }
        }
        if (!GuideContainer) {
          GuideContainer = new PIXI.Container();
          window.app.stage.addChild(GuideContainer);
        }

        // 清除辅助线
        GuideContainer?.removeChildren();

        let GuideWidth = window.app.renderer.width;
        let GuideHeight = window.app.renderer.height;

        GuideContainer.id = GUIDE;
        GuideContainer.type = GUIDE;
        GuideContainer.zIndex = 1000000;
        GuideContainer.width = GuideWidth;
        GuideContainer.height = GuideHeight;

        const GuideHArr = [
          0,
          PADDIND,
          GuideHeight / 2,
          GuideHeight - PADDIND,
          GuideHeight,
        ];
        const GuideVArr = [
          0,
          PADDIND,
          GuideWidth / 2,
          GuideWidth - PADDIND,
          GuideWidth,
        ];

        // 横线
        GuideHArr.forEach((item, index) => {
          const GuideHline = new PIXI.Graphics();
          GuideHline.id = `${index + 1}GUIDE_X`;
          GuideHline.visible = false;
          GuideHline.zIndex = 1000000;
          GuideHline.lineStyle(4, 0xffbb00, 1);
          GuideHline.moveTo(0, item);
          let tick = true;
          for (let i = 0; i < GuideWidth; i = i + CUT) {
            if (tick) {
              GuideHline.lineTo(i, item);
              tick = false;
            } else {
              GuideHline.moveTo(i, item);
              tick = true;
            }
          }
          GuideContainer.addChild(GuideHline);
        });

        // 竖线
        GuideVArr.forEach((item, index) => {
          const GuideVline = new PIXI.Graphics();
          GuideVline.id = `${index + 1}GUIDE_Y`;
          GuideVline.visible = false;
          GuideVline.zIndex = 1000000;
          GuideVline.lineStyle(4, 0xffbb00, 1);
          GuideVline.moveTo(item, 0);
          let tick = false;
          for (let i = 0; i < GuideHeight; i = i + CUT) {
            if (tick) {
              GuideVline.moveTo(item, i);
              tick = false;
            } else {
              GuideVline.lineTo(item, i);
              tick = true;
            }
          }
          GuideContainer.addChild(GuideVline);
        });
      }

      sprite.on('pointerdown', spriteMousedown.bind(this, sprite));
      // .on('pointerup', spriteMouseup.bind(this, item, sprite))
      // .on('pointerupoutside', spriteMouseup.bind(this, item, sprite))
      // .on('pointermove', spriteMousemove.bind(this, item, sprite));
    });
  };
  const spriteMousedown = (sprite, event) => {
    sprite.data = event.data;
    sprite.dragging = true;
    isMouseDown.current = true;
    mouse.mouseOffsetX = event.data.global.x - sprite.x;
    mouse.mouseOffsetY = event.data.global.y - sprite.y;

    createSizeRect(sprite);
  };

  const createSizeRect = (sprite) => {
    const ContType = 'sizeContainer';
    let sizeContainer = window.app.stage.children.find((item) => {
      return item.type === ContType;
    });
    if (!sizeContainer) {
      sizeContainer = new PIXI.Container();
      sizeContainer.type = ContType;
      sizeContainer.zIndex = 100000;
    }
    sizeContainer?.removeChildren();

    drawRect(sizeContainer, sprite, () => {});

    drawCircle(sizeContainer, sprite, () => {});

    window.app.stage.addChild(sizeContainer);
  };

  const spriteMouseup = (item, sprite) => {
    // 将交互数据设置为null
    sprite.data = null;
    sprite.dragging = false;
    isMouseDown.current = false;
    let newLayer = JSON.parse(JSON.stringify(item));
    newLayer.left = Math.ceil(sprite.x);
    newLayer.top = Math.ceil(sprite.y);
    // 保存精灵属性
    dispatch({
      type: 'project/updateLayer',
      payload: {
        newLayer,
      },
    });
  };

  const spriteMousemove = (item, sprite, event) => {
    if (isMouseDown.current) {
      let viewWidth = projectState.width || 1920;
      let viewHeight = projectState.height || 1080;
      let curMouseX = event.data.global.x;
      let curMouseY = event.data.global.y;
      if (
        curMouseX / 1 > 0 &&
        curMouseX / 1 < viewWidth &&
        curMouseY / 1 > 0 &&
        curMouseY / 1 < viewHeight
      ) {
        if (sprite.dragging) {
          const newPosition = sprite.data.getLocalPosition(sprite.parent);
          sprite.x = newPosition.x - mouse.mouseOffsetX; //mousePos.left;
          sprite.y = newPosition.y - mouse.mouseOffsetY;
        }
      }
    }
  };

  const initStage = (prj) => {
    return new Promise<void>((resolve, reject) => {
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
    return () => {};
  }, [projectState]);

  return (
    <div className="stage-wrap" ref={scrollDivRef}>
      <div className="stage" id="stage" ref={stageRef}></div>
    </div>
  );
};

export default Stage;
