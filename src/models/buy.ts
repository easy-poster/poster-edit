import { useCallback, useState } from 'react';

export default () => {
    const [isShowBuy, setIsShowBuy] = useState(false);

    const setShowBuy = useCallback((isShow) => {
        setIsShowBuy(isShow);
    }, []);

    return {
        isShowBuy,
        setShowBuy,
    };
};
