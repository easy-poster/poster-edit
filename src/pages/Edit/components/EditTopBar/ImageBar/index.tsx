import React, { useCallback, useContext } from 'react';
import {
    OperatingPanelContext,
    OperatingPanelType,
} from '@/pages/Edit/Container/OperatingPanelContainer';
import BarButton from '../components/BarButton';
import styles from './index.less';

const ImageBar = React.memo(() => {
    const { panelType, setPanelType } = useContext(OperatingPanelContext);

    const handleEdit = useCallback(() => {
        setPanelType(
            OperatingPanelType.IMAGE === panelType
                ? OperatingPanelType.NONE
                : OperatingPanelType.IMAGE,
        );
    }, [panelType]);

    const handleFlip = useCallback(() => {
        console.log('flip');
    }, []);

    return (
        <div className={styles.imageBarWrap}>
            <BarButton
                onClick={handleEdit}
                active={OperatingPanelType.IMAGE === panelType}
            >
                编辑图像
            </BarButton>
            <BarButton onClick={handleFlip}>翻转</BarButton>
        </div>
    );
});

export default ImageBar;
