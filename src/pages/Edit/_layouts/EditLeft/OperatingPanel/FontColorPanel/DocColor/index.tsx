import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { ColorResult } from 'react-color';
import { Popover } from 'antd';
import cn from 'classnames';
import { IconFont } from '@/const';
import BridgeController from '@/helper/bridge/BridgeController';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';
import { Gradient, Pattern } from 'fabric/fabric-impl';
import styles from './index.less';
import ColorPicker from '@/components/ColorPicker';

type colorProps = string | Pattern | Gradient | undefined;

const CurrentColorPicker = React.memo(() => {
    const { selectObj } = useContext(SelectContext);

    const [currentColor, setCurrentColor] = useState<any>(
        () => selectObj?.fill ?? '',
    );

    const handleChangePickerColor = (color: ColorResult) => {
        if (color?.hex) {
            setCurrentColor(color.hex);
            BridgeController.SetObjectStyle({
                fill: color.hex,
            });
        }
    };

    const handleOpenChange = useCallback(
        (open: boolean) => {
            if (!open) {
                BridgeController.setModified();
            }
        },
        [selectObj?.fill, currentColor],
    );

    useEffect(() => {
        setCurrentColor(selectObj?.fill ?? '');
    }, [selectObj?.fill]);

    useEffect(() => {
        return () => {
            BridgeController.setModified();
        };
    }, []);

    return (
        <Popover
            autoAdjustOverflow={true}
            destroyTooltipOnHide
            placement="bottomLeft"
            onOpenChange={handleOpenChange}
            content={
                <ColorPicker
                    activeColor={currentColor}
                    onChangeColor={(color: ColorResult) =>
                        handleChangePickerColor(color)
                    }
                />
            }
            trigger="click"
        >
            <div className={cn(styles.currentWrap)}>
                <IconFont type="icon-xiaoyuan" style={{ fontSize: '32px' }} />
            </div>
        </Popover>
    );
});

const RenderItem = React.memo(
    ({
        item,
        activeColor,
        handleClick,
    }: {
        item: colorProps;
        activeColor: colorProps;
        handleClick: (item: colorProps) => void;
    }) => {
        return (
            <div
                className={cn(styles.colorWrap, {
                    [styles.active]: item === activeColor,
                })}
                onClick={() => handleClick(item)}
            >
                <div
                    className={styles.colorItem}
                    style={{ backgroundColor: item as string }}
                ></div>
            </div>
        );
    },
);

/**
 * @description 主题颜色表
 */
const DocColor = React.memo(() => {
    const { selectObj } = useContext(SelectContext);
    const [activeColor, setActiveColor] = useState<colorProps>();

    const handleClick = useCallback((item: colorProps) => {
        setActiveColor(item);
        BridgeController.SetObjectStyle({
            fill: item,
        });
    }, []);

    const colorList = useMemo(() => {
        let objs = selectObj?.canvas?._objects;
        return [...new Set(objs?.map((it) => it?.fill))];
    }, [selectObj?.canvas?._objects]);

    return (
        <div className={styles.docColorWrap}>
            <h3>主题颜色</h3>
            <div className={styles.docContent}>
                <CurrentColorPicker />
                {colorList.map((item, index) => {
                    return (
                        <RenderItem
                            item={item}
                            activeColor={activeColor}
                            handleClick={handleClick}
                            key={index}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default DocColor;
