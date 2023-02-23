import React, { useCallback } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import styles from './index.less';

const FontWeight = React.memo(() => {
    const handleClick = useCallback(() => {}, []);

    return (
        <div className={styles.fontWeightWrap}>
            <Tooltip title="粗体" placement="bottom">
                <BarButton onClick={handleClick}>
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
