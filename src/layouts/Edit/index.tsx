import React from 'react';
import { IRouteComponentProps } from 'umi';
import EditMenu from '@/components/EditMenu';
import './index.less';

const EditLayout = (props: IRouteComponentProps) => {
  return (
    <div className="edit-wrap">
      <EditMenu />
      <div className="edit-content">{props.children}</div>
    </div>
  );
};

export default EditLayout;
