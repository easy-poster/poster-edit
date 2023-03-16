import { IconFont } from '@/const';
import BridgeController from '@/helper/bridge/BridgeController';
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
import { ArrFonts } from '@/helper/const/fonts';
import styles from './index.less';

interface FontItem {
    ch: string;
    en: string;
}

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
        () => selectObj?.fontFamily ?? '',
    );
    const [fontList, setFontList] = useState<any>([]);

    const initFont = useCallback(async () => {
        try {
            setFontList(ArrFonts);
        } catch (error) {}
    }, []);

    const handleClick = useCallback((item: FontItem) => {
        setActiveFont(item.en);
        BridgeController.SetedObjectStyle({
            fontFamily: item.en,
        });
    }, []);

    useEffect(() => {
        initFont();
    }, []);

    useEffect(() => {
        setActiveFont(selectObj?.fontFamily ?? '');
    }, [selectObj?.fontFamily]);

    const RenderItem = (item: FontItem) => {
        return (
            <div className={styles.fontItem} onClick={() => handleClick(item)}>
                <div className={styles.fontImg}>
                    <p style={{ fontFamily: item.en }}>{item.ch}</p>
                </div>
                {item.en === activeFont && (
                    <IconFont type="icon-duigou" style={{ fontSize: '24px' }} />
                )}
            </div>
        );
    };

    return (
        <div className={styles.fontFamilyPanel}>
            {/* <div className={styles.searchWrap}>
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
            </div> */}
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
