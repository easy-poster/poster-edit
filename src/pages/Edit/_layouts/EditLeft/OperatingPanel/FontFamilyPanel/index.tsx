import { IconFont } from '@/const';
import BridgeController from '@/helper/bridge/BridgeController';
import { FontItem, getFontGroupList } from '@/services/font';
import { Input, List } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import React, {
    ChangeEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import styles from './index.less';

interface familyItemProps {
    id: string;
    title: string;
    url: string;
    type: string;
    isVip: boolean;
}

const FontFamilyPanel = React.memo(() => {
    const [activeFont, setActiveFont] = useState<string>();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageTotal, setPageTotal] = useState(0);
    const [fontList, setFontList] = useState<FontItem[]>([]);

    const initFont = useCallback(async () => {
        try {
            let res = await getFontGroupList({
                current: currentPage,
                pageSize: 20,
            });
            let list = res?.list || [];
            let total = res.total;
            if (list?.length) {
                setFontList([...fontList, ...list]);
                setPageTotal(total);
            }
        } catch (error) {}
    }, []);

    const LIST = useMemo(() => {
        let arr = [];
        for (let i = 0; i < 80; i++) {
            arr.push({
                id: uuidv4(),
                title: `字体名字 slider${i}`,
                url: `http://192.168.1.10:9002/Acy手写体.ttf`,
                type: i < 20 ? 'upload' : 'resouce',
                isVip: false,
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
        // 加载字体文件 http://192.168.1.10:9002/IPix中文像素字体.ttf
        console.log('加载字体文件', item);
        setActiveFont(item.id);
        let fontFace = new FontFace(item.id, `url(${item.url})`, {
            weight: 'normal',
        });
        fontFace
            .load()
            .then((loadedFace) => {
                document.fonts.add(loadedFace);
                BridgeController.SetedObjectStyle({
                    fontFamily: 'Acy手写体',
                });
            })
            .catch((error) => {
                console.log('err', error);
            });
    }, []);

    // useEffect(() => {
    //     initFont()
    // }, []);

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
