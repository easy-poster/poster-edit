import React, { useContext, useCallback, useMemo } from 'react';
import { useSelector } from '@umijs/max';
import Canvas from './canvas';
import Loading from './loading';
import logger from '@/utils/logger';
import BridgeEmitter, { F2N } from '@/helper/bridge/BridgeEmitter';
import { SizeContext } from '../StageContainer/SizeContainer';

const Stage = React.memo(() => {
    /**
     * @todo 获取画布信息提取到上层container
     */
    const { projectState } = useSelector(
        (state: { project: any; loading: any }) => {
            return {
                projectState: state.project,
            };
        },
    );

    const isRender = useMemo(() => {
        return !!projectState?.uuid;
    }, [projectState?.uuid]);

    const { setSizeStage } = useContext(SizeContext);

    const onLoad = useCallback(() => {
        logger.info('onLoad');
    }, []);

    const onModified = useCallback((params: any) => {
        logger.info('onModified');
        BridgeEmitter.emit(F2N.MODIFIED_STAGE, params);
    }, []);

    const onAdd = useCallback((params: any) => {
        logger.info('onAdd');
        BridgeEmitter.emit(F2N.ADD_RESOURCE, params);
    }, []);

    const onRemove = useCallback((params: any) => {
        logger.info('onRemove');
        BridgeEmitter.emit(F2N.DEL_RESOURCE, params);
    }, []);

    const onSelect = useCallback(
        (params?: FabricObject[] | FabricObject<fabric.Group>) => {
            logger.info('onSelect', params);
            BridgeEmitter.emit(F2N.SELECT, params);
        },
        [],
    );

    const onZoom = useCallback((zoom: number) => {
        logger.info('onZoom', Math.round(zoom * 100));
        setSizeStage(Math.round(zoom * 100));
    }, []);

    const onClick = useCallback(() => {
        logger.info('onClick');
    }, []);

    const onContext = useCallback((params: any) => {
        logger.info('onContext');
        BridgeEmitter.emit(F2N.CONTEXT, params);
    }, []);

    const onTransaction = useCallback((params: any) => {
        logger.info('onTransaction');
        BridgeEmitter.emit(F2N.TRANSACTION, params);
    }, []);

    return isRender ? (
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
});

export default Stage;
