import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import HeaderTitle from '@/components/HeaderTitle';
import cn from 'classnames';
import styles from './index.less';
import { Slider } from 'antd';
import BridgeController from '@/helper/bridge/BridgeController';
import { ALLFILTERS, FILTER_CUSTOMIZE } from '@/const';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';

const Adjust = React.memo(() => {
    const { selectObj } = useContext(SelectContext);
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [saturation, setSaturation] = useState(0);
    const [temperature, setTemperature] = useState(0);

    const brightnessObj = useMemo(() => {
        return selectObj?.filters.find(
            (filter: any) =>
                filter?.type?.toLowerCase() === ALLFILTERS.brightness,
        );
    }, [selectObj]);

    const contrastObj = useMemo(() => {
        return selectObj?.filters.find(
            (filter: any) =>
                filter?.type?.toLowerCase() === ALLFILTERS.contrast,
        );
    }, [selectObj]);

    const saturationObj = useMemo(() => {
        return selectObj?.filters.find(
            (filter: any) =>
                filter?.type?.toLowerCase() === ALLFILTERS.saturation,
        );
    }, [selectObj]);

    const temperatureObj = useMemo(() => {
        return selectObj?.filters.find(
            (filter: any) =>
                filter?.type?.toLowerCase() === ALLFILTERS.temperature,
        );
    }, [selectObj]);

    const handleBrightnessChange = useCallback((value: number) => {
        setBrightness(value);
        BridgeController.changeFilter(FILTER_CUSTOMIZE.brightness, {
            brightness: value,
        });
    }, []);

    const handleContrastChange = useCallback((value: number) => {
        setContrast(value);
        BridgeController.changeFilter(FILTER_CUSTOMIZE.contrast, {
            contrast: value,
        });
    }, []);

    const handleSaturationChange = useCallback((value: number) => {
        setSaturation(value);
        BridgeController.changeFilter(FILTER_CUSTOMIZE.saturation, {
            saturation: value,
        });
    }, []);

    const handleTemperatureChange = useCallback((value: number) => {
        setTemperature(value);
        BridgeController.changeFilter(FILTER_CUSTOMIZE.temperature, {
            temperature: value,
        });
    }, []);

    const handleAfterChange = useCallback((value: number) => {
        BridgeController.setModified();
    }, []);

    useEffect(() => {
        setBrightness(brightnessObj?.brightness || 0);
    }, [brightnessObj]);

    useEffect(() => {
        setContrast(contrastObj?.contrast || 0);
    }, [contrastObj]);

    useEffect(() => {
        setSaturation(saturationObj?.saturation || 0);
    }, [saturationObj]);

    useEffect(() => {
        setTemperature(temperatureObj?.temperature || 0);
    }, [temperatureObj]);

    return (
        <div className={styles.panelItem}>
            <HeaderTitle title="调整" size="small" />
            <div className={cn(styles.adjustItem, styles.brightness)}>
                <h2>亮度</h2>
                <Slider
                    step={0.01}
                    min={-0.8}
                    max={0.8}
                    marks={{
                        0: '0',
                    }}
                    tooltip={{
                        formatter: (value = 0) => Math.round(value * 100),
                    }}
                    value={brightness}
                    onChange={handleBrightnessChange}
                    onAfterChange={handleAfterChange}
                />
            </div>
            <div className={cn(styles.adjustItem, styles.contrast)}>
                <h2>对比度</h2>
                <Slider
                    step={0.01}
                    min={-0.8}
                    max={0.8}
                    marks={{
                        0: '0',
                    }}
                    tooltip={{
                        formatter: (value = 0) => Math.round(value * 100),
                    }}
                    value={contrast}
                    onChange={handleContrastChange}
                    onAfterChange={handleAfterChange}
                />
            </div>
            <div className={cn(styles.adjustItem, styles.saturation)}>
                <h2>饱和度</h2>
                <Slider
                    step={0.01}
                    min={-0.8}
                    max={0.8}
                    marks={{
                        0: '0',
                    }}
                    tooltip={{
                        formatter: (value = 0) => Math.round(value * 100),
                    }}
                    value={saturation}
                    onChange={handleSaturationChange}
                    onAfterChange={handleAfterChange}
                />
            </div>
            {/* <div className={cn(styles.adjustItem, styles.temperature)}>
                <h2>色温</h2>
                <Slider
                    step={0.01}
                    min={-0.5}
                    max={0.5}
                    marks={{
                        0: '0',
                    }}
                    tooltip={{
                        formatter: (value = 0) => Math.round(value * 100),
                    }}
                    value={temperature}
                    onChange={handleTemperatureChange}
                />
            </div> */}
        </div>
    );
});

export default Adjust;
