import { IconFont } from '@/const';
import BridgeController from '@/helper/bridge/BridgeController';
import { FontItem, getFontList } from '@/services/font';
import { Input, List } from 'antd';
import React, {
    ChangeEvent,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';
import styles from './index.less';

interface familyItemProps {
    id: string;
    title: string;
    url: string;
    type: string;
    isVip: boolean;
}

const FontFamilyPanel = React.memo(() => {
    const { selectObj } = useContext(SelectContext);
    const [activeFont, setActiveFont] = useState<string>(
        () => selectObj?.id ?? '',
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [pageTotal, setPageTotal] = useState(0);
    const [fontList, setFontList] = useState<FontItem[]>([]);

    const initFont = useCallback(async () => {
        try {
            let res = await getFontList({
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

    // const LIST = useMemo(() => {
    //     let arr = [];
    //     for (let i = 0; i < 80; i++) {
    //         arr.push({
    //             id: uuidv4(),
    //             title: `字体名字 slider${i}`,
    //             url: i < 20 ? `http://192.168.1.10:9002/Acy手写体.ttf` : `http://192.168.1.10:9002/IPix中文像素字体.ttf`,
    //             type: i < 20 ? 'upload' : 'resouce',
    //             isVip: false,
    //         });
    //     }
    //     return arr;
    // }, []);

    // const groupedNewData: [string, familyItemProps[]][] = useMemo(() => {
    //     const groupedData = {};
    //     LIST.forEach((item) => {
    //         if (!groupedData[item.type]) {
    //             groupedData[item.type] = [];
    //         }
    //         groupedData[item.type].push(item);
    //     });
    //     return Object.entries(groupedData);
    // }, [LIST]);

    const handleChangeSearch = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            console.log('e', e.target.value);
        },
        [],
    );

    const handlePressEnter = useCallback((e: any) => {
        console.log('e1', e.target.value);
    }, []);

    const handleClick = useCallback((item: FontItem) => {
        // 加载字体文件 http://192.168.1.10:9002/IPix中文像素字体.ttf
        let fontFace = new FontFace(
            item.fontName,
            `url(${item.fontNormalUrl})`,
            {
                weight: 'normal',
            },
        );
        fontFace
            .load()
            .then((loadedFace) => {
                document.fonts.add(loadedFace);
                setActiveFont(item.uuid);
                BridgeController.SetedObjectStyle({
                    id: item.uuid,
                    fontFamily: item.fontName,
                    fontUrl: item.fontNormalUrl,
                });
            })
            .catch((error) => {
                console.log('err', error);
            });
    }, []);

    useEffect(() => {
        initFont();
    }, []);

    useEffect(() => {
        setActiveFont(selectObj?.id ?? '');
    }, [selectObj?.id]);

    const RenderItem = (item: FontItem) => {
        return (
            <div className={styles.fontItem} onClick={() => handleClick(item)}>
                <div className={styles.fontImg}>
                    <img
                        src={item.fontCover}
                        alt={item.fontName}
                        title={item.fontName}
                    />
                </div>
                {item.uuid === activeFont && (
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
                dataSource={fontList}
                renderItem={RenderItem}
            />
            {/* <List
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
            /> */}
        </div>
    );
});

export default FontFamilyPanel;
