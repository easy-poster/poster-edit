import React, { useMemo, useState } from 'react';
import Adjust from './Adjust';
import Filter from './Filter';
import Shadows from './Shadows';
import DetailPanel from './Detail';
import styles from './index.less';

export enum ImagePanelType {
    FILTER = 'FILTER',
    SHADOWS = 'SHADOWS',
    NONE = 'NONE',
}

interface ImagePanelContextProps {
    detailType: ImagePanelType;
    setDetailType: (value: ImagePanelType) => void;
}

export const ImagePanelContext = React.createContext<ImagePanelContextProps>(
    null as any,
);

const ImagePanel = React.memo(() => {
    const [detailType, setDetailType] = useState(ImagePanelType.NONE);

    const isShowDetail = useMemo(() => {
        return detailType !== ImagePanelType.NONE;
    }, [detailType]);

    const memoCtx = useMemo(() => {
        return {
            detailType,
            setDetailType,
        };
    }, [detailType, setDetailType]);

    return (
        <ImagePanelContext.Provider value={memoCtx}>
            <div className={styles.imagePanel}>
                <h2>编辑图像</h2>
                <Filter />
                <Shadows />
                <Adjust />
                {isShowDetail && <DetailPanel />}
            </div>
        </ImagePanelContext.Provider>
    );
});

export default ImagePanel;
