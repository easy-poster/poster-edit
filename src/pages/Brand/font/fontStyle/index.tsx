import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSetState } from 'ahooks';
import cx from 'classnames';
import styles from './index.less';
import { getBrandActFonts } from '@/services/brand';
import { BrandKitContext } from '../../container/BrandKitContainer';

const FontStyle = React.memo(() => {
    const stylesList = [
        {
            id: 0,
            fontFamily: 'Couries New Bold',
            fontSize: 28,
            fontWeight: 'bold',
            fontStyle: 'normal', // italic
            text: '标题',
        },
        {
            id: 1,
            fontFamily: 'Couries New Bold',
            fontSize: 18,
            fontWeight: 'bold',
            fontStyle: 'normal', // italic
            text: '副标题',
        },
        {
            id: 2,
            fontFamily: 'Couries New Bold',
            fontSize: 14,
            fontWeight: 'bold',
            fontStyle: 'normal', // italic
            text: '正文',
        },
    ];

    const [title, setTitle] = useSetState({
        fontFamily: '',
        fontSize: 28,
        fontWeight: 'bold',
        fontStyle: 'normal',
    });

    const [subTitle, setSubTitle] = useSetState({
        fontFamily: '',
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'normal',
    });

    const [subText, setText] = useSetState({
        fontFamily: '',
        fontSize: 14,
        fontWeight: 'bold',
        fontStyle: 'normal',
    });

    const { kitInfo, getDetail } = useContext(BrandKitContext);

    const handleGetFontsActive = useCallback(async () => {
        if (!kitInfo?.id) return;
        try {
            let res = await getBrandActFonts({
                brandId: kitInfo.id,
            });

            console.log('active fonts', res);
        } catch (error) {}
    }, [kitInfo]);

    useEffect(() => {
        handleGetFontsActive();
    }, [kitInfo?.id]);

    return (
        <div className={styles.fontStyle}>
            {stylesList.map((it) => {
                switch (it.id) {
                    case 0:
                        return (
                            <div
                                key={it.id}
                                className={cx(styles.text)}
                                style={{
                                    fontFamily: title.fontFamily,
                                    fontSize: title.fontSize,
                                    fontWeight: title.fontWeight,
                                    fontStyle: title.fontStyle,
                                }}
                            >
                                {it.text}, {it.fontFamily}, {it.fontSize}
                            </div>
                        );
                    case 1:
                        return (
                            <div
                                key={it.id}
                                className={cx(styles.text)}
                                style={{
                                    fontFamily: subTitle.fontFamily,
                                    fontSize: subTitle.fontSize,
                                    fontWeight: subTitle.fontWeight,
                                    fontStyle: subTitle.fontStyle,
                                }}
                            >
                                {it.text}, {it.fontFamily}, {it.fontSize}
                            </div>
                        );
                    case 2:
                        return (
                            <div
                                key={it.id}
                                className={cx(styles.text)}
                                style={{
                                    fontFamily: subText.fontFamily,
                                    fontSize: subText.fontSize,
                                    fontWeight: subText.fontWeight,
                                    fontStyle: subText.fontStyle,
                                }}
                            >
                                {it.text}, {it.fontFamily}, {it.fontSize}
                            </div>
                        );
                    default:
                        return <></>;
                }
            })}
        </div>
    );
});

export default FontStyle;
