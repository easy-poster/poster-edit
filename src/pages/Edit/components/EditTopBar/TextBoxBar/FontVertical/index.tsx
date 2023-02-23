import React, { useCallback } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import styles from './index.less';

const FontVertical = React.memo(() => {
    const handleClick = useCallback(() => {}, []);

    return (
        <div className={styles.textVerticalWrap}>
            <Tooltip title="竖直排版" placement="bottom">
                <BarButton onClick={handleClick}>
                    <IconFont
                        type="icon-chuizhijianju"
                        style={{ fontSize: '26px' }}
                    />
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default FontVertical;
