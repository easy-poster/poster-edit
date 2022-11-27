import React from 'react';
import { Outlet, useModel } from '@umijs/max';
import Menu from '@/components/Menu';
import Nav from '@/components/Nav';
import VipModal from '@/components/VipModal';
import './index.less';

const Layout = () => {
    const { isShowBuy } = useModel('buy');

    return (
        <div className="main">
            <Menu />
            <div className="content">
                <Nav />
                <Outlet />
            </div>
            <VipModal visible={isShowBuy} />
        </div>
    );
};

export default Layout;
