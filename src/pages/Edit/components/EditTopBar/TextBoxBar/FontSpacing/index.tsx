import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IconFont } from '@/const';
import { Divider, Popover, Slider, Tooltip } from 'antd';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';
import BarButton from '../../components/BarButton';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';

const FontSpacing = React.memo(() => {
    const { selectObj } = useContext(SelectContext);

    const [open, setOpen] = useState(false);

    const [charVal, setCharVal] = useState(() => selectObj?.charSpacing);
    const [lineHeight, setLineHeight] = useState(
        () => selectObj?.lineHeight || 1,
    );

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    // const handleCharSpacing = useCallback((value: number) => {
    //     setCharVal(value);
    // }, [])

    // const handleLineHeight = useCallback((value: number) => {
    //     setLineHeight(value);
    // }, []);

    const handleCharSpacingAfter = useCallback((value: number) => {
        BridgeController.SetFontStyle({
            charSpacing: value,
        });
    }, []);

    const handleLineHeightAfter = useCallback((value: number) => {
        BridgeController.SetFontStyle({
            lineHeight: value,
        });
    }, []);

    const SliderSpacing = () => {
        return (
            <div className={styles.sliderWrap}>
                <div className={styles.sliderIem}>
                    <p>字间距</p>
                    <Slider
                        min={-200}
                        max={1000}
                        defaultValue={charVal}
                        // onChange={handleCharSpacing}
                        onAfterChange={handleCharSpacingAfter}
                    />
                </div>
                <Divider />
                <div className={styles.sliderItem}>
                    <p>行间距</p>
                    <Slider
                        min={0.6}
                        max={6}
                        step={0.1}
                        defaultValue={lineHeight}
                        // onChange={handleLineHeight}
                        onAfterChange={handleLineHeightAfter}
                    />
                </div>
            </div>
        );
    };

    useEffect(() => {
        setCharVal(selectObj?.charSpacing || 0);
    }, [selectObj?.charSpacing]);

    useEffect(() => {
        setLineHeight(selectObj?.lineHeight || 0);
    }, [selectObj?.lineHeight]);

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
