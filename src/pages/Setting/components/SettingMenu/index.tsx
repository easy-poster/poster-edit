import { Link } from '@umijs/max';
import { useLocation } from '@umijs/max';
import { SETTING_MENU_LAYOUT, IconFont } from '@/const';
import cx from 'classnames';
import styles from './index.less';

const SettingMenu = () => {
    const { pathname } = useLocation();

    return (
        <div className={styles.menuWrap}>
            <nav className={styles.menuNav}>
                <div className={styles.menuTitle}>
                    <Link to={'/'} className={styles.back}>
                        <IconFont
                            type={'icon-xiangzuo'}
                            style={{ fontSize: '24px' }}
                        />
                        <div className={styles.title}>设置</div>
                    </Link>
                </div>
                <div className={styles.menuList}>
                    {SETTING_MENU_LAYOUT.map((item) => {
                        return (
                            <Link
                                key={item.id}
                                to={item.route}
                                className={cx(styles.menuItem, {
                                    [styles.activeItem]:
                                        pathname === item.route,
                                })}
                            >
                                <div className={styles.menuIcon}>
                                    <IconFont
                                        type={item.icon}
                                        style={{ fontSize: '24px' }}
                                    />
                                </div>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default SettingMenu;
