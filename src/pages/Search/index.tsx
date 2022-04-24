import React from 'react';
import { Select } from 'antd';
import { useParams } from 'umi';
import './index.less';

const { Option } = Select;

const Search = () => {
  const params = useParams();
  console.log('params', params);

  return (
    <div className="search-wrap">
      <div className="filter">
        <div className="filter-left">
          <div className="title">筛选</div>
          <p>搜索结果：233条</p>
        </div>
        <Select
          dropdownClassName="search-filter-wrap"
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
      <div className="content">content</div>
    </div>
  );
};

export default Search;
