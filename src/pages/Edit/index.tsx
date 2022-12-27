import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
    dynamic,
    useModel,
    useParams,
    connect,
    useDispatch,
    useStore,
    useSelector,
} from '@umijs/max';
import HeaderBar from './components/HeaderBar';
import SizeBar from './components/SizeBar';
import { IconFont, ItemType } from '@/const';
import './index.less';
import { useSetState, useSize } from 'ahooks';
import Stage from './Stage';
import { db, epProject } from '@/utils/db';

const Edit = () => {
    const params = useParams<{ id: string }>();

    const dispatch = useDispatch();
    const projectState = useSelector((state: any) => {
        return state.project;
    });

    useEffect(() => {
        if (params?.id) {
            dispatch({
                type: 'project/getPrj',
                payload: { uuid: params.id },
            });
        }

        return () => {};
    }, []);

    const { setShowBuy } = useModel('buy');
    const handleUpdate = () => {
        setShowBuy(true);
    };

    const handleImgExport = () => {
        window?.handler?.saveCanvasImage();
    };

    return (
        <>
            <div className="edit-header">
                <div className="header-left">
                    <HeaderBar projectProps={projectState} />
                </div>
                <div className="header-right">
                    <div className="header-update" onClick={handleUpdate}>
                        <IconFont
                            type="icon-huiyuan"
                            style={{ fontSize: '28px' }}
                        />
                        <span className="update-text">升级</span>
                    </div>
                    <div className="header-export" onClick={handleImgExport}>
                        导出
                    </div>
                </div>
            </div>
            <div className="edit-content">
                <div className="edit-main">
                    <Stage />
                    <SizeBar />
                </div>
                {/* <div className="edit-footer">
          <div className="edit-tool-bar">tool bar</div>
          <div className="edit-list-bar" ref={listRef}>
            list bar
          </div>
          <div className="edit-footer-btn" onClick={handleBtnClick}>
            <IconFont
              type="icon-xiangzuo"
              style={{
                fontSize: '14px',
                transform: `${isOpen ? `rotate(270deg)` : `rotate(90deg)`}`,
              }}
            />
          </div>
        </div> */}
            </div>
        </>
    );
};

export default Edit;
