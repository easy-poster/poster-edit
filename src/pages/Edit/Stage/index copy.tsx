import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import demoImg from '@/assets/bg/demo.jpg';
import { useReactive, useSetState, useSize } from 'ahooks';
import { useDispatch, useModel, useSelector } from 'umi';
import './index.less';
import { db, epProject } from '@/utils/db';
import { ItemType } from '@/const';
import tools from '@/utils/tools';
import { fabric } from 'fabric';

// declare global {
//   interface Window {
//     app: Application & PixiAppProps;
//   }
// }

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
  const stageRef = useRef<HTMLCanvasElement>(null);
  // 画布大小缩放
  const scrollDivRef = useRef<HTMLDivElement>(null);
  const stageWrapSize = useSize(scrollDivRef);
  const canvasObj = useRef<any>(null);

  useEffect(() => {
    canvasObj.current = new fabric.Canvas(stageRef.current, {
      preserveObjectStacking: true,
      backgroundColor: '#000',
      stateful: true,
      uniScaleKey: '',
      selection: false,
    });

    canvasObj.current.controlsAboveOverlay = true;
    canvasObj.current.selection = false;
    canvasObj.current.renderAll();

    console.log('layeres', layeres);

    let rect = new fabric.Rect({
      top: 400,
      left: 300,
      width: 60,
      height: 70,
      fill: 'red',
    });
    let text = new fabric.IText('Hello World', {
      //绘制文本
      top: 100,
      left: 200,
      fontSize: 50,
      fill: '#FFF',
      originX: 'center',
      originY: 'center',
    });

    canvasObj.current.add(text);

    canvasObj.current.add(rect);

    // let group = new fabric.Group([rect, text], {
    //   left: 400,
    //   top: 100,
    //   angle: 10
    // })

    // canvasObj.current.add(group);

    const _a = async () => {
      let result = [];
      result = await db.epImage
        .where({
          userId: 1,
        })
        .reverse()
        .sortBy('updateTime');
      if (result.length > 0) {
        let demo1 = result[0];
        let imgUrl = tools.getWebUrl(demo1.blob || '');
        fabric.Image.fromURL(imgUrl, (oImg) => {
          console.log('img', oImg);
          canvasObj.current.add(oImg);
          console.log(
            'canvasObj.current',
            canvasObj.current,
            canvasObj.current.getObjects(),
          );

          // console.log(JSON.stringify(canvasObj.current.toJSON()));
        });
      }
    };

    _a();
  }, []);

  useEffect(() => {
    if (stageWrapSize?.width && stageWrapSize.height && canvasObj.current) {
      let resizeW = stageWrapSize?.width > 600 ? stageWrapSize?.width : 600;
      let resizeH =
        stageWrapSize?.height - 50 > 400 ? stageWrapSize?.height - 50 : 400;
      canvasObj.current.setWidth(resizeW);
      canvasObj.current.setHeight(resizeH);

      // Create the artboard
      let a_width = 800;
      let a_height = 600;
      let artboard = new fabric.Rect({
        left: canvasObj.current.get('width') / 2 - a_width / 2,
        top: canvasObj.current.get('height') / 2 - a_height / 2,
        width: a_width,
        height: a_height,
        absolutePositioned: true,
        fill: '#000',
        hasControls: true,
        typeThing: 'none',
        transparentCorners: false,
        borderColor: '#0E98FC',
        cornerColor: '#0E98FC',
        cursorWidth: 1,
        selectable: false,
        cursorDuration: 1,
        cursorDelay: 250,
        id: 'artboard',
      });
      canvasObj.current.renderAll();

      // Clip canvas to the artboard
      canvasObj.current.clipPath = artboard;
      canvasObj.current.renderAll();
    }

    return () => {};
  }, [stageWrapSize]);

  return (
    <div className="stage-wrap" ref={scrollDivRef}>
      <canvas ref={stageRef}></canvas>
    </div>
  );
};

export default Stage;
