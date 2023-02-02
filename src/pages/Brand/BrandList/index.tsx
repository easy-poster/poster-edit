import React, { useContext, useEffect, useMemo, useState } from 'react';
import { List } from 'antd';
import { BrandContext, kitItem } from '../container';
import BrandItem from './BrandItem';
import DelKitModal from '../Modal/DelKit';
import styles from './index.less';
import CopyKitModal from '../Modal/CopyKit';

interface BrandListContextProps {
    isDelOpen: boolean;
    setIsDelOpen: (bool: boolean) => void;
    isCopyOpen: boolean;
    setIsCopyOpen: (bool: boolean) => void;
    activeItem?: kitItem;
    setActiveItem: (item: kitItem) => void;
}

export const BrandListContext = React.createContext<BrandListContextProps>(
    null as any,
);

const BrandList = React.memo(() => {
    const { kitList } = useContext(BrandContext);
    const [isDelOpen, setIsDelOpen] = useState(false);
    const [isCopyOpen, setIsCopyOpen] = useState(false);
    const [activeItem, setActiveItem] = useState<kitItem>();

    const memoCtx = useMemo(() => {
        return {
            isDelOpen,
            setIsDelOpen,
            isCopyOpen,
            setIsCopyOpen,
            activeItem,
            setActiveItem,
        };
    }, [isDelOpen, isCopyOpen, activeItem]);

    return (
        <BrandListContext.Provider value={memoCtx}>
            <List
                className={styles.brandKitList}
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 2,
                    xl: 3,
                    xxl: 4,
                }}
                dataSource={kitList}
                renderItem={(item) => <BrandItem item={item} />}
            />
            <DelKitModal />
            <CopyKitModal />
        </BrandListContext.Provider>
    );
});

export default BrandList;
