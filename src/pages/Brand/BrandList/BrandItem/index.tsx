import React, { useCallback, useContext, useState } from 'react';
import { history } from '@umijs/max';
import { Dropdown, Image, MenuProps, message } from 'antd';
import { IconFont } from '@/const';
import { kitItem } from '../../container';
import { BrandListContext } from '..';
import errorImg from '@/assets/common/errorImg.svg';
import styles from './index.less';

const BrandItem = React.memo(({ item }: { item: kitItem }) => {
    const { setIsCopyOpen, setIsDelOpen, setActiveItem } =
        useContext(BrandListContext);

    const handleCopy = useCallback(() => {
        setIsCopyOpen(true);
        setActiveItem(item);
    }, [item]);

    const handleDel = useCallback(() => {
        setIsDelOpen(true);
        setActiveItem(item);
    }, [item]);

    const handleMenuClick: MenuProps['onClick'] = ({ key, domEvent }) => {
        domEvent.stopPropagation();
        switch (+key) {
            case 1:
                handleCopy();
                break;
            case 2:
                handleDel();
                break;
            default:
                break;
        }
    };

    const items = [
        {
            label: '复制',
            key: 1,
            icon: <IconFont type="icon-fuzhi" style={{ fontSize: '22px' }} />,
        },
        {
            label: '删除',
            key: 2,
            icon: <IconFont type="icon-shanchu" style={{ fontSize: '22px' }} />,
        },
    ];

    const handleGoDetail = useCallback(
        (
            event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
            detail: kitItem,
        ) => {
            event?.stopPropagation();
            history.push(`/brand/${detail.uuid}`);
        },
        [],
    );

    return (
        <>
            <div
                className={styles.brandKitItem}
                onClick={(e) => handleGoDetail(e, item)}
            >
                <div className={styles.previewImg}>
                    <Image
                        height={150}
                        preview={false}
                        src={item.brandCover}
                        fallback={errorImg}
                    />
                </div>
                <div className={styles.footerItem}>
                    <p className={styles.name}>{item.brandName}</p>
                    <Dropdown
                        overlayClassName="card-drop-wrap"
                        menu={{ items, onClick: handleMenuClick }}
                        trigger={['click']}
                        placement="bottomLeft"
                    >
                        <div
                            className={styles.more}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <IconFont
                                type="icon-gengduo"
                                style={{ fontSize: '24px' }}
                            />
                        </div>
                    </Dropdown>
                </div>
            </div>
        </>
    );
});

export default BrandItem;
