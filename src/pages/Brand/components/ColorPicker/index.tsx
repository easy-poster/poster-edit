import React, { useMemo } from 'react';
import { ChromePicker, ColorChangeHandler } from 'react-color';
import { tools } from '@/utils';
import styles from './index.less';

interface ColorPickerProps {
    activeColor?: string;
    onChangeColor: ColorChangeHandler;
    onChangeColorComplete?: ColorChangeHandler;
}

/**
 * @description 颜色选择组件
 * @todo react-color这个库性能不太好，后面优化
 */
const ColorPicker = React.memo(
    ({
        activeColor,
        onChangeColor,
        onChangeColorComplete,
    }: ColorPickerProps) => {
        const currentColor = useMemo(() => {
            return activeColor || tools.randomColor16();
        }, [activeColor]);

        return (
            <div onClick={(event) => event?.stopPropagation()}>
                <ChromePicker
                    className={styles.chromePicker}
                    color={currentColor}
                    onChange={onChangeColor}
                    onChangeComplete={onChangeColorComplete}
                />
            </div>
        );
    },
);

export default ColorPicker;
