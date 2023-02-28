import React, { useCallback, useContext, useMemo, useState } from 'react';
import cn from 'classnames';
import { IconFont } from '@/const';
import demoImg from '@/assets/demo.png';
import { ImagePanelContext, ImagePanelType } from '..';
import styles from './index.less';

const DetailPanel = React.memo(() => {
    const [active, setActive] = useState();
    const { detailType, setDetailType } = useContext(ImagePanelContext);

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

    const DetailMap = {
        [ImagePanelType.FILTER]: '滤镜',
        [ImagePanelType.SHADOWS]: '阴影',
    };

    const title = useMemo(() => {
        return DetailMap[detailType];
    }, []);

    const handleActive = useCallback((active: any) => {
        setActive(active.id);
    }, []);

    const handleBack = useCallback(() => {
        setDetailType(ImagePanelType.NONE);
    }, []);

    return (
        <div className={styles.detailPanel}>
            <span className={styles.header} onClick={handleBack}>
                <IconFont
                    type="icon-xiangzuo"
                    style={{
                        fontSize: '20px',
                    }}
                />
                <span className={styles.title}>{title}</span>
            </span>
            <ul className={styles.content}>
                {LIST.map((item) => {
                    return (
                        <li className={styles.imgItem} key={item.id}>
                            <div
                                className={cn(styles.itemImg, {
                                    [styles.active]: item.id === active,
                                })}
                                onClick={() => handleActive(item)}
                            >
                                <div className={styles.imgWrap}>
                                    <img src={item.cover} alt={item.title} />
                                </div>
                            </div>
                            <p>{item.title}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
});

export default DetailPanel;
