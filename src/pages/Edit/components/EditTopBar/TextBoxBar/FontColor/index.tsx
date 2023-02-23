import React, { useCallback } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import styles from './index.less';

const FontColor = React.memo(() => {
    const handleClick = useCallback(() => {}, []);

    return (
        <div className={styles.fontColorWrap}>
            <Tooltip title="字体颜色" placement="bottom">
                <BarButton onClick={handleClick}>
                    <IconFont
                        type="icon-T-yanse"
                        style={{ fontSize: '24px' }}
                    />
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default FontColor;
