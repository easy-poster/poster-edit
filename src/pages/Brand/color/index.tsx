import { IconFont } from '@/const';
import { useDynamicList } from 'ahooks';
import { Button, List } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import { BrandKitContext } from '../container/BrandKitContainer';
import ColorItem from './colorItem';
import { brandType, getBrandDetail, saveBrand } from '@/services/brand';
import styles from './index.less';

const defaultList = [
    {
        colorName: '调色板',
        colorValues: [],
    },
];

const Color = React.memo(() => {
    const { kitInfo, getDetail } = useContext(BrandKitContext);

    const { list: colorList, resetList: colorReset } =
        useDynamicList(defaultList);
    const [isNew, setIsNew] = useState(false);

    const getColorList = useCallback(async () => {
        if (!kitInfo?.id) return;
        try {
            let res = await getBrandDetail({
                type: brandType.COLOR,
                id: kitInfo.id,
            });
            if (res) {
                let resList = res || [];
                if (resList.length === 0) {
                    setIsNew(true);
                    colorReset(defaultList);
                } else {
                    setIsNew(false);
                    colorReset(resList || defaultList);
                }
            }
        } catch (error) {}
    }, [kitInfo]);

    // 新建调色板
    const handleNew = useCallback(async () => {
        if (!kitInfo?.id) return;
        try {
            await saveBrand(
                {
                    type: brandType.COLOR,
                    brandId: kitInfo.id,
                },
                {
                    colorValues: [],
                },
            );
            getColorList();
        } catch (error) {}
    }, [kitInfo]);

    useEffect(() => {
        getColorList();
    }, [kitInfo?.id]);

    return (
        <div className={styles.color}>
            <Header
                title="品牌颜色"
                rightExtra={
                    <Button
                        icon={
                            <IconFont
                                type="icon-tianjia_huaban"
                                style={{
                                    fontSize: '18px',
                                }}
                            />
                        }
                        onClick={handleNew}
                    >
                        新建
                    </Button>
                }
            />
            <div className={styles.content}>
                <List
                    itemLayout="horizontal"
                    dataSource={colorList}
                    renderItem={(item, index) => (
                        <ColorItem
                            kitInfo={kitInfo}
                            colorItem={item}
                            isNew={isNew}
                            getColorList={getColorList}
                        />
                    )}
                />
            </div>
        </div>
    );
});

export default Color;
