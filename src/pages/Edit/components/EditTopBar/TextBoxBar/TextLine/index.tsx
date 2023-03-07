import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';

const TextLine = React.memo(() => {
    const { selectObj } = useContext(SelectContext);

    const [isUnderline, setIsUnderline] = useState(() => selectObj?.underline);

    const handleClick = useCallback(() => {
        setIsUnderline(!isUnderline);
        BridgeController.SetedObjectStyle({
            underline: !isUnderline,
        });
    }, [isUnderline]);

    useEffect(() => {
        setIsUnderline(selectObj?.underline);
    }, [selectObj?.underline]);

    return (
        <div className={styles.textLineWrap}>
            <Tooltip title="下划线" placement="bottom">
                <BarButton onClick={handleClick} active={isUnderline}>
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
