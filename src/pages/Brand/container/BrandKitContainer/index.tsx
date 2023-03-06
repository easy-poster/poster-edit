import { useParams } from '@umijs/max';
import { getBrandItemDetail } from '@/services/brand';
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { BrandContext, kitItem } from '..';

interface BrandKitContextProps {
    kitInfo?: kitItem;
    getDetail: (uuid: string) => void;
}

export const BrandKitContext = React.createContext<BrandKitContextProps>(
    null as any,
);

const BrandKitContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;

    const params = useParams();
    const [kitInfo, setKitInfo] = useState();

    const getDetail = useCallback(async (uuid: string) => {
        try {
            const res = await getBrandItemDetail({
                id: uuid,
            });
            setKitInfo(res);
        } catch (error) {}
    }, []);

    useEffect(() => {
        if (params?.id) {
            getDetail(params?.id);
        }
    }, [params?.id]);

    const memoCtx = useMemo(() => {
        return {
            kitInfo,
            getDetail,
        };
    }, [kitInfo]);

    return (
        <BrandKitContext.Provider value={memoCtx}>
            {children}
        </BrandKitContext.Provider>
    );
});

export default BrandKitContainer;
