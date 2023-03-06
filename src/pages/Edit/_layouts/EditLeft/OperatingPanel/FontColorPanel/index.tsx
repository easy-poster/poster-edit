import React, { useCallback, useMemo, useState } from 'react';
import { List } from 'antd';
import cn from 'classnames';
import DocColor from './DocColor';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';

export interface colorItemProps {
    id: number;
    value: string;
    type: string;
}

const FontColorPanel = React.memo(() => {
    const [activeColor, setActiveColor] = useState<string>();

    const LIST = useMemo(() => {
        let arr = [];
        for (let i = 0; i < 60; i++) {
            arr.push({
                id: i,
                value: `#E${i < 10 ? '0' + i : i}`,
                type: i < 20 ? '品牌颜色' : '默认颜色',
            });
        }
        return arr;
    }, []);

    const groupedNewData: [string, colorItemProps[]][] = useMemo(() => {
        const groupedData = {};
        LIST.forEach((item) => {
            if (!groupedData[item.type]) {
                groupedData[item.type] = [];
            }
            groupedData[item.type].push(item);
        });
        return Object.entries(groupedData);
    }, [LIST]);

    const handleClick = useCallback((item: colorItemProps) => {
        setActiveColor(item.value);
        BridgeController.SetFontStyle({
            fill: item.value,
        });
    }, []);

    const RenderItem = (item: colorItemProps) => {
        return (
            <div
                className={cn(styles.colorWrap, {
                    [styles.active]: item.value === activeColor,
                })}
                onClick={() => handleClick(item)}
            >
                <div
                    className={styles.colorItem}
                    style={{ backgroundColor: item.value }}
                ></div>
            </div>
        );
    };

    return (
        <div className={styles.fontColorPanel}>
            <h2>字体颜色</h2>
            <DocColor />
            <List
                dataSource={groupedNewData}
                renderItem={([type, items]) => {
                    return (
                        <div className={styles.groupWrap}>
                            <h3>{type}</h3>
                            <List dataSource={items} renderItem={RenderItem} />
                        </div>
                    );
                }}
            />
        </div>
    );
});

export default FontColorPanel;
