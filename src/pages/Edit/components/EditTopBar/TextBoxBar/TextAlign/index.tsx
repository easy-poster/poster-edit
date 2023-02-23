import React, { useCallback } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import styles from './index.less';

const TextAlign = React.memo(() => {
    const handleClick = useCallback(() => {}, []);

    return (
        <div className={styles.textAlignWrap}>
            <Tooltip title="对齐" placement="bottom">
                <BarButton onClick={handleClick}>
                    <IconFont
                        type="icon-zuoduiqi"
                        style={{ fontSize: '24px' }}
                    />
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default TextAlign;
