import React, { useCallback } from 'react';
import { Link, history, useModel, useSelector } from '@umijs/max';
import { Avatar, Dropdown, Menu } from 'antd';
import { IconFont } from '@/const';
import SearchHeader from '../SearchHeader';
import { db } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';
import './index.less';

const menu = () => {
  const handleLogOut = () => {
    history.push('/login');
  };

  const items = [
    {
      label: (
        <Link to="/user">
          MOMO
          <p style={{ color: 'rgb(111, 111, 125)' }}>418788724@qq.com</p>
        </Link>
      ),
      key: 1,
    },
    {
      label: <Link to="/setting">设置</Link>,
      key: 2,
    },
    {
      label: <div onClick={handleLogOut}>退出</div>,
      key: 3,
    },
  ];

  return <Menu items={items} />;
};

const Nav = () => {
  const { userId } = useSelector((state: any) => {
    return {
      userId: state.user.userId,
    };
  });

  const handleNewProject = useCallback(async () => {
    if (!userId) return;
    try {
      let count = await db.epProject
        .where({
          userId: userId,
        })
        .count();

      let uuid = uuidv4();
      const id = await db.epProject.add({
        title: `title_${count + 1}`,
        userId: userId,
        uuid: uuid,
        createTime: new Date(),
        updateTime: new Date(),
        width: 720,
        height: 480,
        background: '#FFF',
      });
      if (id) {
        history.push(`/edit/${uuid}`);
      }
    } catch (error) {
      console.error('新建失败：', error);
    }
  }, [userId]);

  // 升级
  const { setShowBuy } = useModel('buy');
  const handleUpdate = () => {
    setShowBuy(true);
  };

  return (
    <header className="header">
      <div className="header-content">
        <SearchHeader />
        <div className="header-right">
          <div className="header-update" onClick={handleUpdate}>
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
              <Avatar src="https://joeschmoe.io/api/v1/random" size={50} />
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
