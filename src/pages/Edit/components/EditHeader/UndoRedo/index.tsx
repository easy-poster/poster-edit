import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IconFont } from '@/const';
import styles from './index.less';
import BridgeEmitter, { F2N } from '@/helper/bridge/BridgeEmitter';

const UndoRedo = React.memo(() => {
    const [count, setCount] = useState(0);

    const isUndo = useMemo(() => {
        return window.handler?.transactionHandler.undos.length;
    }, [count]);

    const isRedo = useMemo(() => {
        return window.handler?.transactionHandler.redos.length;
    }, [count]);

    const handleUndo = useCallback(() => {
        window.handler?.transactionHandler.undo();
    }, []);

    const handleRedo = useCallback(() => {
        window.handler?.transactionHandler.redo();
    }, []);

    useEffect(() => {
        const refresh = () => {
            setCount((pre) => pre + 1);
        };
        BridgeEmitter.on(F2N.UNDOABLR, refresh);

        return () => {
            BridgeEmitter.off(F2N.UNDOABLR, refresh);
        };
    }, []);

    return (
        <div className={styles.unreWrap}>
            <div onClick={handleUndo}>
                <IconFont
                    disabled={!isUndo}
                    type="icon-a-icon_chexiaofanhui"
                    style={{
                        fontSize: '24px',
                        color: isUndo ? '#FFF' : '#5c5c5c',
                    }}
                />
            </div>
            <div onClick={handleRedo}>
                <IconFont
                    disabled={!isRedo}
                    type="icon-a-icon_chexiaofanhui"
                    style={{
                        fontSize: '24px',
                        transform: 'rotateY(180deg)',
                        color: isRedo ? '#FFF' : '#5c5c5c',
                    }}
                />
            </div>
        </div>
    );
});

export default UndoRedo;
