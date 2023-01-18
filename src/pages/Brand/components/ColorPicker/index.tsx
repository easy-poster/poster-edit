import React, { useMemo } from 'react';
import { ChromePicker, ColorChangeHandler } from 'react-color';
import { tools } from '@/utils';
import styles from './index.less';

interface ColorPickerProps {
    activeColor?: string;
    onChangeColor: ColorChangeHandler;
}

const ColorPicker = React.memo(
    ({ activeColor, onChangeColor }: ColorPickerProps) => {
        const currentColor = useMemo(() => {
            return activeColor || tools.randomColor16();
        }, [activeColor]);

        return (
            <div onClick={(event) => event?.stopPropagation()}>
                <ChromePicker
                    className={styles.chromePicker}
                    color={currentColor}
                    onChange={onChangeColor}
                />
            </div>
        );
    },
);

export default ColorPicker;
