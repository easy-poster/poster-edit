import React, { useMemo } from 'react';
import { Link, useHistory } from 'umi';
import LogoColor from '@/assets/logo/color.svg';
import { MENU_LAYOUT } from '@/const';
import { IconFont } from '@/const';
import './index.less';

const Menu = () => {
    const history = useHistory();

    const activeMenu = useMemo(() => {
        return history.location.pathname;
    }, [history.location.pathname]);

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
                                    activeMenu === item.route ? 'active-item' : ''
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
                    className={`setting-btn ${activeMenu === '/setting' ? 'active-item' : ''}`}
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
