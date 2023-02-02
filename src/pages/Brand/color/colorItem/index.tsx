import { IconFont } from '@/const';
import { tools } from '@/utils';
import { useDynamicList } from 'ahooks';
import { Card, MenuProps, Modal, Popover, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { ColorResult } from 'react-color';
import ColorPicker from '@/pages/Brand/components/ColorPicker';
import MoreEditMenu from '../../components/MoreEditMenu';
import styles from './index.less';
import { brandType, delBrand, saveBrand, updateBrand } from '@/services/brand';
import { kitItem } from '../../container';

interface ColorItemProps {
    kitInfo?: kitItem;
    colorItem: { colorName: string; id?: string; colorValues: Array<string> };
    isNew: boolean;
    getColorList: () => void;
}

const ColorItem = React.memo(
    ({ kitInfo, colorItem, isNew, getColorList }: ColorItemProps) => {
        console.log('colorItem', colorItem);

        const [activePopover, setActivePopover] = useState<
            number | undefined
        >();
        const {
            list: colors,
            resetList: colorsReset,
            getKey: colorsGetKey,
            insert: colorsInsert,
            replace: colorsRelace,
        } = useDynamicList(colorItem?.colorValues || []);

        const [title, setTitle] = useState('');

        // 修改调色板名字
        const handleChangeTitle = useCallback(
            async (value: string) => {
                if (value) {
                    setTitle(value);
                    try {
                        if (isNew && kitInfo?.id) {
                            await saveBrand(
                                {
                                    type: brandType.COLOR,
                                    brandId: kitInfo.id,
                                },
                                {
                                    colorName: value,
                                },
                            );
                        } else {
                            if (!colorItem.id) return;
                            await updateBrand(
                                {
                                    type: brandType.COLOR,
                                    id: colorItem.id,
                                },
                                {
                                    colorName: value,
                                },
                            );
                        }
                    } catch (error) {}
                    getColorList();
                } else {
                    if (colorItem?.colorName) {
                        setTitle(colorItem.colorName);
                    }
                }
            },
            [title, colorItem?.id, isNew, kitInfo?.id],
        );

        /**
         * @todo 应该后台处理复制
         */
        const handleCopy = useCallback(async () => {
            if (!kitInfo?.id) return;
            try {
                await saveBrand(
                    {
                        type: brandType.COLOR,
                        brandId: kitInfo.id,
                    },
                    {
                        colorName: colorItem.colorName,
                        colorValues: colors,
                    },
                );

                getColorList();
            } catch (error) {}
        }, [colors, kitInfo?.id, colorItem]);

        const handleOkDel = useCallback(async () => {
            if (!colorItem.id) return;
            try {
                await delBrand({
                    type: brandType.COLOR,
                    id: colorItem.id,
                });
                getColorList();
            } catch (error) {}
        }, [colorItem?.id]);

        const handleDel = useCallback(() => {
            Modal.confirm({
                title: '是否确定删除？',
                className: styles.delModal,
                content: (
                    <>
                        <p>
                            你将删除
                            <span style={{ fontWeight: 'bolder' }}>
                                &nbsp;{colorItem.colorName}&nbsp;
                            </span>
                            的颜色，此操作无法撤销
                        </p>
                        <p>现有设计不会受到影响</p>
                    </>
                ),
                icon: null,
                centered: true,
                cancelText: '取消',
                okText: '是, 删除',
                okButtonProps: {
                    type: 'primary',
                    danger: true,
                },
                onOk: handleOkDel,
            });
        }, [colorItem]);

        const items: MenuProps['items'] = [
            {
                key: '1',
                label: <div onClick={handleCopy}>复制</div>,
            },
            {
                key: '2',
                label: <div onClick={handleDel}>删除调色板</div>,
            },
        ];

        const handleUpdateColor = useCallback(async () => {
            try {
                if (isNew && kitInfo?.id) {
                    await saveBrand(
                        {
                            type: brandType.COLOR,
                            brandId: kitInfo.id,
                        },
                        {
                            colorValues: colors,
                        },
                    );
                } else {
                    if (!colorItem.id) return;
                    await updateBrand(
                        {
                            type: brandType.COLOR,
                            id: colorItem.id,
                        },
                        {
                            colorValues: colors,
                        },
                    );
                }
            } catch (error) {}
            getColorList();
        }, [colors, colorItem?.id, isNew, kitInfo?.id]);

        const handleAddColor = (
            index: number,
            event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        ) => {
            event?.stopPropagation();
            colorsInsert(index, tools.randomColor16());
            setActivePopover(index);
        };

        const handleCurrentColor = useCallback(
            (
                index: number,
                event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
            ) => {
                event?.stopPropagation();
                setActivePopover(index);
            },
            [],
        );

        const handleColorDelete = useCallback(
            async (
                index: number,
                event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
            ) => {
                event?.stopPropagation();
                if (!colorItem.id) return;
                colors.splice(index, 1);
                await updateBrand(
                    {
                        type: brandType.COLOR,
                        id: colorItem.id,
                    },
                    {
                        colorValues: colors,
                    },
                );
                getColorList();
            },
            [colors, colorItem?.id],
        );

        const handleChangePickerColor = (color: ColorResult, index: number) => {
            if (color?.hex) {
                colorsRelace(index, color.hex);
            }
        };

        // 这个有闭包，有问题
        const handlePopoverOpenChange = useCallback(
            (open: boolean) => {
                console.log('open', open);
                // 关闭时对比数据， 不同就更新服务器修改
                if (!open) {
                    handleUpdateColor();
                }
            },
            [colorItem?.id, colors],
        );

        /**
         * @todo 有闪烁问题，要解决掉
         */
        useEffect(() => {
            setTitle(colorItem.colorName || '');
        }, [colorItem.colorName]);

        useEffect(() => {
            colorsReset(colorItem.colorValues || []);
        }, [colorItem.colorValues]);

        // 点击其他地方关闭popover
        useEffect(() => {
            const fn = () => {
                setActivePopover(undefined);
            };
            window.addEventListener('click', fn);
            return () => {
                window.removeEventListener('click', fn);
            };
        }, []);

        return (
            <Card
                className={styles.colorItem}
                title={
                    <Typography.Title
                        editable={{
                            autoSize: {
                                minRows: 1,
                                maxRows: 1,
                            },
                            text: title,
                            tooltip: '点击重命名',
                            maxLength: 80,
                            enterIcon: null,
                            onChange: handleChangeTitle,
                        }}
                        level={5}
                    >
                        {title}
                    </Typography.Title>
                }
                extra={<MoreEditMenu items={items} />}
            >
                <div className={styles.colorContent}>
                    {colors.map((it: string, i: number) => {
                        return (
                            <Popover
                                autoAdjustOverflow={true}
                                destroyTooltipOnHide
                                content={
                                    <ColorPicker
                                        activeColor={it}
                                        onChangeColor={(color: ColorResult) =>
                                            handleChangePickerColor(color, i)
                                        }
                                    />
                                }
                                onOpenChange={handlePopoverOpenChange}
                                open={activePopover === i}
                                trigger="click"
                                key={colorsGetKey(i)}
                            >
                                <div
                                    className={styles.colorSingle}
                                    onClick={(event) =>
                                        handleCurrentColor(i, event)
                                    }
                                >
                                    <div
                                        className={styles.colorBg}
                                        style={{ background: it }}
                                    ></div>
                                    <IconFont
                                        className={styles.del}
                                        onClick={(event) =>
                                            handleColorDelete(i, event)
                                        }
                                        type="icon-chacha"
                                        style={{
                                            fontSize: '16px',
                                            color: '#000',
                                        }}
                                    />
                                </div>
                            </Popover>
                        );
                    })}
                    <div
                        className={styles.colorSingle}
                        onClick={(event) =>
                            handleAddColor(colors.length, event)
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
                </div>
            </Card>
        );
    },
);

export default ColorItem;
