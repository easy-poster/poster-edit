import React, { useMemo } from 'react';

interface CanvasContainerProps {
    currentIndex: number;
    list: any[];
}

export const CanvasContext = React.createContext<CanvasContainerProps>(null as any);

/**
 * @description canvas相关
 */
const CanvasContainer = React.memo<React.PropsWithChildren<{}>>((props) => {
    const { children } = props;

    const memoCtx = useMemo(() => {
        return {
            currentIndex: 0,
            list: [],
        };
    }, []);

    return <CanvasContext.Provider value={memoCtx}>{children}</CanvasContext.Provider>;
});

export default CanvasContainer;
