import React, { useCallback, useContext } from 'react';
import { Input, Select } from 'antd';
import HeaderTitle from '@/components/HeaderTitle';
import styles from './index.less';
import { ProjectListContext } from '../Container/ProjectListContainer';
import { OrderTypes } from '@/services/project';
import { useDebounceFn } from 'ahooks';

const { Option } = Select;

const PeojectHeader = React.memo(() => {
    const {
        searchValue,
        setSearchValue,
        orderType,
        setOrderType,
        setCurrentPage,
    } = useContext(ProjectListContext);

    const handleSearch = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setCurrentPage(1);
        setSearchValue(e.target.value);
    };

    const handleSeleact = useCallback((value: OrderTypes) => {
        setOrderType(value);
    }, []);

    return (
        <div className={styles.headerWrap}>
            <HeaderTitle
                title="最近的作品"
                rightExtra={
                    <div className={styles.rightExtra}>
                        <Input
                            placeholder="最近的作品"
                            value={searchValue}
                            allowClear
                            onChange={handleSearch}
                        />
                        <Select
                            popupClassName={styles.cardFilterWrap}
                            dropdownMatchSelectWidth={false}
                            placement="bottomRight"
                            defaultValue={orderType}
                            style={{ width: 100 }}
                            bordered={false}
                            onChange={handleSeleact}
                            value={orderType}
                        >
                            <Option value="time">最新</Option>
                            <Option value="name">名称</Option>
                            <Option value="size">大小</Option>
                        </Select>
                    </div>
                }
            />
        </div>
    );
});

export default PeojectHeader;
