import { InputNumber, Tooltip } from 'antd';
import React, { useCallback } from 'react';
import styles from './index.less';

const FontSize = React.memo(() => {
    const handleChange = useCallback(() => {}, []);

    return (
        <Tooltip title="字体大小" placement="bottom">
            <div className={styles.fontSizeWrap}>
                <InputNumber
                    className={styles.inputNumber}
                    min={6}
                    max={144}
                    defaultValue={14}
                    onChange={handleChange}
                />
            </div>
        </Tooltip>
    );
});

export default FontSize;
