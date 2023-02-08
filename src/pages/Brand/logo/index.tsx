import { Button, message, Upload } from 'antd';
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useDynamicList } from 'ahooks';
import HeaderTitle from '@/components/HeaderTitle';
import logoSvg from '@/assets/logo/color.svg';
import logoBlack from '@/assets/logo/black.svg';
import styles from './index.less';
import { IconFont } from '@/const';
import LogoItem from './logoItem';
import { BrandContext } from '../container';
import {
    brandType,
    delBrand,
    getBrandDetail,
    saveBrand,
} from '@/services/brand';
import { BrandKitContext } from '../container/BrandKitContainer';

const Logo = React.memo(() => {
    const { kitInfo } = useContext(BrandKitContext);

    const {
        list: logoList,
        resetList: logoReset,
        getKey: logoGetKey,
    } = useDynamicList([]);

    const getLogoList = useCallback(async () => {
        if (!kitInfo?.id) return;
        let res = await getBrandDetail({
            type: brandType.LOGO,
            id: kitInfo.id,
        });
        logoReset(res || []);
    }, [kitInfo]);

    const handleAddLogo = useCallback(async () => {
        if (!kitInfo?.id) return;
        try {
            await saveBrand(
                {
                    type: brandType.LOGO,
                    brandId: kitInfo.id,
                },
                {
                    logoName: 'logo名称',
                    logoType: 'png',
                    logoUrl:
                        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                },
            );
            await getLogoList();
        } catch (error) {
            message.error('添加失败');
        }
    }, [kitInfo]);

    const handleLogoDel = useCallback(
        async (
            item: any,
            _: number,
            event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        ) => {
            event?.stopPropagation();
            try {
                await delBrand({
                    type: brandType.LOGO,
                    id: item.id,
                });
                getLogoList();
            } catch (error) {
                message.error('删除失败');
            }
        },
        [kitInfo],
    );

    const uploadImgProps = {
        accept: 'image/*',
        action: '',
        showUploadList: false,
        beforeUpload(file: any) {
            console.log('beforeUpload file', file);
        },
        onChange(info: any) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                // message.success(`${info.file.name} file uploaded successfully`);
                handleAddLogo();
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    useEffect(() => {
        getLogoList();
    }, [kitInfo?.id]);

    return (
        <div className={styles.logo}>
            <HeaderTitle title="品牌Logo" />
            <div className={styles.content}>
                <Upload {...uploadImgProps}>
                    <div className={styles.uploadWrap}>
                        <IconFont
                            type="icon-tianjia_huaban"
                            style={{
                                fontSize: '56px',
                                color: '#BFBFBF',
                            }}
                        />
                    </div>
                </Upload>
                {logoList.map((item, index) => {
                    return (
                        <LogoItem
                            key={logoGetKey(index)}
                            item={item}
                            index={index}
                            handleDelete={handleLogoDel}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default Logo;
