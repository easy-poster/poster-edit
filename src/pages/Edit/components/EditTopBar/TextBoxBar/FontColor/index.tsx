import React, { useCallback, useContext, useMemo } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import {
    OperatingPanelContext,
    OperatingPanelType,
} from '@/pages/Edit/Container/OperatingPanelContainer';
import styles from './index.less';

const FontColor = React.memo(() => {
    const { panelType, setPanelType } = useContext(OperatingPanelContext);

    const isActive = useMemo(() => {
        return OperatingPanelType.FONTCOLOR === panelType;
    }, [panelType]);

    const handleClick = useCallback(() => {
        setPanelType(
            OperatingPanelType.FONTCOLOR === panelType
                ? OperatingPanelType.NONE
                : OperatingPanelType.FONTCOLOR,
        );
    }, [panelType]);

    return (
        <div className={styles.fontColorWrap}>
            <Tooltip title="字体颜色" placement="bottom">
                <BarButton onClick={handleClick} active={isActive}>
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
