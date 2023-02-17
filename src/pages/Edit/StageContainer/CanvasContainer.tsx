import BridgeController from '@/helper/bridge/BridgeController';
import BridgeEmitter, { F2N } from '@/helper/bridge/BridgeEmitter';
import { useDispatch } from '@umijs/max';
import React, { useCallback, useEffect } from 'react';

/**
 * @description canvas容器
 */
const CanvasContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;
    const dispatch = useDispatch();

    const handleUpdate = useCallback(async () => {
        console.log('listen handleAddResource');
        let resJson = BridgeController.ExportStageJSON();
        if (!resJson) return;
        // dispatch({
        //     type: 'project/updatePrj',
        //     payload: {
        //         content: JSON.stringify(resJson),
        //     },
        // });
    }, []);

    // 添加后
    const handleAddResource = useCallback(() => {
        handleUpdate();
    }, []);

    // 删除后
    const handleDelResource = useCallback(() => {
        console.log('listen handleDelResource');
        handleUpdate();
    }, []);

    // 改变元素后
    const handleModifiedResource = useCallback(() => {
        console.log('listen handleModifiedResource');
        // handleUpdate();
    }, []);

    useEffect(() => {
        BridgeEmitter.on(F2N.ADD_RESOURCE, handleAddResource);
        BridgeEmitter.on(F2N.DEL_RESOURCE, handleDelResource);
        BridgeEmitter.on(F2N.MODIFIED_STAGE, handleModifiedResource);

        return () => {
            BridgeEmitter.off(F2N.ADD_RESOURCE, handleAddResource);
            BridgeEmitter.off(F2N.DEL_RESOURCE, handleDelResource);
            BridgeEmitter.off(F2N.MODIFIED_STAGE, handleModifiedResource);
        };
    }, []);

    return <>{children}</>;
});

export default CanvasContainer;
