import React, { useCallback, useEffect, useImperativeHandle, useRef } from 'react';
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

    useEffect(() => {
        initFabric();
    }, []);

    const initFabric = useCallback(() => {
        if (!stageRef?.current || !containerRef?.current) return;
        window.canvas = new fabric.Canvas(stageRef.current, {
            backgroundColor: '#000',
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        window.canvas.selectionColor = 'rgba(40, 144, 149, 0.269)';
        window.canvas.selectionBorderColor = '#209fa5';
        window.canvas.selectionLineWidth = 1;

        window.canvas.renderAll();

        const mergeCanvasOption = {
            ...defaults.canvasOption,
            ...{
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight,
            },
        };

        const onAdd = (target) => {
            console.log('tonAdd target', target);
            // window.handler.select(target);
        };

        window.handler = new Handler({
            id: '1',
            editable: true,
            canvas: window.canvas,
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
                onAdd: onAdd,
            },
        });

        return () => {
            window.canvas = null;
            window.handler = null;
        };
    }, []);

    useEffect(() => {
        if (
            window.handler &&
            containerRef.current &&
            containerSize?.width &&
            containerSize?.height
        ) {
            window.handler.eventHandler.resize(containerSize?.width, containerSize?.height);
        }
    }, [containerSize]);

    return (
        <div className={styles.stageWrap} ref={containerRef}>
            <canvas ref={stageRef}></canvas>
        </div>
    );
});

export default Canvas;
