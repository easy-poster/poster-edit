import { AutoComplete } from 'antd';
import { history } from '@umijs/max';

import './index.less';

const renderTitle = (title: string) => (
    <span>
        {title}
        <a
            style={{ float: 'right' }}
            href="https://www.google.com/search?q=antd"
            target="_blank"
            rel="noopener noreferrer"
        >
            more
        </a>
    </span>
);

const renderItem = (title: string, count: number) => ({
    value: title,
    label: (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            {title}
            <span>{count}</span>
        </div>
    ),
});

const options = [
    {
        label: renderTitle('Libraries'),
        options: [
            renderItem('AntDesign', 10000),
            renderItem('AntDesign UI', 10600),
        ],
    },
    {
        label: renderTitle('Solutions'),
        options: [
            renderItem('AntDesign UI FAQ', 60100),
            renderItem('AntDesign FAQ', 30010),
        ],
    },
    {
        label: renderTitle('Articles'),
        options: [renderItem('AntDesign design language', 100000)],
    },
];

const SearchHeader = () => {
    const handleSearch = (value: string) => {
        history.push(`/search?q=${encodeURIComponent(value)}`);
    };

    return (
        <div className="search-header">
            <AutoComplete
                popupClassName="search-drop-wrap"
                dropdownMatchSelectWidth={252}
                style={{ minWidth: 300, maxWidth: 500 }}
                allowClear
                backfill
                options={options}
                onSearch={handleSearch}
                onSelect={handleSearch}
                placeholder="搜索模板"
            ></AutoComplete>
        </div>
    );
};

export default SearchHeader;
