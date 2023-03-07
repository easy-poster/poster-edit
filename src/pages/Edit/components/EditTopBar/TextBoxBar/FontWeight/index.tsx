import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';
import BarButton from '../../components/BarButton';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';

const FontWeight = React.memo(() => {
    const { selectObj } = useContext(SelectContext);

    const [isWeight, setIsWeight] = useState(
        () => selectObj?.fontWeight === 'bold',
    );

    const handleClick = useCallback(() => {
        setIsWeight(!isWeight);
        BridgeController.SetedObjectStyle({
            fontWeight: isWeight ? 'normal' : 'bold',
        });
    }, [isWeight]);

    useEffect(() => {
        if (!selectObj?.fontWeight) return;
        setIsWeight(selectObj?.fontWeight === 'bold');
    }, [selectObj?.fontWeight]);

    return (
        <div className={styles.fontWeightWrap}>
            <Tooltip title="粗体" placement="bottom">
                <BarButton onClick={handleClick} active={isWeight}>
                    <IconFont
                        type="icon-fontbold"
                        style={{ fontSize: '24px' }}
                    />
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default FontWeight;
