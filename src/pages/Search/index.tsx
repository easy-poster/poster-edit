import React, { useMemo } from 'react';
import { List, Select } from 'antd';
import { useParams } from '@umijs/max';
import demoImg from '@/assets/demo.png';
import './index.less';

const { Option } = Select;

const Search = () => {
    const params = useParams();
    console.log('params', params);
    const LIST = useMemo(() => {
        let arr = [];
        for (let i = 0; i < 18; i++) {
            arr.push({
                title: `slider${i}`,
                cover: demoImg,
            });
        }
        return arr;
    }, []);

    const handleGoDetail = (item: any) => {};

    return (
        <div className="search-wrap">
            <div className="filter">
                <div className="filter-left">
                    <div className="title">筛选</div>
                    <p>搜索结果：233条</p>
                </div>
                <Select
                    popupClassName="search-filter-wrap"
                    dropdownMatchSelectWidth={false}
                    placement="bottomRight"
                    defaultValue="1"
                    style={{ width: 100 }}
                    bordered={false}
                >
                    <Option value="1">全部</Option>
                    <Option value="2">免费</Option>
                    <Option value="3">付费</Option>
                </Select>
            </div>
            <div className="content">
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 3,
                        xl: 4,
                        xxl: 5,
                    }}
                    dataSource={LIST}
                    renderItem={(item) => (
                        <List.Item>
                            <div
                                className="card-item"
                                onClick={() => handleGoDetail(item)}
                            >
                                <img
                                    className="card-cover"
                                    alt="example"
                                    src={item.cover}
                                />
                                <p className="title">{item.title}</p>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default Search;
