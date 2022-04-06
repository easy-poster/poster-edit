import React from 'react';
import { Link, history } from 'umi';
import { Avatar, Divider, Dropdown, Menu, message } from 'antd';
import { IconFont } from '@/const';
import SearchHeader from '../SearchHeader';
import './index.less';

const menu = () => {
  const handleLogOut = () => {
    history.push('/login');
  };

  return (
    <Menu>
      <Menu.Item key="1">
        <Link to="/user">
          MOMO
          <p style={{ color: 'rgb(111, 111, 125)' }}>418788724@qq.com</p>
        </Link>
      </Menu.Item>
      <Menu.Item key="2" className="line"></Menu.Item>
      <Menu.Item key="3">
        <Link to="/setting">Setting</Link>
      </Menu.Item>
      <Menu.Item key="4">
        <div onClick={handleLogOut}>log out</div>
      </Menu.Item>
    </Menu>
  );
};

const Nav = () => {
  const handleNewProject = () => {
    history.replace(`/edit/${new Date().getTime()}`);
  };

  return (
    <header className="header">
      <div className="header-content">
        <SearchHeader />
        <div className="header-right">
          <div className="header-update">
            <IconFont type="icon-huiyuan" style={{ fontSize: '28px' }} />
            <span className="update-text">升级</span>
          </div>
          <div className="header-create" onClick={handleNewProject}>
            <IconFont type="icon-jiahao" style={{ fontSize: '28px' }} />
            <span className="create-text">创建设计</span>
          </div>
          <div className="header-user">
            <Dropdown
              overlay={menu}
              trigger={['click']}
              overlayClassName="avatar-dropdown"
              placement="bottomRight"
            >
              <Avatar src="https://joeschmoe.io/api/v1/random" />
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
