import { Button, message, Upload } from 'antd';
import React, { useCallback } from 'react';
import { useDynamicList } from 'ahooks';
import Header from '../components/Header';
import logoSvg from '@/assets/logo/color.svg';
import logoBlack from '@/assets/logo/black.svg';
import styles from './index.less';
import { IconFont } from '@/const';
import LogoItem from './logoItem';

const LOGOLIST = [
    {
        id: 1,
        logo: logoSvg,
    },
    {
        id: 2,
        logo: logoBlack,
    },
];

const Logo = React.memo(() => {
    const {
        list: logoList,
        remove: logoRemove,
        getKey: logoGetKey,
        unshift: logoUnshift,
    } = useDynamicList(LOGOLIST);

    const handleAddLogo = useCallback(() => {
        logoUnshift({
            id: 0,
            logo: logoSvg,
        });
    }, []);

    const handleLogoDel = useCallback(
        (
            item: any,
            index: number,
            event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        ) => {
            event?.stopPropagation();
            logoRemove(index);
        },
        [],
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
                message.success(`${info.file.name} file uploaded successfully`);
                handleAddLogo();
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <div className={styles.logo}>
            <Header
                title="品牌Logo"
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
                        onClick={handleAddLogo}
                    >
                        上传Logo
                    </Button>
                }
            />
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
