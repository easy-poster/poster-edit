import React from 'react';
import styles from './index.less';

const Footer = React.memo(() => {
    return (
        <footer className={styles.footer}>
            <p className={styles.copyRight}>
                Copyright © 2023 oops.pub保留所有权利，仅供交流学习，无商业用途
            </p>
            <div className={styles.beian}>
                <a
                    href="https://beian.miit.gov.cn/"
                    target="_blank"
                    rel="noreferrer"
                >
                    蜀ICP备2023006300号
                </a>
            </div>
        </footer>
    );
});

export default Footer;
