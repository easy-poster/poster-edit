import React, { useCallback, useMemo } from 'react';
import cn from 'classnames';
import { FILTERTYPES, IconFont } from '@/const';
import demoImg from '@/assets/demo.png';
import styles from './index.less';

const FilterDetailPanel = React.memo(
    ({
        setIsShowDetail,
        active,
        handleActive,
    }: {
        active: string;
        handleActive: (item: any) => void;
        setIsShowDetail: (val: boolean) => void;
    }) => {
        const LIST = useMemo(() => {
            return Object.keys(FILTERTYPES).map((item, index) => {
                return {
                    title: item,
                    id: index + 1,
                    cover: demoImg,
                    type: item,
                };
            });
        }, []);

        const handleBack = useCallback(() => {
            setIsShowDetail(false);
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
                    <span className={styles.title}>滤镜</span>
                </span>
                <ul className={styles.content}>
                    {LIST.map((item) => {
                        return (
                            <li className={styles.imgItem} key={item.id}>
                                <div
                                    className={cn(styles.itemImg, {
                                        [styles.active]:
                                            item.type === active?.toLowerCase(),
                                    })}
                                    onClick={() => handleActive(item)}
                                >
                                    <div className={styles.imgWrap}>
                                        <img
                                            src={item.cover}
                                            alt={item.title}
                                        />
                                    </div>
                                </div>
                                <p>{item.title}</p>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    },
);

export default FilterDetailPanel;
