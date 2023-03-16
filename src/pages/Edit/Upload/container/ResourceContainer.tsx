import { getResourceList } from '@/services/resource';
import { epImage } from '@/utils/db';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface ResourceContextProps {
    resourceList: epImage[];
    getResource: () => void;
}

export const ResourceContext = React.createContext<ResourceContextProps>(
    null as any,
);

/**
 * @description 资源容器
 */
const ResourceContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;
    const [resourceList, setResourceList] = useState<epImage[]>([]);

    const getResource = useCallback(async () => {
        try {
            let res = await getResourceList();
            setResourceList(res || []);
        } catch (error) {}
    }, []);

    const memoCtx = useMemo(() => {
        return {
            resourceList,
            getResource,
        };
    }, [resourceList, getResource]);

    useEffect(() => {
        getResource();
    }, []);

    return (
        <ResourceContext.Provider value={memoCtx}>
            {children}
        </ResourceContext.Provider>
    );
});

export default ResourceContainer;
