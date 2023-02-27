import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { IconFont } from '@/const';
import BridgeController from '@/helper/bridge/BridgeController';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';
import BarButton from '../components/BarButton';
import LayerBar from './LayerBar';
import OpacityBar from './OpacityBar';
import styles from './index.less';

const CommonBar = React.memo(() => {
    const { selectObj } = useContext(SelectContext);
    const [isLocked, setIsLocked] = useState(() => !!selectObj?.locked);

    const handlelocked = useCallback(() => {
        setIsLocked(!isLocked);
        BridgeController.LayerLock();
    }, [isLocked]);

    const handleDelActive = useCallback(() => {
        BridgeController.DelResource();
    }, []);

    useEffect(() => {
        setIsLocked(!!selectObj?.locked);
    }, [selectObj?.locked]);

    return (
        <div className={styles.commonBarWrap}>
            <LayerBar />
            <OpacityBar />
            <Tooltip title="锁定" placement="bottom">
                <BarButton onClick={handlelocked}>
                    {isLocked ? (
                        <IconFont
                            type="icon-jiesuo"
                            style={{ fontSize: '24px' }}
                        />
                    ) : (
                        <IconFont
                            type="icon-suoding"
                            style={{
                                fontSize: '24px',
                                transform: 'rotateY(180deg)',
                            }}
                        />
                    )}
                </BarButton>
            </Tooltip>
            <Tooltip title="删除" placement="bottom">
                <BarButton onClick={handleDelActive}>
                    <IconFont
                        type="icon-lajitong"
                        style={{
                            fontSize: '24px',
                            transform: 'rotateY(180deg)',
                        }}
                    />
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default CommonBar;
