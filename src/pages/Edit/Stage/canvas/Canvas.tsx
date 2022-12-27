import React, { useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useDebounce, useDebounceEffect, useSize } from 'ahooks';
import _ from 'lodash';
import { defaults } from './const';
import styles from './index.less';
import Handler from './handlers/Handler';
import { epProject } from '@/utils/db';

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
    projectInfo: epProject;
}

const Canvas = React.memo((props: CanvasProps) => {
    const { projectInfo } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const containerSize = useSize(containerRef);
    const stageRef = useRef<HTMLCanvasElement>(null);

    const initFabric = useCallback(() => {
        if (
            !stageRef?.current ||
            !containerRef?.current ||
            _.isEmpty(projectInfo)
        )
            return;

        const fabricCanvas = new fabric.Canvas(stageRef.current, {
            backgroundColor: '#000',
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

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
                    backgroundColor: projectInfo.background,
                    width: projectInfo.width,
                    height: projectInfo.height,
                },
            },
            width: projectInfo.width,
            height: projectInfo.height,
            minZoom: 30,
            maxZoom: 300,
            zoomEnabled: true,
        });

        return () => {
            window.handler = null;
        };
    }, [projectInfo]);

    // 根据div大小调整画布大小
    useDebounceEffect(
        () => {
            if (
                window.handler &&
                containerRef.current &&
                containerSize?.width &&
                containerSize?.height
            ) {
                window.handler.eventHandler.resize(
                    containerSize?.width,
                    containerSize?.height,
                );
            }
        },
        [containerSize],
        {
            wait: 300,
        },
    );

    // 初始化
    useEffect(() => {
        initFabric();
    }, []);

    return (
        <div className={styles.stageWrap} ref={containerRef}>
            <canvas ref={stageRef}></canvas>
        </div>
    );
});

export default Canvas;
