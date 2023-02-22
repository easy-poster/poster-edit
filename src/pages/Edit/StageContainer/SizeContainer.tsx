import React, { useMemo, useState } from 'react';

interface SizeContextProps {
    sizeStage: number;
    setSizeStage: (val: number) => void;
}

export const SizeContext = React.createContext<SizeContextProps>(null as any);

/**
 * @description 画布大小调节
 */
const SizeContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;

    const [sizeStage, setSizeStage] = useState(100);

    const memoCtx = useMemo(() => {
        return {
            sizeStage,
            setSizeStage,
        };
    }, [sizeStage, setSizeStage]);

    return (
        <SizeContext.Provider value={memoCtx}>{children}</SizeContext.Provider>
    );
});

export default SizeContainer;
