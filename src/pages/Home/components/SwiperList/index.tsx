import { useSize } from 'ahooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useModel } from '@umijs/max';
import demoImg from '@/assets/demo.png';
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';
import cn from 'classnames';
import BScroll from '@better-scroll/core';
import styles from './index.less';
import { IconFont } from '@/const';

let bscrollObj: BScrollConstructor;

const SwiperList = React.memo(() => {
    const swiperRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const size = useSize(swiperRef);
    const { initialState } = useModel('@@initialState');
    const userId = initialState?.currentUser?.id;

    const LIST = useMemo(() => {
        let arr = [];
        for (let i = 0; i < 18; i++) {
            arr.push({
                title: `slider${i}`,
                cover: demoImg,
            });
        }
        return arr;
    }, []);

    const handleTransform = (to: string) => {
        console.log('to', to, bscrollObj, size);
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
    }, []);

    return (
        <div className={styles.swiperWrap}>
            <div className={styles.swiperHeader}>
                <h3 className={styles.swiperTitle}>你可能想尝试</h3>
                <span className={styles.tips}>更多</span>
            </div>
            <div className={styles.swiperList} ref={swiperRef}>
                <ul className={styles.swiperContent}>
                    {LIST.map((item) => (
                        <li className={styles.swiperItem} key={item.title}>
                            <div className={styles.itemImg}>
                                <img src={item.cover} alt={item.title} />
                            </div>
                            <p>{item.title}</p>
                        </li>
                    ))}
                </ul>
                <div
                    className={cn(styles.swiperBtn, styles.leftBtn)}
                    ref={leftRef}
                    onClick={() => handleTransform('L')}
                >
                    <IconFont
                        type="icon-xiangzuo"
                        style={{ fontSize: '24px' }}
                    />
                </div>
                <div
                    className={cn(styles.swiperBtn, styles.rightBtn)}
                    ref={rightRef}
                    onClick={() => handleTransform('R')}
                >
                    <IconFont
                        type="icon-xiangyou"
                        style={{ fontSize: '24px' }}
                    />
                </div>
            </div>
        </div>
    );
});

export default SwiperList;
