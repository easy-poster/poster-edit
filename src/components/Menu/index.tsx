import { Link, history } from '@umijs/max';
import LogoColor from '@/assets/logo/color.svg';
import { MENU_LAYOUT } from '@/const';
import { IconFont } from '@/const';
import './index.less';
import { useLocation } from '@umijs/max';

const Menu = () => {
    const { pathname } = useLocation();

    return (
        <div className="menu-wrap">
            <nav className="menu-nav">
                <div className="menu-logo">
                    <img src={LogoColor} onClick={() => history.push('/')} />
                </div>
                <div className="menu-list">
                    {MENU_LAYOUT.map((item) => {
                        return (
                            <Link
                                key={item.id}
                                to={item.route}
                                className={`menu-item ${
                                    pathname === item.route ? 'active-item' : ''
                                }`}
                            >
                                <div className="menu-icon">
                                    <IconFont type={item.icon} style={{ fontSize: '24px' }} />
                                </div>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
            <div className="other-setting">
                <Link
                    to="/setting"
                    className={`setting-btn ${pathname === '/setting' ? 'active-item' : ''}`}
                >
                    <div className="setting-icon">
                        <IconFont type="icon-shezhi" style={{ fontSize: '24px' }} />
                    </div>
                    <span>设置</span>
                </Link>
            </div>
        </div>
    );
};

export default Menu;
