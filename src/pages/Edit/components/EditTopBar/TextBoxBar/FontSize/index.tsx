import React, { useCallback, useContext, useEffect, useState } from 'react';
import { InputNumber, Tooltip } from 'antd';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';

const FontSize = React.memo(() => {
    const { selectObj } = useContext(SelectContext);

    const [size, setSize] = useState(() => selectObj?.fontSize);

    const handleChange = useCallback((value: number | null) => {
        setSize(value);
        BridgeController.SetFontStyle({
            fontSize: value,
        });
    }, []);

    useEffect(() => {
        if (!selectObj?.fontSize) return;
        setSize(selectObj?.fontSize);
    }, [selectObj?.fontSize]);

    return (
        <Tooltip title="字体大小" placement="bottom">
            <div className={styles.fontSizeWrap}>
                <InputNumber
                    className={styles.inputNumber}
                    min={6}
                    max={144}
                    value={size}
                    defaultValue={size}
                    onChange={handleChange}
                />
            </div>
        </Tooltip>
    );
});

export default FontSize;
