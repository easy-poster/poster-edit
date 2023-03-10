import React, { useCallback, useContext, useMemo } from 'react';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';
import BarButton from '../../components/BarButton';
import BridgeController from '@/helper/bridge/BridgeController';

const GroupOperation = React.memo(() => {
    const { selectObjs } = useContext(SelectContext);

    const isGroup = useMemo(() => {
        return selectObjs?.length === 1;
    }, [selectObjs?.length]);

    const handleClick = useCallback(() => {
        // 设置和拆分组合
        if (isGroup) {
            BridgeController.setToActiveSelection();
        } else {
            BridgeController.setToGroup();
        }
    }, [isGroup]);

    return (
        <BarButton onClick={handleClick}>
            {isGroup ? '拆分组合' : '设置组合'}
        </BarButton>
    );
});

export default GroupOperation;
