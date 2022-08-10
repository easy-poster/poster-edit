import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { fabric } from 'fabric';
import { useSize } from 'ahooks';
import { defaults } from './const';
import styles from './index.less';
import Handler from './handlers/Handler';

const propertiesToInclude = [
  'id',
  'name',
  'locked',
  'file',
  'src',
  'link',
  'tooltip',
  'animation',
  'layout',
  'workareaWidth',
  'workareaHeight',
  'videoLoadType',
  'autoplay',
  'shadow',
  'muted',
  'loop',
  'code',
  'icon',
  'userProperty',
  'trigger',
  'configuration',
  'superType',
  'points',
  'svg',
  'loadType',
];

const objectOption: FabricObjectOption = {
  stroke: 'rgba(255, 255, 255, 0)',
  strokeUniform: true,
  resource: {},
  link: {
    enabled: false,
    type: 'resource',
    state: 'new',
    dashboard: {},
  },
  tooltip: {
    enabled: true,
    type: 'resource',
    template: '<div>{{message.name}}</div>',
  },
  animation: {
    type: 'none',
    loop: true,
    autoplay: true,
    duration: 1000,
  },
  userProperty: {},
  trigger: {
    enabled: false,
    type: 'alarm',
    script: 'return message.value > 0;',
    effect: 'style',
  },
};

export interface CanvasProps {
  projectInfo: any;
}

const Canvas = React.memo((props: CanvasProps) => {
  const { projectInfo } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerRef);
  const stageRef = useRef<HTMLCanvasElement>(null);
  const canvasObj = useRef<FabricCanvas | null>(null);
  const handlerObj = useRef<any>(null);

  useEffect(() => {
    initFabric();
  }, []);

  const initFabric = useCallback(() => {
    if (!stageRef?.current || !containerRef?.current) return;
    canvasObj.current = new fabric.Canvas(stageRef.current, {
      backgroundColor: '#000',
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });

    canvasObj.current.selectionColor = 'rgba(40, 144, 149, 0.269)';
    canvasObj.current.selectionBorderColor = '#209fa5';
    canvasObj.current.selectionLineWidth = 1;

    canvasObj.current.renderAll();

    const mergeCanvasOption = {
      ...defaults.canvasOption,
      ...{
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      },
    };

    handlerObj.current = new Handler({
      id: '1',
      editable: true,
      canvas: canvasObj.current,
      container: containerRef.current,
      canvasOption: mergeCanvasOption,
      objectOption: objectOption,
      propertiesToInclude: propertiesToInclude,
      keyEvent: {
        transaction: true,
      },
      interactionMode: 'selection',
      workareaOption: {
        ...defaults.workareaOption,
      },
      ...{
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
        minZoom: 30,
        maxZoom: 300,
        zoomEnabled: true,
      },
    });
  }, []);

  useEffect(() => {
    if (
      handlerObj.current &&
      containerRef.current &&
      containerSize?.width &&
      containerSize?.height
    ) {
      handlerObj.current.eventHandler.resize(
        containerSize?.width,
        containerSize?.height,
      );
    }
  }, [containerSize]);

  return (
    <div className={styles.stageWrap} ref={containerRef}>
      <canvas ref={stageRef}></canvas>
    </div>
  );
});

export default Canvas;
