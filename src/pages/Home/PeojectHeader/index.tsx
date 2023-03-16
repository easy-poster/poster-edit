import React from 'react';
import HeaderTitle from '@/components/HeaderTitle';
import styles from './index.less';

const PeojectHeader = React.memo(() => {
    return (
        <div className={styles.headerWrap}>
            <HeaderTitle title="最近的作品" />
        </div>
    );
});

export default PeojectHeader;
