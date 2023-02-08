import { Breadcrumb, Typography } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { BrandKitContext } from '../container/BrandKitContainer';
import { Link } from '@umijs/max';
import Color from '../color';
import Font from '../font';
import Logo from '../logo';
import styles from './index.less';
import { updateBrandItem } from '@/services/brand';

/**
 * @description 品牌工具箱详情
 * @todo Typography.Title 使用的textarea有换行问题，后面重写使用Input
 */
const Detail = React.memo(() => {
    const { kitInfo, getDetail } = useContext(BrandKitContext);

    const [title, setTitle] = useState('');

    const handleChangeText = useCallback(
        async (value: string) => {
            setTitle(value);
            try {
                // 更新text
                if (value) {
                    await updateBrandItem({
                        id: kitInfo?.id,
                        brandName: value,
                    });
                    if (kitInfo?.uuid) {
                        getDetail(kitInfo.uuid);
                    }
                } else {
                    if (kitInfo?.brandName) {
                        setTitle(kitInfo.brandName);
                    }
                }
            } catch (error) {}
        },
        [title, kitInfo],
    );

    useEffect(() => {
        setTitle(kitInfo?.brandName || '');
    }, [kitInfo?.brandName]);

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/brand/kit">品牌工具箱</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{kitInfo?.brandName}</Breadcrumb.Item>
            </Breadcrumb>
            <div className={styles.title}>
                <Typography.Title
                    ellipsis
                    editable={{
                        autoSize: {
                            minRows: 1,
                            maxRows: 1,
                        },
                        text: title,
                        tooltip: '点击重命名',
                        maxLength: 50,
                        enterIcon: null,
                        onChange: handleChangeText,
                    }}
                    level={2}
                >
                    {title}
                </Typography.Title>
            </div>
            <Logo />
            <Color />
            <Font />
        </>
    );
});

export default Detail;
