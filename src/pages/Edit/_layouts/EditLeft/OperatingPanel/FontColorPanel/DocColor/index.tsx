import React, { useCallback, useMemo, useState } from 'react';
import { Button, List, Popover } from 'antd';
import cn from 'classnames';
import { colorItemProps } from '..';
import styles from './index.less';
import { IconFont } from '@/const';
import ColorPicker from '@/pages/Brand/components/ColorPicker';
import { ColorResult } from 'react-color';
import BridgeController from '@/helper/bridge/BridgeController';

const CurrentColor = React.memo(() => {
    const [currentColor, setCurrentColor] = useState<string>();

    const handleChangePickerColor = (color: ColorResult) => {
        if (color?.hex) {
            setCurrentColor(color.hex);
            BridgeController.SetedObjectStyle({
                fill: color.hex,
            });
        }
    };

    return (
        <Popover
            autoAdjustOverflow={true}
            destroyTooltipOnHide
            placement="bottomLeft"
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

/**
 * @description 主题颜色表
 */
const DocColor = React.memo(() => {
    const [activeColor, setActiveColor] = useState<string>();

    const LIST = useMemo(() => {
        let arr = [];
        for (let i = 0; i < 7; i++) {
            arr.push({
                id: i + 1,
                value: `#E${i < 10 ? '0' + i : i}`,
                type: '主题颜色',
            });
        }
        return arr;
    }, []);

    const handleClick = useCallback((item: colorItemProps) => {
        setActiveColor(item.value);
    }, []);

    const RenderItem = ({ item }: { item: colorItemProps }) => {
        return (
            <div
                className={cn(styles.colorWrap, {
                    [styles.active]: item.value === activeColor,
                })}
                onClick={() => handleClick(item)}
            >
                <div
                    className={styles.colorItem}
                    style={{ backgroundColor: item.value }}
                ></div>
            </div>
        );
    };

    return (
        <div className={styles.docColorWrap}>
            <h3>主题颜色</h3>
            <div className={styles.docContent}>
                <CurrentColor />{' '}
                {LIST.map((item) => {
                    return <RenderItem item={item} key={item.id} />;
                })}
            </div>
        </div>
    );
});

export default DocColor;
