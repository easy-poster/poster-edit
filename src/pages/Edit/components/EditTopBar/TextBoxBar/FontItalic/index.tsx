import React, { useCallback } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import styles from './index.less';

const FontItalic = React.memo(() => {
    const handleClick = useCallback(() => {}, []);

    return (
        <div className={styles.fontItalicWrap}>
            <Tooltip title="斜体" placement="bottom">
                <BarButton onClick={handleClick}>
                    <IconFont type="icon-xieti" style={{ fontSize: '24px' }} />
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default FontItalic;
