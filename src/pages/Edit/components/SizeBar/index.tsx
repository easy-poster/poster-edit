import React, { useContext, useState } from 'react';
import { Slider, Tooltip } from 'antd';
import { IconFont, MAX_SIZE, MIN_SIZE } from '@/const';
import BridgeController from '@/helper/bridge/BridgeController';
import { SizeContext } from '../../StageContainer/SizeContainer';
import styles from './index.less';

const SizeBar = React.memo(() => {
    const { sizeStage, setSizeStage } = useContext(SizeContext);
    const [isAutoSize, setIsAutoSize] = useState(false);

    const handleAutoSizeOver = () => {
        setIsAutoSize(true);
    };

    const handleChangeAutoSize = () => {
        BridgeController.ResizeFitStage();
    };

    const handleChangeSize = (value: number) => {
        if (!value) return;
        setSizeStage(value);
        let zoom = +(value / 100).toFixed(2);
        BridgeController.ResizeStage({
            zoom,
        });
    };

    return (
        <div className={styles.sizebar}>
            <Slider
                tooltip={{
                    formatter: null,
                }}
                min={MIN_SIZE}
                max={MAX_SIZE}
                value={sizeStage}
                onChange={handleChangeSize}
            />
            <span
                className={styles.sizemid}
                onMouseOver={handleAutoSizeOver}
                onMouseLeave={() => setIsAutoSize(false)}
                onClick={handleChangeAutoSize}
            >
                {isAutoSize ? (
                    <Tooltip
                        title="适应屏幕"
                        overlayInnerStyle={{ borderRadius: '18px' }}
                        open={true}
                    >
                        <IconFont
                            type="icon-zishiying"
                            style={{ fontSize: '28px' }}
                        />
                    </Tooltip>
                ) : (
                    `${sizeStage}%`
                )}
            </span>
        </div>
    );
});

export default SizeBar;
