import React from 'react';
import { IRouteComponentProps } from 'umi';
import './index.less';

const Layout = (props: IRouteComponentProps) => {
  return <div>{props.children}</div>;
};

export default Layout;
