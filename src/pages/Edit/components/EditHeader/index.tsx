import React, { useState, useRef } from 'react';
import { IconFont } from '@/const';
import HeaderBar from '../HeaderBar';
import { useModel } from '@umijs/max';
import styles from './index.less';

const EditHeader = React.memo(() => {
    const { setShowBuy } = useModel('buy');
    const handleUpdate = () => {
        setShowBuy(true);
    };

    const handleImgExport = () => {
        window?.handler?.saveCanvasImage();
    };

    return (
        <div className={styles.editHeader}>
            <div className={styles.headerLeft}>
                <HeaderBar />
            </div>
            <div className={styles.headerRight}>
                <div className={styles.headerUpdate} onClick={handleUpdate}>
                    <IconFont
                        type="icon-huiyuan"
                        style={{ fontSize: '28px' }}
                    />
                    <span className={styles.updateText}>升级</span>
                </div>
                <div className={styles.headerExport} onClick={handleImgExport}>
                    导出
                </div>
            </div>
        </div>
    );
});

export default EditHeader;
