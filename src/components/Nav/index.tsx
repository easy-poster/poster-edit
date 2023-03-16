import CreatePopover from './CreatePopover';
import styles from './index.less';

const Nav = () => {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.headerRight}>
                    <CreatePopover />
                </div>
            </div>
        </header>
    );
};

export default Nav;
