import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IconFont } from '@/const';
import { Popover, Slider, Tooltip } from 'antd';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';
import BarButton from '../../components/BarButton';
import BridgeController from '@/helper/bridge/BridgeController';
import styles from './index.less';

const SliderOpacity = React.memo(() => {
    const { selectObj } = useContext(SelectContext);
    const [opacity, setOpacity] = useState(() => selectObj?.opacity);

    const handleOpacity = useCallback((value: number) => {
        setOpacity(value);
        BridgeController.SetObjectStyle({
            opacity: value,
        });
    }, []);

    const handleOpacityAfter = useCallback((value: number) => {
        setOpacity(value);
        BridgeController.SetedObjectStyle({
            opacity: value,
        });
    }, []);

    useEffect(() => {
        setOpacity(selectObj?.opacity || 0);
    }, [selectObj?.opacity]);

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
                    onChange={handleOpacity}
                    onAfterChange={handleOpacityAfter}
                />
            </div>
        </div>
    );
});

const OpacityBar = React.memo(() => {
    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    return (
        <div className={styles.fontSpacingWrap}>
            <Popover
                content={<SliderOpacity />}
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
