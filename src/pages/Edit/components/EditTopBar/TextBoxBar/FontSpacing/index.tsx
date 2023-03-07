import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IconFont } from '@/const';
import { Divider, Popover, Slider, Tooltip } from 'antd';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';
import BarButton from '../../components/BarButton';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';

const SliderSpacing = React.memo(() => {
    const { selectObj } = useContext(SelectContext);

    const [charVal, setCharVal] = useState(0);
    const [lineHeight, setLineHeight] = useState(0);

    const handleCharSpacing = useCallback((value: number) => {
        setCharVal(value);
        BridgeController.SetObjectStyle({
            charSpacing: value,
        });
    }, []);

    const handleLineHeight = useCallback((value: number) => {
        setLineHeight(value);
        BridgeController.SetObjectStyle({
            lineHeight: value,
        });
    }, []);

    const handleCharSpacingAfter = useCallback((value: number) => {
        BridgeController.SetedObjectStyle({
            charSpacing: value,
        });
    }, []);

    const handleLineHeightAfter = useCallback((value: number) => {
        BridgeController.SetedObjectStyle({
            lineHeight: value,
        });
    }, []);

    useEffect(() => {
        setCharVal(selectObj?.charSpacing || 0);
    }, [selectObj?.charSpacing]);

    useEffect(() => {
        setLineHeight(selectObj?.lineHeight || 0);
    }, [selectObj?.lineHeight]);

    return (
        <div className={styles.sliderWrap}>
            <div className={styles.sliderIem}>
                <p>字间距</p>
                <Slider
                    min={-100}
                    max={1000}
                    step={1}
                    tooltip={{
                        formatter: (value = 0) => Math.round(value),
                    }}
                    value={charVal}
                    onChange={handleCharSpacing}
                    onAfterChange={handleCharSpacingAfter}
                />
            </div>
            <Divider />
            <div className={styles.sliderItem}>
                <p>行间距</p>
                <Slider
                    min={0.8}
                    max={5}
                    step={0.1}
                    tooltip={{
                        formatter: (value = 0) => value,
                    }}
                    value={lineHeight}
                    onChange={handleLineHeight}
                    onAfterChange={handleLineHeightAfter}
                />
            </div>
        </div>
    );
});

const FontSpacing = React.memo(() => {
    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    return (
        <div className={styles.fontSpacingWrap}>
            <Popover
                content={<SliderSpacing />}
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
                showArrow={false}
                placement="bottomLeft"
                overlayClassName={styles.popoverSpacing}
            >
                <Tooltip title="字间距" placement="top">
                    <BarButton>
                        <IconFont
                            type="icon-zijianju"
                            style={{ fontSize: '24px' }}
                        />
                    </BarButton>
                </Tooltip>
            </Popover>
        </div>
    );
});

export default FontSpacing;
