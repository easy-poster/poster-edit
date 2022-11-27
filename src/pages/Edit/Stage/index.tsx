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
import { useDispatch, useModel, useSelector } from '@umijs/max';
import { db, epProject } from '@/utils/db';
import { ItemType } from '@/const';
import tools from '@/utils/tools';
import { fabric } from 'fabric';
import Canvas from './canvas/Canvas';

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

    return <Canvas projectInfo={projectState} />;
};

export default Stage;
