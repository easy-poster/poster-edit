import React from 'react';
import { useSelector, useModel } from '@umijs/max';
import Canvas from './canvas/Canvas';
import Loading from './loading';
import { useCallback } from 'react';
import logger from '@/utils/logger';

const Stage: React.FC = () => {
    const projectState = useSelector((state: { project: any }) => {
        return state.project;
    });
    const { setSizeStage } = useModel('sizeStage');

    const onLoad = useCallback(() => {
        logger.info('onLoad');
    }, []);

    const onModified = useCallback(() => {
        logger.info('onModified');
    }, []);

    const onAdd = useCallback(() => {
        logger.info('onAdd');
    }, []);

    const onRemove = useCallback(() => {
        logger.info('onRemove');
    }, []);

    const onSelect = useCallback(() => {
        logger.info('onSelect');
    }, []);

    const onZoom = useCallback((zoom: number) => {
        logger.info('onZoom', zoom);
        setSizeStage(Math.round(zoom * 100));
    }, []);

    const onClick = useCallback(() => {
        logger.info('onClick');
    }, []);

    const onContext = useCallback(() => {
        logger.info('onContext');
    }, []);

    const onTransaction = useCallback(() => {
        logger.info('onTransaction');
    }, []);

    return projectState?.uuid ? (
        <Canvas
            projectInfo={projectState}
            onLoad={onLoad}
            onModified={onModified}
            onAdd={onAdd}
            onRemove={onRemove}
            onSelect={onSelect}
            onZoom={onZoom}
            onClick={onClick}
            onContext={onContext}
            onTransaction={onTransaction}
        />
    ) : (
        <Loading />
    );
};

export default Stage;
