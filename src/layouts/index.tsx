import React from 'react';
import { IRouteComponentProps } from 'umi';
import Menu from '@/components/Menu';
import Nav from '@/components/Nav';
import './index.less';

const Layout = (props: IRouteComponentProps) => {
  return (
    <div className="main">
      <Menu />
      <div className="content">
        <Nav />
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
