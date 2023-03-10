import { FabricObjectType } from '@/const';
import BridgeEmitter, { F2N } from '@/helper/bridge/BridgeEmitter';
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    OperatingPanelContext,
    OperatingPanelType,
} from './OperatingPanelContainer';

interface SelectContextProps {
    selectType: FabricObjectType | string;
    selectObjs?: FabricObject[] | FabricObject<fabric.Group>;
    selectObj?: FabricObject;
}

export const SelectContext = React.createContext<SelectContextProps>(
    null as any,
);

/**
 * @description 画布内容选中时
 */
const SelectContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;

    const { setPanelType } = useContext(OperatingPanelContext);
    const [selectObjs, setSelectObjs] = useState<
        FabricObject[] | FabricObject<fabric.Group>
    >();
    const [selectType, setSelectType] = useState<FabricObjectType | ''>('');
    const [selectObj, setSelectObj] = useState<FabricObject>();

    const memoCtx = useMemo(() => {
        return {
            selectType,
            selectObjs,
            selectObj,
        };
    }, [selectObj, selectObjs, selectType]);

    /**
     * @description 选中画布对象时
     */
    const handleSelect = useCallback(
        (value?: FabricObject[] | FabricObject<fabric.Group>) => {
            if (value) {
                if (value?.length === 1) {
                    if (value[0].type === FabricObjectType.GROUP) {
                        // 如果是组合
                        setSelectType(FabricObjectType.GROUP);
                    } else {
                        // 选中一个元素
                        setSelectType(value[0]?.type || '');
                    }
                } else {
                    // 选中多个元素可设置组合
                    setSelectType(FabricObjectType.GROUP);
                }
                setSelectObj(value[0]);
                setSelectObjs(value);
            } else {
                // 没有选中时
                setSelectObj(undefined);
                setSelectObjs(undefined);
                setSelectType('');
            }
            setPanelType(OperatingPanelType.NONE);
        },
        [],
    );

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
