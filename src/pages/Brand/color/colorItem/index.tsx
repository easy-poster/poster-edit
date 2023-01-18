import { IconFont } from '@/const';
import { tools } from '@/utils';
import { useDynamicList } from 'ahooks';
import { Card, Popover, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { ColorResult } from 'react-color';
import ColorPicker from '@/pages/Brand/components/ColorPicker';
import MoreEditMenu from '../../components/MoreEditMenu';
import styles from './index.less';

interface ColorItemProps {
    colorItem: { title: string; id: string; list: Array<string> };
    index: number;
    handleChange: (color: string, index: number) => void;
    handleAdd: (color: string) => void;
    handleDelete: (
        colorItem: any,
        index: number,
        event?: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    ) => void;
}

const ColorItem = React.memo(
    ({
        colorItem,
        index,
        handleAdd,
        handleChange,
        handleDelete,
    }: ColorItemProps) => {
        const {
            list: colors,
            remove: colorsRemove,
            getKey: colorsGetKey,
            insert: colorsInsert,
            replace: colorsRelace,
        } = useDynamicList(colorItem?.list || []);

        const [title, setTitle] = useState(colorItem.title);

        const handleChangeTitle = useCallback((value: string) => {
            setTitle(value);
        }, []);

        const handleChangeEnd = useCallback(() => {
            // 更新标题
        }, [title, colorItem.title]);

        const [activePopover, setActivePopover] = useState<
            number | undefined
        >();

        const handleUpdateColor = useCallback(() => {}, []);

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

        const handleColorDelete = (
            index: number,
            event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        ) => {
            event?.stopPropagation();
            colorsRemove(index);
        };

        const handleChangePickerColor = (color: ColorResult, index: number) => {
            if (color?.hex) {
                colorsRelace(index, color.hex);
            }
        };

        const handlePopoverOpenChange = useCallback((open: boolean) => {
            console.log('open', open);
            // 关闭时对比数据， 不同就更新服务器修改
            if (!open) {
                handleUpdateColor();
            }
        }, []);

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
                            tooltip: '重命名',
                            maxLength: 80,
                            onChange: (value) => handleChangeTitle(value),
                            onEnd: handleChangeEnd,
                        }}
                        level={5}
                    >
                        {colorItem.title}
                    </Typography.Title>
                }
                extra={<MoreEditMenu colorItem={colorItem} />}
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
