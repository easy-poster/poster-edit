import React from 'react';
import GroupOperation from './GroupOperation';
import styles from './index.less';

const GroupBar = React.memo(() => {
    return (
        <div className={styles.groupBarWrap}>
            <GroupOperation />
        </div>
    );
});

export default GroupBar;
