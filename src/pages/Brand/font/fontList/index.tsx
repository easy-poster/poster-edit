import { IconFont } from '@/const';
import FunctionEmitter, { BRAND } from '@/helper/function';
import { brandType, delBrand, getBrandDetail } from '@/services/brand';
import { useDynamicList } from 'ahooks';
import { List, message, Popconfirm } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { BrandKitContext } from '../../container/BrandKitContainer';
import styles from './index.less';

interface fontItem {
    id: string;
    fontName: string;
    fontNormalUrl: string;
}

const FontList = React.memo(() => {
    const { kitInfo, getDetail } = useContext(BrandKitContext);

    const {
        list: fontList,
        resetList: fontResetList,
        remove: fontRemove,
        getKey: fontGetKey,
        unshift: fontUnshift,
        replace: fontRelace,
    } = useDynamicList<fontItem>([]);

    const [confirmLoading, setConfirmLoading] = useState(false);

    const getFontList = useCallback(async () => {
        if (!kitInfo?.id) return;
        try {
            let res = await getBrandDetail({
                type: brandType.FONT,
                id: kitInfo.id,
            });
            if (res) {
                let resList = res || [];
                fontResetList(resList || []);
            }
        } catch (error) {}
    }, [kitInfo]);

    const handleDel = (item: fontItem) => {
        setConfirmLoading(true);
        return new Promise((resolve) => {
            try {
                delBrand({
                    type: brandType.FONT,
                    id: item.id,
                }).then((res) => {
                    getFontList();
                    resolve(null);
                });
            } catch (error) {
                message.error('删除失败');
            }
            setConfirmLoading(false);
        });
    };

    useEffect(() => {
        let fn = () => {
            getFontList();
        };
        FunctionEmitter.on(BRAND.REFRESH_FONT, fn);
        return () => {
            FunctionEmitter.off(BRAND.REFRESH_FONT, fn);
        };
    }, []);

    useEffect(() => {
        getFontList();
    }, [kitInfo?.id]);

    return (
        <div className={styles.fontList}>
            <List
                itemLayout="horizontal"
                dataSource={fontList}
                renderItem={(item) => (
                    <div className={styles.text}>
                        <p style={{ fontFamily: item.fontName }}>
                            {item.fontName}
                        </p>
                        <Popconfirm
                            overlayClassName={styles.delPopconfirmWrap}
                            title="删除已上传的字体？"
                            placement="topRight"
                            description={
                                <div
                                    style={{
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                    }}
                                >
                                    <p>
                                        你将删除
                                        <span style={{ fontWeight: 'bolder' }}>
                                            &nbsp;{item.fontName}&nbsp;
                                        </span>
                                    </p>
                                    <p>现有设计不会受到影响</p>
                                </div>
                            }
                            showCancel={false}
                            onConfirm={() => handleDel(item)}
                            okText="永久删除字体"
                            okButtonProps={{
                                loading: confirmLoading,
                                size: 'middle',
                                danger: true,
                            }}
                        >
                            <div className={styles.delBtn}>
                                <IconFont type="icon-shanchu" />
                            </div>
                        </Popconfirm>
                    </div>
                )}
            />
        </div>
    );
});

export default FontList;
