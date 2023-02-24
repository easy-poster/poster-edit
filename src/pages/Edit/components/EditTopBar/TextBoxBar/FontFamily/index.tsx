import React, { useCallback, useContext, useState } from 'react';
import cn from 'classnames';
import {
    OperatingPanelContext,
    OperatingPanelType,
} from '@/pages/Edit/Container/OperatingPanelContainer';
import { IconFont } from '@/const';
import styles from './index.less';

const FontFamily = React.memo(() => {
    const [fontFamily, setFontFamily] = useState('微软雅黑');
    const { panelType, setPanelType } = useContext(OperatingPanelContext);

    const handleClick = useCallback(() => {
        setPanelType(
            OperatingPanelType.FONTFAMILY === panelType
                ? OperatingPanelType.NONE
                : OperatingPanelType.FONTFAMILY,
        );
    }, [panelType]);

    return (
        <div
            className={cn(styles.familyWrap, {
                [styles.active]: OperatingPanelType.FONTFAMILY === panelType,
            })}
            onClick={handleClick}
        >
            <span>{fontFamily}</span>
            <IconFont type="icon-xiangxia" style={{ fontSize: '24px' }} />
        </div>
    );
});

export default FontFamily;
