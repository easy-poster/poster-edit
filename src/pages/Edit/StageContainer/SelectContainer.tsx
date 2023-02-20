import { FabricObjectType } from '@/const';
import BridgeEmitter, { F2N } from '@/helper/bridge/BridgeEmitter';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface SelectContextProps {
    selectType: FabricObjectType | string;
    selectObjs?: FabricObject[];
}

export const SelectContext = React.createContext<SelectContextProps>(
    null as any,
);

const SelectContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;

    const [selectObjs, setSelectObjs] = useState<FabricObject[]>();
    const [selectType, setSelectType] = useState('');

    const memoCtx = useMemo(() => {
        return {
            selectType,
            selectObjs,
        };
    }, [selectObjs, selectType]);

    /**
     * @description 选中画布对象时
     */
    const handleSelect = useCallback((value?: FabricObject[]) => {
        if (value) {
            setSelectObjs(value);
            if (value.length === 1) {
                setSelectType(value[0]?.type || '');
            } else {
                setSelectType('');
            }
        } else {
            // 没有选中时
            setSelectObjs(undefined);
            setSelectType('');
        }
    }, []);

    useEffect(() => {
        BridgeEmitter.on(F2N.SELECT, handleSelect);
        return () => {
            BridgeEmitter.off(F2N.SELECT, handleSelect);
        };
    }, []);

    return (
        <SelectContext.Provider value={memoCtx}>
            {children}
        </SelectContext.Provider>
    );
});

export default SelectContainer;
