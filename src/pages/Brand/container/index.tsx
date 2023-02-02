import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { history } from '@umijs/max';
import { getBrandList, saveBrandItem } from '@/services/brand';

export interface kitItem {
    id: string;
    uuid: string;
    brandName: string;
    description: string;
    brandCover: string;
    brandType: number;
    logos?: any[];
    colors?: any[];
    fonts?: any[];
    activeFont: any;
}

interface BrandContextProps {
    /**
     * @name 是否已经有工具箱
     */
    isHaveKit: boolean;
    kitList: kitItem[];
    refreshBrandList: () => void;
}

export const BrandContext = React.createContext<BrandContextProps>(null as any);

/**
 * @description 品牌工具容器
 */
const BrandContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;

    const [kitList, setKitList] = useState([]);
    const [isInit, setIsInit] = useState(false);

    const isHaveKit = useMemo(() => {
        return !!kitList.length;
    }, [kitList]);

    const refreshBrandList = useCallback(async () => {
        try {
            const res = await getBrandList({
                current: 1,
                pageSize: 20,
            });
            const list = res?.list || [];
            setKitList(list);
            setIsInit(true);
            if (list.length === 1) {
                history.push(`/brand/${list[0]?.uuid}`);
            }
        } catch (error) {}
    }, []);

    const memoCtx = useMemo(() => {
        return {
            isHaveKit,
            kitList,
            refreshBrandList,
        };
    }, [isHaveKit, kitList]);

    useEffect(() => {
        refreshBrandList();
    }, []);

    return (
        <BrandContext.Provider value={memoCtx}>
            {isInit && children}
        </BrandContext.Provider>
    );
});

export default BrandContainer;
