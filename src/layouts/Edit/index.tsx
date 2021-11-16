import React from 'react';
import { IRouteComponentProps } from 'umi';
import EditMenu from '@/components/EditMenu';
import './index.less';

const EditLayout = (props: IRouteComponentProps) => {
  return (
    <div className="edit-wrap">
      <EditMenu />
      <div className="edit-content">
        <div className="edit-left">left model</div>
        <div className="edit-midline"></div>
        <div className="edit-right">{props.children}</div>
      </div>
    </div>
  );
};

export default EditLayout;
