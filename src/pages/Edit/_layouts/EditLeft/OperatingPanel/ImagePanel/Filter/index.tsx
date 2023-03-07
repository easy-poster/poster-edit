import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import cn from 'classnames';
import { useSize } from 'ahooks';
import BScroll from '@better-scroll/core';
import { FILTERTYPES, IconFont } from '@/const';
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';
import HeaderTitle from '@/components/HeaderTitle';
import demoImg from '@/assets/demo.png';
import BridgeController from '@/helper/bridge/BridgeController';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';
import FilterDetailPanel from './Detail';
import styles from './index.less';

let bscrollObj: BScrollConstructor;

const Filter = React.memo(() => {
    const { selectObj } = useContext(SelectContext);
    const swiperRef = useRef(null);
    const size = useSize(swiperRef);
    const [isEnd, setIsEnd] = useState({
        left: true,
        right: false,
    });
    const [isShowDetail, setIsShowDetail] = useState(false);

    const [active, setActive] = useState(() => {
        return selectObj?.filters?.find((it: { type: FILTERTYPES }) => {
            return Object.keys(FILTERTYPES).includes(it?.type?.toLowerCase());
        })?.type;
    });

    const LIST = useMemo(() => {
        return Object.keys(FILTERTYPES).map((item, index) => {
            return {
                title: item,
                id: index,
                cover: demoImg,
                type: item,
            };
        });
    }, []);

    const handleMore = useCallback(() => {
        setIsShowDetail(true);
    }, []);

    const handleActive = useCallback((active: any) => {
        setActive(active.type);
        BridgeController.setFilter(active.type);
    }, []);

    const handleTransform = (to: string) => {
        if (bscrollObj && size?.width) {
            if (to === 'L') {
                if (bscrollObj.x === bscrollObj.minScrollX) {
                    bscrollObj.scrollBy(size.width * 0.1, 0, 300);
                } else {
                    bscrollObj.scrollBy(size.width * 0.7, 0, 300);
                }
            } else {
                if (bscrollObj.x === bscrollObj.maxScrollX) {
                    bscrollObj.scrollBy(-size.width * 0.1, 0, 300);
                } else {
                    bscrollObj.scrollBy(-size.width * 0.7, 0, 300);
                }
            }
        }
    };

    useEffect(() => {
        let wrapper: any = swiperRef.current;
        if (wrapper) {
            bscrollObj = new BScroll(wrapper, {
                scrollX: true,
                probeType: 3,
            });
        }

        const fn = () => {
            if (bscrollObj.x === 0) {
                setIsEnd({
                    left: true,
                    right: false,
                });
            } else if (bscrollObj.maxScrollX === bscrollObj.x) {
                setIsEnd({
                    left: false,
                    right: true,
                });
            } else {
                setIsEnd({
                    left: false,
                    right: false,
                });
            }
        };
        if (bscrollObj) {
            bscrollObj.on('scroll', fn);
        }
        return () => {
            if (bscrollObj) {
                bscrollObj.off('scroll', fn);
            }
        };
    }, []);

    useEffect(() => {
        setActive(
            selectObj?.filters?.find((it: { type: FILTERTYPES }) => {
                return Object.keys(FILTERTYPES).includes(
                    it?.type?.toLowerCase(),
                );
            })?.type,
        );
    }, [selectObj]);

    return (
        <div className={styles.panelItem}>
            <HeaderTitle
                title="滤镜"
                size="small"
                rightExtra={
                    <span className={styles.more} onClick={handleMore}>
                        查看更多
                    </span>
                }
            />
            <div className={styles.swiperList} ref={swiperRef}>
                <ul className={styles.swiperContent}>
                    {LIST.map((item) => (
                        <li className={styles.swiperItem} key={item.id}>
                            <div
                                className={cn(styles.itemImg, {
                                    [styles.active]:
                                        item.type === active?.toLowerCase(),
                                })}
                                onClick={() => handleActive(item)}
                            >
                                <img src={item.cover} alt={item.title} />
                            </div>
                            <p>{item.title}</p>
                        </li>
                    ))}
                </ul>
                <div
                    className={cn(styles.swiperBtn, styles.leftBtn)}
                    style={{ display: isEnd.left ? 'none' : 'flex' }}
                    onClick={() => handleTransform('L')}
                >
                    <IconFont
                        type="icon-xiangzuo"
                        style={{ fontSize: '14px' }}
                    />
                </div>
                <div
                    className={cn(styles.swiperBtn, styles.rightBtn)}
                    style={{ display: isEnd.right ? 'none' : 'flex' }}
                    onClick={() => handleTransform('R')}
                >
                    <IconFont
                        type="icon-xiangyou"
                        style={{ fontSize: '14px' }}
                    />
                </div>
            </div>
            {isShowDetail && (
                <FilterDetailPanel
                    active={active}
                    handleActive={handleActive}
                    setIsShowDetail={setIsShowDetail}
                />
            )}
        </div>
    );
});

export default Filter;
