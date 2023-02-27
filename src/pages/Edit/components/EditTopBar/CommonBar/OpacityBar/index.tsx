import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IconFont } from '@/const';
import { Popover, Slider, Tooltip } from 'antd';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';
import BarButton from '../../components/BarButton';
import BridgeController from '@/helper/bridge/BridgeController';
import styles from './index.less';

const OpacityBar = React.memo(() => {
    const { selectObj } = useContext(SelectContext);

    const [open, setOpen] = useState(false);

    const [opacity, setOpacity] = useState(() => selectObj?.opacity);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const handleCharSpacing = useCallback((value: number) => {
        BridgeController.SetFontStyle({
            opacity: value,
        });
    }, []);

    // const handleLineHeight = useCallback((value: number) => {
    //     setLineHeight(value);
    // }, []);

    const handleCharSpacingAfter = useCallback((value: number) => {
        setOpacity(value);
        BridgeController.SetFontStyle({
            opacity: value,
        });
    }, []);

    const SliderSpacing = () => {
        return (
            <div className={styles.sliderWrap}>
                <div className={styles.sliderIem}>
                    <p>透明度</p>
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={opacity}
                        tooltip={{ formatter: null }}
                        // onChange={handleCharSpacing}
                        onAfterChange={handleCharSpacingAfter}
                    />
                </div>
            </div>
        );
    };

    useEffect(() => {
        setOpacity(selectObj?.opacity || 0);
    }, [selectObj?.opacity]);

    return (
        <div className={styles.fontSpacingWrap}>
            <Popover
                content={<SliderSpacing />}
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
                showArrow={false}
                placement="bottomRight"
                overlayClassName={styles.popoverSpacing}
            >
                <Tooltip title="透明度" placement="top">
                    <BarButton>
                        <IconFont
                            type="icon-touming"
                            style={{ fontSize: '24px' }}
                        />
                    </BarButton>
                </Tooltip>
            </Popover>
        </div>
    );
});

export default OpacityBar;
