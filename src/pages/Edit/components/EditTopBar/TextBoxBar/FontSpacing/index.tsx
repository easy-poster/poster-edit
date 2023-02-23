import React, { useCallback } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import styles from './index.less';

const FontSpacing = React.memo(() => {
    const handleClick = useCallback(() => {}, []);

    return (
        <div className={styles.fontSpacingWrap}>
            <Tooltip title="字间距" placement="bottom">
                <BarButton onClick={handleClick}>
                    <IconFont
                        type="icon-zijianju"
                        style={{ fontSize: '24px' }}
                    />
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default FontSpacing;
