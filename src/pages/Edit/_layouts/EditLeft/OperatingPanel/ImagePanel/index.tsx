import React from 'react';
import Adjust from './Adjust';
import Filter from './Filter';
// import Shadows from './Shadows';
import styles from './index.less';

export enum ImagePanelType {
    FILTER = 'FILTER',
    SHADOWS = 'SHADOWS',
    NONE = 'NONE',
}

const ImagePanel = React.memo(() => {
    return (
        <div className={styles.imagePanel}>
            <h2>编辑图像</h2>
            <Filter />
            {/* <Shadows /> */}
            <Adjust />
        </div>
    );
});

export default ImagePanel;
