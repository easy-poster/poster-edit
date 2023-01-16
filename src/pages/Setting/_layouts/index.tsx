import { Outlet } from '@umijs/max';
import SettingMenu from '../components/SettingMenu';
import styles from './index.less';

const SettingLayout = () => {
    return (
        <div className={styles.main}>
            <SettingMenu />
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};

export default SettingLayout;
