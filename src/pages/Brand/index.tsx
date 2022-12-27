import React, { useEffect, useState } from 'react';
import { Upload, message, Popover, Anchor } from 'antd';
import { useDynamicList } from 'ahooks';
import { RgbaColorPicker } from 'react-colorful';
import { IconFont } from '@/const';
import tools from '@/utils/tools';
import logoSvg from '@/assets/logo/color.svg';
import logoBlack from '@/assets/logo/black.svg';
import './index.less';

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

const COLORLIST = ['#5fd5a0', '#EEE', '#000'];

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

const Brand = () => {
    // logo
    const {
        list: logoList,
        resetList: logoResetList,
        remove: logoRemove,
        getKey: logoGetKey,
        unshift: logoUnshift,
        replace: logoRelace,
    } = useDynamicList(LOGOLIST);

    const handleLogoDel = (item: any, index, event) => {
        event?.stopPropagation();
        console.log('item del', item);
        logoRemove(index);
    };

    const handleAddLogo = () => {
        logoUnshift({
            id: 0,
            logo: logoSvg,
        });
    };

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

    // color
    const {
        list: colorList,
        resetList: colorResetList,
        remove: colorRemove,
        getKey: colorGetKey,
        insert: colorInsert,
        replace: colorRelace,
    } = useDynamicList(COLORLIST);

    useEffect(() => {
        colorResetList([...colorList, '']);
    }, []);
    console.log('list', colorList);
    const [currentColor, setCurrentColor] = useState('');
    const handleAddColor = (index: number) => {
        console.log('add color', index);
        let rColor = tools.randomColor();
        setCurrentColor(rColor);
        // const toBottom = document.documentElement.clientHeight - e.clientY
        // setColors([...colors, {id: COLORLIST.length, color: rColor}])
        colorInsert(index, rColor);
    };
    const handleColorChange = (color: any, index: any) => {
        if (color.hex) {
            setCurrentColor(color.hex);
            colorRelace(index, color.hex);
        }
    };

    const handleInitColor = (item: any) => {
        setCurrentColor(item);
    };

    const handleColorDel = (item: any, index, event) => {
        event?.stopPropagation();
        console.log('item del', item);
        colorRemove(index);
    };

    const ColorPicker = ({ index, activeColor, onChange }: any) => {
        const colorStyle = { default: { picker: { boxShadow: 'none' } } };

        return (
            <RgbaColorPicker
                color={activeColor}
                onChange={(color) => onChange(color, index)}
            />
        );
    };

    // font
    const {
        list: fontList,
        resetList: fontResetList,
        remove: fontRemove,
        getKey: fontGetKey,
        unshift: fontUnshift,
        replace: fontRelace,
    } = useDynamicList(FONTLIST);

    const handleFontDel = (item: any, index, event) => {
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
            <div className="brand-content" id="#logo-banner">
                <h4>品牌logo</h4>
                <div className="item-content">
                    <div className="logo-list">
                        <Upload {...uploadImgProps}>
                            <div className="logo-item upload-wrap">
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
                                <div
                                    className="logo-item"
                                    key={logoGetKey(index)}
                                >
                                    <img src={item.logo} alt="" />
                                    <IconFont
                                        className="del"
                                        onClick={(event) =>
                                            handleLogoDel(item, index, event)
                                        }
                                        type="icon-chacha"
                                        style={{
                                            fontSize: '20px',
                                            color: '#000',
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="brand-content">
                <h4>品牌颜色</h4>
                <div className="item-content">
                    <div className="color-list">
                        {colorList.map((item, index) => {
                            return (
                                <Popover
                                    autoAdjustOverflow={true}
                                    content={
                                        <ColorPicker
                                            index={index}
                                            color={currentColor}
                                            onChange={(color: any) =>
                                                handleColorChange(color, index)
                                            }
                                        />
                                    }
                                    trigger="click"
                                    key={colorGetKey(index)}
                                >
                                    {index === colorList.length - 1 ? (
                                        <div
                                            className="color-item"
                                            onClick={() =>
                                                handleAddColor(index)
                                            }
                                        >
                                            <IconFont
                                                type="icon-tianjia_huaban"
                                                style={{
                                                    fontSize: '42px',
                                                    color: '#BFBFBF',
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="color-item"
                                            onClick={() =>
                                                handleInitColor(item)
                                            }
                                        >
                                            <div
                                                className="color-bg"
                                                style={{ background: item }}
                                            ></div>
                                            <IconFont
                                                className="del"
                                                onClick={(event) =>
                                                    handleColorDel(
                                                        item,
                                                        index,
                                                        event,
                                                    )
                                                }
                                                type="icon-chacha"
                                                style={{
                                                    fontSize: '16px',
                                                    color: '#000',
                                                }}
                                            />
                                        </div>
                                    )}
                                </Popover>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="brand-content">
                <h4>品牌字体</h4>
                <div className="item-content">
                    <div className="font-list">
                        <Upload {...uploadFontProps}>
                            <div className="font-item upload-wrap">
                                <IconFont
                                    type="icon-tianjia_huaban"
                                    style={{
                                        fontSize: '56px',
                                        color: '#BFBFBF',
                                    }}
                                />
                            </div>
                        </Upload>
                        {fontList.map((item, index) => {
                            return (
                                <div
                                    className="font-item"
                                    key={fontGetKey(index)}
                                >
                                    <div className="font-bg">
                                        <div
                                            style={{ fontFamily: item.family }}
                                        >
                                            这是示例文字
                                        </div>
                                        <div className="tip">{item.title}</div>
                                    </div>
                                    <IconFont
                                        className="del"
                                        onClick={(event) =>
                                            handleFontDel(item, index, event)
                                        }
                                        type="icon-chacha"
                                        style={{
                                            fontSize: '16px',
                                            color: '#000',
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Brand;
