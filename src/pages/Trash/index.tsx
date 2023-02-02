import React from 'react';
import styles from './index.less';

const Trash = React.memo(() => {
    return <div className={styles.trashWrap}>Trash</div>;
});

export default Trash;
