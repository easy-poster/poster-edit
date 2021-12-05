import React, { useEffect, useCallback, useRef, useState } from 'react';
import { dynamic } from 'umi';
import SizeBar from './components/SizeBar';
import { IconFont } from '@/const';
import './index.less';

const AsyncStage = dynamic({
  loader: async function () {
    // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
    const { default: Stage } = await import(
      /* webpackChunkName: "external_A" */ './components/Stage'
    );
    return Stage;
  },
});

const Edit = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleBtnClick = () => {
    setIsOpen(!isOpen);
    const listDOM = listRef.current;
    if (listDOM) {
      if (isOpen) {
        listDOM.style.height = `0px`;
      } else {
        listDOM.style.height = `180px`;
      }
    }
  };

  const handleExport = () => {
    console.log('导出');
  };

  return (
    <>
      <div className="edit-header">
        <div className="header-bar">
          <div className="bar-content">headbarheadbar</div>
        </div>
        <div className="header-right">
          <div className="header-update">
            <IconFont type="icon-huiyuan" style={{ fontSize: '28px' }} />
            <span className="update-text">升级</span>
          </div>
          <div className="header-export" onClick={handleExport}>
            导出
          </div>
        </div>
      </div>
      <div className="edit-content">
        <div className="edit-main">
          <AsyncStage />
          <SizeBar />
        </div>
        <div className="edit-footer">
          <div className="edit-tool-bar">tool bar</div>
          <div className="edit-list-bar" ref={listRef}>
            list bar
          </div>
          <div className="edit-footer-btn" onClick={handleBtnClick}>
            <IconFont
              type="icon-xiangzuo1"
              style={{
                fontSize: '14px',
                transform: `${isOpen ? `rotate(270deg)` : `rotate(90deg)`}`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
