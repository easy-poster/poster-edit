import { IconFont } from '@/const';
import { Input, List } from 'antd';
import React, {
    ChangeEvent,
    KeyboardEventHandler,
    useCallback,
    useMemo,
    useState,
} from 'react';
import styles from './index.less';

interface familyItemProps {
    id: number;
    title: string;
    url: string;
    type: string;
}

const FontFamilyPanel = React.memo(() => {
    const [activeFont, setActiveFont] = useState<number>();

    const LIST = useMemo(() => {
        let arr = [];
        for (let i = 0; i < 80; i++) {
            arr.push({
                id: i,
                title: `字体名字 slider${i}`,
                url: `字体地址`,
                type: i < 20 ? 'upload' : 'resouce',
            });
        }
        return arr;
    }, []);

    const groupedNewData: [string, familyItemProps[]][] = useMemo(() => {
        const groupedData = {};
        LIST.forEach((item) => {
            if (!groupedData[item.type]) {
                groupedData[item.type] = [];
            }
            groupedData[item.type].push(item);
        });
        return Object.entries(groupedData);
    }, [LIST]);

    const handleChangeSearch = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            console.log('e', e.target.value);
        },
        [],
    );

    const handlePressEnter = useCallback((e: any) => {
        console.log('e1', e.target.value);
    }, []);

    const handleClick = useCallback((item: familyItemProps) => {
        setActiveFont(item.id);
    }, []);

    const RenderItem = (item: familyItemProps) => {
        return (
            <div className={styles.fontItem} onClick={() => handleClick(item)}>
                <p style={{ fontFamily: item.url }}>{item.title}</p>
                {item.id === activeFont && (
                    <IconFont type="icon-duigou" style={{ fontSize: '24px' }} />
                )}
            </div>
        );
    };

    return (
        <div className={styles.fontFamilyPanel}>
            <div className={styles.searchWrap}>
                <Input
                    size="large"
                    placeholder="字体名字"
                    allowClear
                    onChange={handleChangeSearch}
                    onPressEnter={handlePressEnter}
                    prefix={
                        <IconFont
                            type="icon-sousuo"
                            style={{ fontSize: '24px' }}
                        />
                    }
                />
            </div>
            <List
                itemLayout="horizontal"
                dataSource={groupedNewData}
                renderItem={([type, items]) => {
                    return (
                        <div className={styles.groupWrap}>
                            <h3>{type}</h3>
                            <List
                                itemLayout="horizontal"
                                dataSource={items}
                                renderItem={RenderItem}
                            />
                        </div>
                    );
                }}
            />
        </div>
    );
});

export default FontFamilyPanel;
