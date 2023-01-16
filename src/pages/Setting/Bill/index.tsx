import React from 'react';
import styles from './index.less';

const Bill = React.memo(() => {
    return (
        <div className={styles.bill}>
            <h2 className={styles.title}>账单</h2>
        </div>
    );
});

export default Bill;
