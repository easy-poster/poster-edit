import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import HeaderTitle from '@/components/HeaderTitle';
import cn from 'classnames';
import styles from './index.less';
import { Slider } from 'antd';

const Adjust = React.memo(() => {
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [saturation, setSaturation] = useState(0);
    const [temperature, setTemperature] = useState(0);

    const handleMore = useCallback(() => {}, []);

    const handleBrightnessChange = useCallback((value: number) => {
        setBrightness(value);
    }, []);

    const handleContrastChange = useCallback((value: number) => {
        setContrast(value);
    }, []);

    const handleSaturationChange = useCallback((value: number) => {
        setSaturation(value);
    }, []);

    const handleTemperatureChange = useCallback((value: number) => {
        setTemperature(value);
    }, []);

    return (
        <div className={styles.panelItem}>
            <HeaderTitle title="调整" size="small" />
            <div className={cn(styles.adjustItem, styles.brightness)}>
                <h2>亮度</h2>
                <Slider
                    step={1}
                    min={-100}
                    max={100}
                    tooltip={{ formatter: null }}
                    value={brightness}
                    onChange={handleBrightnessChange}
                />
            </div>
            <div className={cn(styles.adjustItem, styles.contrast)}>
                <h2>对比度</h2>
                <Slider
                    step={1}
                    min={-100}
                    max={100}
                    tooltip={{ formatter: null }}
                    value={contrast}
                    onChange={handleContrastChange}
                />
            </div>
            <div className={cn(styles.adjustItem, styles.saturation)}>
                <h2>饱和度</h2>
                <Slider
                    step={1}
                    min={-100}
                    max={100}
                    tooltip={{ formatter: null }}
                    value={saturation}
                    onChange={handleSaturationChange}
                />
            </div>
            <div className={cn(styles.adjustItem, styles.temperature)}>
                <h2>色温</h2>
                <Slider
                    step={1}
                    min={-100}
                    max={100}
                    tooltip={{ formatter: null }}
                    value={temperature}
                    onChange={handleTemperatureChange}
                />
            </div>
        </div>
    );
});

export default Adjust;
