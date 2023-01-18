import React from 'react';
import { Upload, message } from 'antd';
import { useDynamicList } from 'ahooks';
import { IconFont } from '@/const';
import './index.less';
import Logo from './logo';
import Color from './color';
import Font from './font';

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

const Brand = React.memo(() => {
    // font
    const {
        list: fontList,
        resetList: fontResetList,
        remove: fontRemove,
        getKey: fontGetKey,
        unshift: fontUnshift,
        replace: fontRelace,
    } = useDynamicList(FONTLIST);

    const handleFontDel = (item: any, index: number) => {
        event?.stopPropagation();
        console.log('item del', item);
        fontRemove(index);
    };

    const handleAddFont = () => {
        fontUnshift({
            title: '新添加的',
            src: '',
            family: `Weibei SC`,
        });
    };

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

    return (
        <div className="brand-wrap">
            <h3 className="brand-title">品牌工具箱</h3>
            <div className="brand-banner">
                <h4>品牌工具箱为您的作品打上独一无二的标记</h4>
                <ul className="banner-list">
                    <li className="banner-li">
                        <IconFont
                            type="icon-duigou"
                            style={{ fontSize: '26px', color: '#5fd5a0' }}
                        />
                        <span className="li-content">
                            上传您独特的品牌logo、字体和颜色
                        </span>
                    </li>
                    <li className="banner-li">
                        <IconFont
                            type="icon-duigou"
                            style={{ fontSize: '26px', color: '#5fd5a0' }}
                        />
                        <span className="li-content">
                            更简单的方式保持品牌一致性
                        </span>
                    </li>
                    <li className="banner-li">
                        <IconFont
                            type="icon-duigou"
                            style={{ fontSize: '26px', color: '#5fd5a0' }}
                        />
                        <span className="li-content">轻松改变品牌吸引力</span>
                    </li>
                </ul>
                <div className="banner-btn">
                    构建您的品牌效应
                    <IconFont
                        type="icon-youjiantou"
                        style={{
                            fontSize: '30px',
                            marginLeft: 10,
                            color: '#FFF',
                        }}
                    />
                </div>
            </div>
            <Logo />
            <Color />
            <Font />
        </div>
    );
});

export default Brand;
