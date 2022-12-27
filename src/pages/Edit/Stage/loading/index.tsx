import { Spin } from 'antd';
import React from 'react';
import styles from './index.less';

const Loading = React.memo(() => {
    return (
        <div className={styles.loading}>
            <Spin
                tip="稍等一下~"
                size="large"
                className={styles.loading}
            ></Spin>
        </div>
    );
});

export default Loading;
