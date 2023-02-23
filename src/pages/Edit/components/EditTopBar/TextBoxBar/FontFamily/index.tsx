import React, { useCallback, useState } from 'react';
import { IconFont } from '@/const';
import BarButton from '../../components/BarButton';
import styles from './index.less';

const FontFamily = React.memo(() => {
    const [fontFamily, setFontFamily] = useState('微软雅黑');

    const handleClick = useCallback(() => {}, []);

    return (
        <div className={styles.familyWrap} onClick={handleClick}>
            <span>{fontFamily}</span>
            <IconFont type="icon-xiangxia" style={{ fontSize: '24px' }} />
        </div>
    );
});

export default FontFamily;
