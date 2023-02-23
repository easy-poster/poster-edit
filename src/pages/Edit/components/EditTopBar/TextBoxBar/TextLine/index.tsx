import React, { useCallback } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import styles from './index.less';

const TextLine = React.memo(() => {
    const handleClick = useCallback(() => {}, []);

    return (
        <div className={styles.textLineWrap}>
            <Tooltip title="下划线" placement="bottom">
                <BarButton onClick={handleClick}>
                    <IconFont
                        type="icon-xiahuaxian"
                        style={{ fontSize: '24px' }}
                    />
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default TextLine;
