import React from 'react';
import { useModel, useDispatch } from '@umijs/max';
import { IconFont } from '@/const';
import HeaderBar from '../HeaderBar';
import BridgeController from '@/helper/bridge/BridgeController';
import UndoRedo from './UndoRedo';
import styles from './index.less';
import Save from './Save';
import ExportPopover from './ExportPopover';

const EditHeader = React.memo(() => {
    // const { setShowBuy } = useModel('buy');
    // const handleUpdate = () => {
    //     setShowBuy(true);
    // };
    const dispatch = useDispatch();

    const handleImgExport = () => {
        let resJson = BridgeController.ExportStageJSON();
        console.log('resJson', resJson);
        if (!resJson) return;
        // dispatch({
        //     type: 'project/updatePrj',
        //     payload: {
        //         content: JSON.stringify(resJson),
        //     },
        // });
        // window?.handler?.saveCanvasImage();
    };

    return (
        <div className={styles.editHeader}>
            <div className={styles.headerLeft}>
                <UndoRedo />
                <Save />
                <HeaderBar />
            </div>
            <div className={styles.headerRight}>
                {/* <div className={styles.headerUpdate} onClick={handleUpdate}>
                    <IconFont
                        type="icon-huiyuan"
                        style={{ fontSize: '28px' }}
                    />
                    <span className={styles.updateText}>升级</span>
                </div> */}
                <ExportPopover />
            </div>
        </div>
    );
});

export default EditHeader;
