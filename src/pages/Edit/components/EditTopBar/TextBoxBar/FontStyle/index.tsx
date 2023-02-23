import React from 'react';
import styles from './index.less';

const FontStyle = React.memo(() => {
    return <div className={styles.fontStylesWrap}>风格</div>;
});

export default FontStyle;
