import React, { useCallback } from 'react';
import { Link, history, useModel } from '@umijs/max';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { IconFont } from '@/const';
// import SearchHeader from '../SearchHeader';
import { storage } from '@/utils';
import avatarImg from '@/assets/avatar.jpg';
import { logout } from '@/services/user';
import { saveProject } from '@/services/project';
import styles from './index.less';
import CreatePopover from './CreatePopover';

const Nav = () => {
    const { initialState } = useModel('@@initialState');
    const user = initialState?.currentUser;

    // 升级
    const { setShowBuy } = useModel('buy');
    const handleUpdate = () => {
        setShowBuy(true);
    };

    const handleLogOut = async () => {
        try {
            await logout();
        } catch (error) {}
        storage.logout();
    };

    // 下拉菜单
    const items: MenuProps['items'] = [
        {
            label: (
                <Link to="#">
                    {user?.username}
                    <p style={{ color: 'rgb(111, 111, 125)' }}>{user?.email}</p>
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

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                {/* <SearchHeader /> */}
                <div className={styles.headerRight}>
                    <div className={styles.headerUpdate} onClick={handleUpdate}>
                        <IconFont
                            type="icon-huiyuan"
                            style={{ fontSize: '28px' }}
                        />
                        <span className={styles.updateText}>升级</span>
                    </div>
                    <CreatePopover />
                    <div className={styles.headerUser}>
                        <Dropdown
                            menu={{ items }}
                            trigger={['click']}
                            overlayClassName={styles.avatarDropdown}
                            placement="bottomRight"
                        >
                            <Avatar src={user?.headImg} size={50} />
                        </Dropdown>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Nav;
