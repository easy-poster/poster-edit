import React, { useMemo } from 'react';
import { Link, useHistory } from 'umi';
import LogoColor from '@/assets/logo/color.svg';
import { MENU_LAYOUT } from '@/const';
import { createFromIconfontCN } from '@ant-design/icons';
import './index.less';

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_2919693_ebagwhw8h5t.js', // icon-home icon-haibaozujian icon-pinpai icon-moban icon-shezhi
  ],
});

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
                <p>{item.name}</p>
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="other-setting">
        <Link
          to="/setting"
          className={`setting-btn ${
            activeMenu === '/setting' ? 'active-item' : ''
          }`}
        >
          <div className="setting-icon">
            <IconFont type="icon-shezhi" style={{ fontSize: '24px' }} />
          </div>
          <p>设置</p>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
