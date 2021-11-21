import React from 'react';
import { IconFont } from '@/const';
import './index.less';

const Edit = () => {
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
      <div className="edit-content">edit content</div>
    </>
  );
};

export default Edit;
