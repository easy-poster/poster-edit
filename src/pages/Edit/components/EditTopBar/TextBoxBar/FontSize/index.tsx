import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { InputNumber, Select, Tooltip } from 'antd';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';

const FontSize = React.memo(() => {
    const { selectObj } = useContext(SelectContext);

    const [size, setSize] = useState(() => selectObj?.fontSize);

    const LIST = useMemo(() => {
        let Arr = [];
        let fontSize = 12;
        do {
            if (fontSize <= 30) {
                fontSize = fontSize + 2;
                Arr.push({
                    label: fontSize,
                    value: fontSize,
                });
            } else if (fontSize < 60) {
                fontSize = fontSize + 4;
                Arr.push({
                    label: fontSize,
                    value: fontSize,
                });
            } else if (fontSize < 100) {
                fontSize = fontSize + 6;
                Arr.push({
                    label: fontSize,
                    value: fontSize,
                });
            } else {
                fontSize = fontSize + 8;
                Arr.push({
                    label: fontSize,
                    value: fontSize,
                });
            }
        } while (fontSize <= 160);
        return Arr;
    }, []);

    const handleChange = useCallback((value: number | null) => {
        setSize(value);
        BridgeController.SetedObjectStyle({
            fontSize: value,
        });
    }, []);

    useEffect(() => {
        if (!selectObj?.fontSize) return;
        setSize(selectObj?.fontSize);
    }, [selectObj?.fontSize]);

    return (
        <Tooltip title="字体大小" placement="top">
            <div className={styles.fontSizeWrap}>
                <Select
                    value={size}
                    style={{ width: 120 }}
                    popupClassName={styles.fontSizeDrop}
                    onChange={handleChange}
                    options={LIST}
                />
            </div>
        </Tooltip>
    );
});

export default FontSize;
