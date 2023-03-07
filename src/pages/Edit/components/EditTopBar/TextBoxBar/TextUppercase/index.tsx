import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';

/**
 * @description 转大写 先不加这个功能
 */
const TextUppercase = React.memo(() => {
    const { selectObj } = useContext(SelectContext);

    const [isUpperCase, setIsUpperCase] = useState(() => selectObj?.upperCase);

    const handleClick = useCallback(() => {
        setIsUpperCase(!isUpperCase);
        BridgeController.SetedObjectStyle({
            upperCase: !isUpperCase,
        });
    }, [isUpperCase]);

    useEffect(() => {
        if (!selectObj?.upperCase) return;
        setIsUpperCase(selectObj?.upperCase);
    }, [selectObj?.upperCase]);

    return (
        <div className={styles.textUppercaseWrap}>
            <Tooltip title="大写" placement="bottom">
                <BarButton onClick={handleClick} active={isUpperCase}>
                    <IconFont type="icon-daxie" style={{ fontSize: '24px' }} />
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default TextUppercase;
