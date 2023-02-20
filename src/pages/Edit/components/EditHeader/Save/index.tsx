import React from 'react';
import { IconFont } from '@/const';
import styles from './index.less';

const Save = React.memo(() => {
    return (
        <div className={styles.saveWrap}>
            <IconFont
                type="icon-yunshangchuan"
                style={{ fontSize: '28px', color: '#FFF' }}
            />
        </div>
    );
});

export default Save;
