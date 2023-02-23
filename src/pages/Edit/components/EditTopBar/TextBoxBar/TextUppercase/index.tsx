import React, { useCallback } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import styles from './index.less';

const TextUppercase = React.memo(() => {
    const handleClick = useCallback(() => {}, []);

    return (
        <div className={styles.textUppercaseWrap}>
            <Tooltip title="大写" placement="bottom">
                <BarButton onClick={handleClick}>
                    <IconFont type="icon-daxie" style={{ fontSize: '24px' }} />
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default TextUppercase;
