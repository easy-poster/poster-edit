import React, { useCallback } from 'react';
import BarButton from '../components/BarButton';
import styles from './index.less';

const ImageBar = React.memo(() => {
    const handleEdit = useCallback(() => {
        console.log('editImg');
    }, []);

    const handleFlip = useCallback(() => {
        console.log('flip');
    }, []);

    return (
        <div className={styles.imageBarWrap}>
            <BarButton onClick={handleEdit}>编辑图像</BarButton>
            <BarButton onClick={handleFlip}>翻转</BarButton>
        </div>
    );
});

export default ImageBar;
