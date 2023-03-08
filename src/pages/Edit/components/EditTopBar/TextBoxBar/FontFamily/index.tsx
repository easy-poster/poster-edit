import React, { useCallback, useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import {
    OperatingPanelContext,
    OperatingPanelType,
} from '@/pages/Edit/Container/OperatingPanelContainer';
import { IconFont } from '@/const';
import styles from './index.less';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';

const FontFamily = React.memo(() => {
    const { selectObj } = useContext(SelectContext);
    const [fontFamily, setFontFamily] = useState(
        () => selectObj?.fontFamily ?? '微软雅黑',
    );
    const { panelType, setPanelType } = useContext(OperatingPanelContext);

    const handleClick = useCallback(() => {
        setPanelType(
            OperatingPanelType.FONTFAMILY === panelType
                ? OperatingPanelType.NONE
                : OperatingPanelType.FONTFAMILY,
        );
    }, [panelType]);

    useEffect(() => {
        setFontFamily(selectObj?.fontFamily);
    }, [selectObj?.fontFamily]);

    return (
        <div
            className={cn(styles.familyWrap, {
                [styles.active]: OperatingPanelType.FONTFAMILY === panelType,
            })}
            onClick={handleClick}
        >
            <p>{fontFamily}</p>
            <IconFont type="icon-xiangxia" style={{ fontSize: '24px' }} />
        </div>
    );
});

export default FontFamily;
