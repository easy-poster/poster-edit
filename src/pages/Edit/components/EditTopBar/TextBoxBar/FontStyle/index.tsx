import React, { useCallback, useContext } from 'react';
import cn from 'classnames';
import {
    OperatingPanelContext,
    OperatingPanelType,
} from '@/pages/Edit/Container/OperatingPanelContainer';
import styles from './index.less';

const FontStyle = React.memo(() => {
    const { panelType, setPanelType } = useContext(OperatingPanelContext);

    const handleClick = useCallback(() => {
        setPanelType(
            OperatingPanelType.FONTSTYLE === panelType
                ? OperatingPanelType.NONE
                : OperatingPanelType.FONTSTYLE,
        );
    }, [panelType]);

    return (
        <div
            className={cn(styles.fontStylesWrap, {
                [styles.active]: OperatingPanelType.FONTSTYLE === panelType,
            })}
            onClick={handleClick}
        >
            风格
        </div>
    );
});

export default FontStyle;
