import React from 'react';
import { IRouteComponentProps, useModel } from 'umi';
import Menu from '@/components/Menu';
import Nav from '@/components/Nav';
import VipModal from '@/components/VipModal';
import './index.less';

const Layout = (props: IRouteComponentProps) => {
  const { isShowBuy } = useModel('buy');

  return (
    <div className="main">
      <Menu />
      <div className="content">
        <Nav />
        {props.children}
      </div>
      <VipModal visible={isShowBuy} />
    </div>
  );
};

export default Layout;
