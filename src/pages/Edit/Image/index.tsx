import React, { useMemo, useRef, useState } from 'react';
import { AutoComplete, SelectProps, Breadcrumb } from 'antd';
import demoImg from '@/assets/demo.png';
import { IconFont } from '@/const';
import { useSize } from 'ahooks';
import './index.less';

function getRandomInt(max: number, min: number = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
}

const searchResult = (query: string) =>
    new Array(getRandomInt(5))
        .join('.')
        .split('.')
        .map((_, idx) => {
            const category = `${query}${idx}`;
            return {
                value: category,
                label: (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span>
                            Found {query} on{' '}
                            <a
                                href={`https://s.taobao.com/search?q=${query}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {category}
                            </a>
                        </span>
                        <span>{getRandomInt(200, 100)} results</span>
                    </div>
                ),
            };
        });

const ImagePage = React.memo(() => {
    const [options, setOptions] = useState<SelectProps<object>['options']>([]);

    const handleSearch = (value: string) => {
        setOptions(value ? searchResult(value) : []);
    };

    const onSelect = (value: string) => {
        console.log('onSelect', value);
    };

    const preListRef = useRef(null);
    const size = useSize(preListRef);

    const columsNum = useMemo(() => {
        if (size?.width) {
            console.log('size?.width', size?.width);
            let width = size?.width;
            if (width > 800) {
                return 6;
            } else if (width > 600) {
                return 5;
            } else if (width > 400) {
                return 4;
            } else {
                return 3;
            }
        }
    }, [size?.width]);

    const LIST = useMemo(() => {
        let arr = [];
        if (columsNum) {
            for (let i = 0; i < columsNum; i++) {
                arr.push({
                    title: `slider${i}`,
                    cover: demoImg,
                });
            }
        }
        return arr;
    }, [columsNum]);

    const SLIST = useMemo(() => {
        let arr = [];
        for (let i = 0; i < 18; i++) {
            arr.push({
                title: `slider${i}`,
                id: i,
                cover: demoImg,
            });
        }
        return arr;
    }, []);

    console.log('columsNum', columsNum, LIST);

    const handleAdd = (data: any) => {
        console.log('add', data);
    };

    const [isMore, setIsMore] = useState(false);
    const handleGoMore = (data: any) => {
        console.log('gomore', data);
        setIsMore(true);
    };

    const handleGoAll = () => {
        setIsMore(false);
    };

    return (
        <div className="image-wrap">
            <div className="search-wrap">
                <AutoComplete
                    popupClassName="image-search-wrap"
                    // dropdownMatchSelectWidth={252}
                    style={{ width: '100%' }}
                    allowClear
                    backfill
                    options={options}
                    onSelect={onSelect}
                    onSearch={handleSearch}
                    placeholder="搜索图像"
                ></AutoComplete>
                {isMore && (
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item
                            className="bread-item-all"
                            onClick={handleGoAll}
                        >
                            所有分类
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>images demo</Breadcrumb.Item>
                    </Breadcrumb>
                )}
            </div>
            {isMore ? (
                <div className="more-list">
                    {SLIST.map((item) => {
                        return (
                            <div className="img-item" key={item.id}>
                                <div className="img-wrap">
                                    <img
                                        className="img-cover"
                                        alt="example"
                                        src={item.cover}
                                    />
                                    <div className="edit-wrap">
                                        <div
                                            className="img-btn edit-del"
                                            // onClick={() => handleDel(item)}
                                        >
                                            <IconFont
                                                type="icon-gengduo"
                                                style={{ fontSize: '14px' }}
                                            />
                                        </div>
                                        <div
                                            className="img-btn edit-add"
                                            onClick={() => handleAdd(item)}
                                        >
                                            <IconFont
                                                type="icon-tianjia_huaban"
                                                style={{ fontSize: '16px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="img-list">
                    <div className="pre-img-item">
                        <div className="pre-title">images demo</div>
                        <div
                            className="pre-list"
                            ref={preListRef}
                            style={{
                                gridTemplateColumns: `repeat(${columsNum}, 1fr)`,
                            }}
                        >
                            {LIST.map((item, index) => (
                                <div className="item_img" key={item.title}>
                                    <img src={item.cover} alt={item.title} />
                                    {LIST.length - 1 === index ? (
                                        <div
                                            className="right-btn"
                                            onClick={() => handleGoMore(item)}
                                        >
                                            <IconFont
                                                type="icon-xiangyou"
                                                style={{ fontSize: '24px' }}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="img-btn edit-add"
                                            onClick={() => handleAdd(item)}
                                        >
                                            <IconFont
                                                type="icon-tianjia_huaban"
                                                style={{ fontSize: '16px' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default ImagePage;
