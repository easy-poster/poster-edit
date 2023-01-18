import { IconFont } from '@/const';
import { List } from 'antd';
import React from 'react';
import styles from './index.less';

const FontList = React.memo(() => {
    const LIST = [
        {
            fontFamily: 'Ebrima Bold',
        },
        {
            fontFamily: 'Courier New Bold',
        },
        {
            fontFamily: 'Adrv Bold',
        },
    ];

    return (
        <div className={styles.fontList}>
            <List
                itemLayout="horizontal"
                dataSource={LIST}
                renderItem={(item) => (
                    <div className={styles.text}>
                        <p style={{ fontFamily: item.fontFamily }}>
                            {item.fontFamily}
                        </p>
                        <div className={styles.delBtn}>
                            <IconFont type="icon-shanchu" />
                        </div>
                    </div>
                )}
            />
        </div>
    );
});

export default FontList;
