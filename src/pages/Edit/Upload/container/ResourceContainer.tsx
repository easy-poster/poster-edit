import { getResourceList, Resource } from '@/services/resource';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface ResourceContextProps {
    resourceList: Resource[];
    getResource: () => void;
    currentPage: number;
    setCurrentPage: (val: number) => void;
}

export const ResourceContext = React.createContext<ResourceContextProps>(
    null as any,
);

/**
 * @description 资源容器
 */
const ResourceContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;
    const [resourceList, setResourceList] = useState<Resource[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageTotal, setPageTotal] = useState(0);

    const getResource = useCallback(async () => {
        try {
            let res = await getResourceList({
                current: currentPage,
                pageSize: 20,
            });
            let list = res?.list || [];
            let total = res.total;
            if (list?.length) {
                setResourceList([...resourceList, ...list]);
                setPageTotal(total);
            }
        } catch (error) {}
    }, [currentPage]);

    const memoCtx = useMemo(() => {
        return {
            resourceList,
            getResource,
            currentPage,
            setCurrentPage,
        };
    }, [resourceList, getResource, currentPage, setCurrentPage]);

    useEffect(() => {
        getResource();
    }, []);

    return (
        <div>
            <ResourceContext.Provider value={memoCtx}>
                {children}
            </ResourceContext.Provider>
        </div>
    );
});

export default ResourceContainer;
