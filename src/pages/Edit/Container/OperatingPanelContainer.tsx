import React, { useMemo, useState } from 'react';

export enum OperatingPanelType {
    IMAGE = 'IMAGE',
    FONTFAMILY = 'FONTFAMILY',
    FONTSTYLE = 'FONTSTYLE',
    FONTCOLOR = 'FONTCOLOR',
    NONE = 'NONE',
}

interface OperatingPanelContextProps {
    panelType: OperatingPanelType;
    setPanelType: (val: OperatingPanelType) => void;
}

export const OperatingPanelContext =
    React.createContext<OperatingPanelContextProps>(null as any);

/**
 *  @description 操作面板控制逻辑
 */
const OperatingPanelContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;

    const [panelType, setPanelType] = useState(OperatingPanelType.NONE);

    const memoCtx = useMemo(() => {
        return {
            panelType,
            setPanelType,
        };
    }, [panelType, setPanelType]);

    return (
        <OperatingPanelContext.Provider value={memoCtx}>
            {children}
        </OperatingPanelContext.Provider>
    );
});

export default OperatingPanelContainer;
