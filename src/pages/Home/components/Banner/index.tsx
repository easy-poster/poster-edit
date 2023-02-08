import React from 'react';
import styles from './index.less';

const Banner = React.memo(() => {
    return <div className={styles.bannerWrap}>banner</div>;
});

export default Banner;
