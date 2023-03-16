import React, {
    ChangeEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Divider, Input } from 'antd';
import { IconFont } from '@/const';
import cn from 'classnames';
import demoImg from '@/assets/demo.png';
import BridgeController from '@/helper/bridge/BridgeController';
import styles from './index.less';
import DocColor from './DocColor';

const BackgroundPage = React.memo(() => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageTotal, setPageTotal] = useState(0);
    const [bgList, setBgList] = useState<any>([]);

    const LIST = useMemo(() => {
        let arr = [];
        for (let i = 0; i < 18; i++) {
            arr.push({
                id: i,
                title: `slider${i}`,
                cover: demoImg,
            });
        }
        return arr;
    }, []);

    const initText = useCallback(async () => {
        try {
            // let res = await getFontGroupList({
            //     current: currentPage,
            //     pageSize: 20,
            // });
            // let list = res?.list || [];
            // let total = res.total;
            // if (list?.length) {
            //     setTextList([...textList, ...list]);
            //     setPageTotal(total);
            // }
        } catch (error) {}
    }, []);

    const handleChangeSearch = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            console.log('e', e.target.value);
        },
        [],
    );

    const handlePressEnter = useCallback((e: any) => {
        console.log('e1', e.target.value);
    }, []);

    const handleAdd = (data: any) => {
        BridgeController.setWorkAreaBg('IMAGE', data?.cover);
    };

    useEffect(() => {
        initText();
    }, []);

    return (
        <div className={styles.bgWrap}>
            {/* <div className={styles.bgSearch}>
                <Input
                    size="large"
                    placeholder="搜索背景"
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
            <DocColor />
            <Divider />
            {/* <h3>背景图片</h3>
            <div className={styles.bgList}>
                {LIST.map((item) => {
                    return (
                        <div className={styles.imgItem} key={item.id}>
                            <div className={styles.imgWrap}>
                                <img
                                    className={styles.imgCover}
                                    alt="example"
                                    src={item.cover}
                                />
                                <div
                                    className={cn(
                                        styles.imgBtn,
                                        styles.editAdd,
                                    )}
                                    onClick={() => handleAdd(item)}
                                >
                                    <IconFont
                                        type="icon-tianjia_huaban"
                                        style={{ fontSize: '16px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div> */}
        </div>
    );
});

export default BackgroundPage;
