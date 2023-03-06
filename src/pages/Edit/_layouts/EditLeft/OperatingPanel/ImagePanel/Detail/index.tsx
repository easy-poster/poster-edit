import React, { useCallback, useContext, useMemo, useState } from 'react';
import cn from 'classnames';
import { FILTERTYPES, IconFont } from '@/const';
import demoImg from '@/assets/demo.png';
import { ImagePanelContext, ImagePanelType } from '..';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';

const DetailPanel = React.memo(() => {
    const [active, setActive] = useState();
    const { detailType, setDetailType } = useContext(ImagePanelContext);

    const LIST = useMemo(() => {
        if (detailType === ImagePanelType.FILTER) {
            return Object.keys(FILTERTYPES).map((item, index) => {
                return {
                    title: item,
                    id: index + 1,
                    cover: demoImg,
                    type: item,
                };
            });
        } else {
            return Object.keys(FILTERTYPES).map((item, index) => {
                return {
                    title: item,
                    id: index,
                    cover: demoImg,
                    type: item,
                };
            });
        }
    }, [detailType]);

    const DetailMap = {
        [ImagePanelType.FILTER]: '滤镜',
        [ImagePanelType.SHADOWS]: '阴影',
    };

    const title = useMemo(() => {
        return DetailMap[detailType];
    }, []);

    const handleActive = useCallback(
        (active: any) => {
            setActive(active.id);
            if (detailType === ImagePanelType.FILTER) {
                BridgeController.setFilter(active.type);
            }
        },
        [detailType],
    );

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
