import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import demoImg from '@/assets/demo.png';
import styles from './index.less';

const FontStylePanel = React.memo(() => {
    const [active, setActive] = useState();

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

    const handleActive = useCallback((active: any) => {
        setActive(active.id);
    }, []);

    return (
        <div className={styles.fontStylePanel}>
            <h2>风格</h2>
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

export default FontStylePanel;
