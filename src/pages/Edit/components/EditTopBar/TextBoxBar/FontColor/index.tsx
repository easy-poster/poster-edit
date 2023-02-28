import React, { useCallback, useContext, useMemo } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import {
    OperatingPanelContext,
    OperatingPanelType,
} from '@/pages/Edit/Container/OperatingPanelContainer';
import styles from './index.less';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';

const FontColor = React.memo(() => {
    const { selectObj } = useContext(SelectContext);
    const { panelType, setPanelType } = useContext(OperatingPanelContext);

    const isActive = useMemo(() => {
        return OperatingPanelType.FONTCOLOR === panelType;
    }, [panelType]);

    const activeColor = useMemo(() => {
        return (selectObj?.fill as string) || '#ababb8';
    }, [selectObj?.fill]);

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
                <BarButton
                    onClick={handleClick}
                    active={isActive}
                    className={styles.buttonWrap}
                >
                    <IconFont
                        type="icon-zitiyanse"
                        style={{ fontSize: '20px' }}
                    />
                    <div
                        className={styles.line}
                        style={{ backgroundColor: activeColor }}
                    ></div>
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default FontColor;
