import React, { useState } from 'react';
import { Slider, Tooltip } from 'antd';
import { IconFont, MAX_SIZE, MIN_SIZE } from '@/const';
import './index.less';
import { useModel } from '@umijs/max';

const SizeBar = () => {
    const { sizeStage, setSizeStage } = useModel('sizeStage');
    const [isAutoSize, setIsAutoSize] = useState(false);

    const handleAutoSizeOver = () => {
        setIsAutoSize(true);
    };

    const handleChangeAutoSize = () => {
        // 自适应屏幕
        if (window.handler) {
            window.handler.zoomHandler.zoomToFit();
        }
    };

    const handleChangeSize = (value: number) => {
        if (!value) return;
        setSizeStage(value);

        if (window.handler) {
            let zoom = (value / 100).toFixed(2);
            window.handler.zoomHandler.zoomToNumber(zoom);
        }
    };

    return (
        <div className="sizebar">
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
                className="sizemid"
                onMouseOver={handleAutoSizeOver}
                onMouseLeave={() => setIsAutoSize(false)}
                onClick={handleChangeAutoSize}
            >
                {isAutoSize ? (
                    <Tooltip
                        title="适应屏幕"
                        color="rgba(255, 255, 255, 0.1)"
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
};

export default SizeBar;
