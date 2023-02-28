import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import demoImg from '@/assets/demo.png';
import { IconFont } from '@/const';
import { Input, message } from 'antd';
import { FabricObjectType } from '../Stage/canvas/const/defaults';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';

const TextPage = React.memo(() => {
    const LIST = useMemo(() => {
        let arr = [];
        for (let i = 0; i < 18; i++) {
            arr.push({
                id: i,
                title: `slider${i}`,
                cover: demoImg,
            });
        }
        return arr;
    }, []);

    const handleChangeSearch = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            console.log('e', e.target.value);
        },
        [],
    );

    const handlePressEnter = useCallback((e: any) => {
        console.log('e1', e.target.value);
    }, []);

    const handleAdd = (data: any) => {
        BridgeController.AddResource({
            id: data.id,
            type: FabricObjectType.TEXTBOX,
            text: data.text,
            fontSize: data.fontSize,
        });
    };

    return (
        <div className={styles.textWrap}>
            <div className={styles.textSearch}>
                <Input
                    size="large"
                    placeholder="字体名字"
                    allowClear
                    onChange={handleChangeSearch}
                    onPressEnter={handlePressEnter}
                    prefix={
                        <IconFont
                            type="icon-sousuo"
                            style={{ fontSize: '24px' }}
                        />
                    }
                />
            </div>
            <div className={styles.textAddWrap}>
                <div
                    className={cn(styles.textBtn, styles.textTitle)}
                    onClick={() =>
                        handleAdd({ text: '添加标题', fontSize: 52 })
                    }
                >
                    添加标题
                </div>
                <div
                    className={cn(styles.textBtn, styles.textSubTitle)}
                    onClick={() =>
                        handleAdd({ text: '添加副标题', fontSize: 36 })
                    }
                >
                    添加副标题
                </div>
                <div
                    className={cn(styles.textBtn, styles.textNomal)}
                    onClick={() =>
                        handleAdd({ text: '添加一段文本', fontSize: 24 })
                    }
                >
                    添加一段文本
                </div>
            </div>
            <div className={styles.textList}>
                {LIST.map((item) => {
                    return (
                        <div className={styles.imgItem} key={item.id}>
                            <div className={styles.imgWrap}>
                                <img
                                    className={styles.imgCover}
                                    alt="example"
                                    src={item.cover}
                                />
                                <div
                                    className={cn(
                                        styles.imgBtn,
                                        styles.editAdd,
                                    )}
                                    onClick={() => handleAdd(item)}
                                >
                                    <IconFont
                                        type="icon-tianjia_huaban"
                                        style={{ fontSize: '16px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

export default TextPage;
