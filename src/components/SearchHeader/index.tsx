import React from 'react';
import { Input, AutoComplete } from 'antd';
import './index.less';

const SearchHeader = () => {
  return (
    <div className="search-header">
      <input
        placeholder="Custom focus style"
        className="border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
      />
    </div>
  );
};

export default SearchHeader;
