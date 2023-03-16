import { Outlet } from '@umijs/max';
import Menu from '@/components/Menu';
import Nav from '@/components/Nav';
import './index.less';

const Layout = () => {
    return (
        <div className="main">
            <Menu />
            <div className="content">
                <Nav />
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
