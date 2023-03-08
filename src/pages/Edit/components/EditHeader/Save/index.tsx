import React from 'react';
import { IconFont } from '@/const';
import styles from './index.less';

const Save = React.memo(() => {
    return (
        <div className={styles.saveWrap}>
            <IconFont
                type="icon-yunshangchuan"
                // type="icon-ai35"
                style={{ fontSize: '28px', color: '#ababb8' }}
            />
        </div>
    );
});

export default Save;
