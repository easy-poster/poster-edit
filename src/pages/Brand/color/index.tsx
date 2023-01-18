import { useDynamicList } from 'ahooks';
import { List } from 'antd';
import React, { useCallback } from 'react';
import Header from '../components/Header';
import ColorItem from './colorItem';
import styles from './index.less';

const COLORLIST = [
    {
        title: 'eposter Web',
        id: '1',
        list: ['#5fd5a0', '#EEE', '#000'],
    },
    {
        title: 'eposter admin',
        id: '2',
        list: ['#5fd5a0', '#EEE', '#000'],
    },
];

const Color = React.memo(() => {
    const {
        list: colorList,
        resetList: colorResetList,
        remove: colorRemove,
        getKey: colorGetKey,
        insert: colorInsert,
        replace: colorRelace,
    } = useDynamicList(COLORLIST);

    const handleAdd = useCallback(() => {}, []);

    const handleChange = useCallback((color: string, index: number) => {}, []);

    const handleDelete = useCallback(() => {}, []);

    return (
        <div className={styles.color}>
            <Header title="品牌颜色" />
            <div className={styles.content}>
                <List
                    itemLayout="horizontal"
                    dataSource={colorList}
                    renderItem={(item, index) => (
                        <ColorItem
                            colorItem={item}
                            index={index}
                            handleChange={handleChange}
                            handleAdd={handleAdd}
                            handleDelete={handleDelete}
                        />
                    )}
                />
            </div>
        </div>
    );
});

export default Color;
