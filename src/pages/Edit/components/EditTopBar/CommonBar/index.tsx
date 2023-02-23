import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import React, { useCallback } from 'react';
import BarButton from '../components/BarButton';
import styles from './index.less';

const CommonBar = React.memo(() => {
    const handleE = useCallback(() => {}, []);

    return (
        <div className={styles.commonBarWrap}>
            <Tooltip title="图层" placement="bottom">
                <BarButton onClick={handleE}>
                    <IconFont
                        type="icon-023tuceng"
                        style={{ fontSize: '24px' }}
                    />
                </BarButton>
            </Tooltip>
            <Tooltip title="透明度" placement="bottom">
                <BarButton onClick={handleE}>
                    <IconFont
                        type="icon-touming"
                        style={{ fontSize: '24px' }}
                    />
                </BarButton>
            </Tooltip>
            <Tooltip title="锁定" placement="bottom">
                <BarButton onClick={handleE}>
                    <IconFont
                        type="icon-suoding"
                        style={{
                            fontSize: '24px',
                            transform: 'rotateY(180deg)',
                        }}
                    />
                    {/* <IconFont type="icon-jiesuo" style={{ fontSize: '24px' }} /> */}
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default CommonBar;
