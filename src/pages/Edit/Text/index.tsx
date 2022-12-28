import React, { useMemo, useState } from 'react';
import demoImg from '@/assets/demo.png';
import './index.less';
import { IconFont } from '@/const';
import { AutoComplete, message, SelectProps } from 'antd';
import { FabricObjectType } from '../Stage/canvas/const/defaults';

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

const TextPage = () => {
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

    const [options, setOptions] = useState<SelectProps<object>['options']>([]);

    const handleSearch = (value: string) => {
        setOptions(value ? searchResult(value) : []);
    };

    const onSelect = (value: string) => {
        console.log('onSelect', value);
    };

    const handleAdd = (data: any) => {
        if (!window.handler) {
            message.warning('项目正在初始化');
            return;
        }
        window.handler.add({ type: FabricObjectType.TEXTBOX, text: data });
    };

    return (
        <div className="text-wrap">
            <div className="text-search">
                <AutoComplete
                    popupClassName="image-search-wrap"
                    style={{ width: '100%' }}
                    allowClear
                    backfill
                    options={options}
                    onSelect={onSelect}
                    onSearch={handleSearch}
                    placeholder="搜索文字"
                ></AutoComplete>
                <div
                    className="text-nomal"
                    onClick={() => handleAdd('添加一段文本')}
                >
                    添加一段文本
                </div>
            </div>
            <div className="text-list">
                {LIST.map((item) => {
                    return (
                        <div className="img-item" key={item.id}>
                            <div className="img-wrap">
                                <img
                                    className="img-cover"
                                    alt="example"
                                    src={item.cover}
                                />
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
                            <p className="title">{item.title}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TextPage;
