import React, { useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import _ from 'lodash';
import { defaults } from './const';
import Handler, { Callback } from './handlers/Handler';
import { epProject } from '@/utils/db';
import { MAX_SIZE, MIN_SIZE } from '@/const';
import styles from './index.less';
import './styles/contextmenu.less';

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

export type CanvasProps = Partial<Callback> & {
    projectInfo: epProject;
};

const Canvas = React.memo((props: CanvasProps) => {
    const { projectInfo, ...other } = props;

    console.log(
        'canvas',
        projectInfo,
        JSON.parse(projectInfo?.content || '[]'),
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLCanvasElement>(null);

    const initFabric = useCallback(() => {
        if (
            !stageRef?.current ||
            !containerRef?.current ||
            _.isEmpty(projectInfo) ||
            _.isEmpty(projectInfo.uuid)
        )
            return;

        // 初始化Fabric画布对象
        const fabricCanvas = new fabric.Canvas(stageRef.current);

        const canvasOption = {
            ...defaults.canvasOption,
        };

        window.handler = new Handler({
            id: projectInfo.uuid,
            editable: true,
            canvas: fabricCanvas,
            container: containerRef.current,
            canvasOption: canvasOption,
            objectOption: objectOption,
            propertiesToInclude: defaults.propertiesToInclude,
            keyEvent: {
                transaction: true,
            },
            interactionMode: 'selection',
            workareaOption: {
                ...defaults.workareaOption,
                ...{
                    name: projectInfo.title,
                    fill: projectInfo.background || '#FFF',
                    width: projectInfo.width,
                    height: projectInfo.height,
                    content: projectInfo.content,
                },
            },
            minZoom: MIN_SIZE,
            maxZoom: MAX_SIZE,
            zoomEnabled: true,
            ...other,
        });
    }, [projectInfo]);

    // 初始化
    useEffect(() => {
        initFabric();
        return () => {
            if (window.handler) {
                window.handler.destroy();
                window.handler = null;
            }
        };
    }, []);

    return (
        <div className={styles.stageWrap} ref={containerRef}>
            <canvas ref={stageRef}></canvas>
        </div>
    );
});

export default Canvas;
