import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ColorResult } from 'react-color';
import { Popover } from 'antd';
import cn from 'classnames';
import { DEFCOLOR, IconFont } from '@/const';
import BridgeController from '@/helper/bridge/BridgeController';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';
import styles from './index.less';
import ColorPicker from '@/components/ColorPicker';

const CurrentColorPicker = React.memo(() => {
    const { selectObj } = useContext(SelectContext);

    const [currentColor, setCurrentColor] = useState<any>();

    const handleChangePickerColor = (color: ColorResult) => {
        if (color?.hex) {
            setCurrentColor(color.hex);
            BridgeController.setWorkAreaBg('COLOR', color.hex);
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
        handleClick,
    }: {
        item: string;
        handleClick: (item: string) => void;
    }) => {
        return (
            <div
                className={cn(styles.colorWrap)}
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
    const handleClick = useCallback((item: string) => {
        BridgeController.setWorkAreaBg('COLOR', item);
        BridgeController.setModified();
    }, []);

    return (
        <div className={styles.docColorWrap}>
            <h3>背景颜色</h3>
            <div className={styles.docContent}>
                <CurrentColorPicker />
                {DEFCOLOR.map((item, index) => {
                    return (
                        <RenderItem
                            item={item}
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
