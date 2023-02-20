import React from 'react';
import cn from 'classnames';
import { history } from '@umijs/max';
import { MENU_EDIT, IconFont } from '@/const';
import LogoColor from '@/assets/logo/color.svg';
import styles from './index.less';

const EditMenu = React.memo(
    ({
        activeTab,
        setActiveTab,
    }: {
        activeTab: number;
        setActiveTab: (index: number) => void;
    }) => {
        return (
            <div className={styles.editMenu}>
                <nav className={styles.editNav}>
                    <div className={styles.editMenuLogo}>
                        <img
                            src={LogoColor}
                            onClick={() => history.push('/')}
                        />
                    </div>
                    <div className={styles.editMenuList}>
                        {MENU_EDIT.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className={cn(styles.editMenuItem, {
                                        [styles.activeItem]:
                                            activeTab === item.id,
                                    })}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    <div className={styles.editMenuIcon}>
                                        <IconFont
                                            type={item.icon}
                                            style={{ fontSize: '18px' }}
                                        />
                                    </div>
                                    <span>{item.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </nav>
            </div>
        );
    },
);

export default EditMenu;
