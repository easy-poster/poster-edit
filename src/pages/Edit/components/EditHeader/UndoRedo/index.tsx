import React, { useCallback } from 'react';
import { IconFont } from '@/const';
import styles from './index.less';

const UndoRedo = React.memo(() => {
    const handleUndo = useCallback(() => {}, []);

    const handleForward = useCallback(() => {}, []);

    return (
        <div className={styles.unreWrap}>
            <div onClick={handleUndo}>
                <IconFont
                    type="icon-a-icon_chexiaofanhui"
                    style={{ fontSize: '24px' }}
                />
            </div>
            <div onClick={handleForward}>
                <IconFont
                    type="icon-a-icon_chexiaofanhui"
                    style={{ fontSize: '24px', transform: 'rotateY(180deg)' }}
                />
            </div>
        </div>
    );
});

export default UndoRedo;
