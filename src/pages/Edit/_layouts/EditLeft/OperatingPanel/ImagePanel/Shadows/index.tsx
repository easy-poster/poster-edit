import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import HeaderTitle from '@/components/HeaderTitle';
import BScroll from '@better-scroll/core';
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';
import demoImg from '@/assets/demo.png';
import { useSize } from 'ahooks';
import cn from 'classnames';
import { IconFont } from '@/const';
import styles from './index.less';
import { ImagePanelContext, ImagePanelType } from '..';

let bscrollObj: BScrollConstructor;

const Shadows = React.memo(() => {
    const swiperRef = useRef(null);
    const size = useSize(swiperRef);
    const [isEnd, setIsEnd] = useState({
        left: true,
        right: false,
    });
    const [active, setActive] = useState();
    const { setDetailType } = useContext(ImagePanelContext);

    const LIST = useMemo(() => {
        let arr = [];
        for (let i = 0; i < 18; i++) {
            arr.push({
                title: `slider${i}`,
                cover: demoImg,
                id: i,
            });
        }
        return arr;
    }, []);

    const handleMore = useCallback(() => {
        setDetailType(ImagePanelType.SHADOWS);
    }, []);

    const handleActive = useCallback((active: any) => {
        setActive(active.id);
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

    return (
        <div className={styles.panelItem}>
            <HeaderTitle
                title="阴影"
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
                                    [styles.active]: item.id === active,
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
        </div>
    );
});

export default Shadows;
