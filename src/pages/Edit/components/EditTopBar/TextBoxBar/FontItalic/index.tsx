import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';

const FontItalic = React.memo(() => {
    const { selectObj } = useContext(SelectContext);

    const [isItalic, setIsItalic] = useState(
        () => selectObj?.fontStyle === 'italic',
    );

    const handleClick = useCallback(() => {
        setIsItalic(!isItalic);
        BridgeController.SetedObjectStyle({
            fontStyle: isItalic ? 'normal' : 'italic',
        });
    }, [isItalic]);

    useEffect(() => {
        if (!selectObj?.fontStyle) return;
        setIsItalic(selectObj?.fontStyle === 'italic');
    }, [selectObj?.fontStyle]);

    return (
        <div className={styles.fontItalicWrap}>
            <Tooltip title="斜体" placement="bottom">
                <BarButton onClick={handleClick} active={isItalic}>
                    <IconFont type="icon-xieti" style={{ fontSize: '24px' }} />
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default FontItalic;
