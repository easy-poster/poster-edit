import { IconFont } from '@/const';
import emitter, { BRAND } from '@/helper/emitter';
import { brandType, getBrandDetail, saveBrand } from '@/services/brand';
import { useDynamicList } from 'ahooks';
import { Button, message, Tabs, Tooltip, Upload } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import { BrandKitContext } from '../container/BrandKitContainer';
import FontList from './fontList';
import FontStyle from './fontStyle';
import styles from './index.less';

const Font = React.memo(() => {
    const { kitInfo, getDetail } = useContext(BrandKitContext);

    const [activeTab, setActiveTab] = useState('1');

    const FONTLIST = [
        {
            title: '正楷',
            src: '',
            family: `'Courier New', Courier, monospace`,
        },
        {
            title: '娃娃体',
            src: '',
            family: `Wawati SC`,
        },
        {
            title: '魏碑',
            src: '',
            family: `Weibei SC`,
        },
    ];

    const handleAddFont = useCallback(async () => {
        if (!kitInfo?.id) return;
        try {
            await saveBrand(
                {
                    type: brandType.FONT,
                    brandId: kitInfo.id,
                },
                {
                    fontName: '字体名字',
                    fontNormalUrl: 'https://aaaa.com',
                },
            );
            setActiveTab('2');
            emitter.emit(BRAND.REFRESH_FONT);
            message.success('上传成功');
        } catch (error) {}
    }, [kitInfo]);

    const uploadFontProps = {
        accept: 'text/*',
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
                handleAddFont();
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const handleTabChange = (active: string) => {
        setActiveTab(active);
    };

    return (
        <div className={styles.font}>
            <Header
                title="品牌字体"
                rightExtra={
                    <Tooltip title="字体文件一般是带有eot、otf、fon、font、ttf、ttc、woff等后缀的文件">
                        <Upload {...uploadFontProps}>
                            <Button
                                icon={
                                    <IconFont
                                        type="icon-tianjia_huaban"
                                        style={{
                                            fontSize: '18px',
                                        }}
                                    />
                                }
                            >
                                上传字体文件
                            </Button>
                        </Upload>
                    </Tooltip>
                }
            />
            <div className={styles.content}>
                <Tabs
                    activeKey={activeTab}
                    items={[
                        {
                            label: '文字样式',
                            key: '1',
                            children: <FontStyle />,
                        },
                        {
                            label: '已上传字体',
                            key: '2',
                            children: <FontList />,
                        },
                    ]}
                    onChange={handleTabChange}
                ></Tabs>
            </div>
        </div>
    );
});

export default Font;
