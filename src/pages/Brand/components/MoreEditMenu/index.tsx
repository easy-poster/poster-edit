import React, { useCallback } from 'react';
import { Dropdown, MenuProps, Modal } from 'antd';
import { IconFont } from '@/const';
import styles from './index.less';

interface MoreEditMenuProps {
    colorItem: { title: string; id: string; list: Array<string> };
}

const MoreEditMenu = React.memo(({ colorItem }: MoreEditMenuProps) => {
    const handleCopy = useCallback(() => {
        console.log('复制');
    }, []);

    const handleOkDel = useCallback(() => {
        console.log('删除');
    }, []);

    const handleDel = useCallback(() => {
        Modal.confirm({
            title: '是否确定删除？',
            className: styles.delModal,
            content: (
                <>
                    <p>
                        你将删除<span>{colorItem.title}</span>
                        的颜色，此操作无法撤销
                    </p>
                    <p>现有设计不会受到影响</p>
                </>
            ),
            icon: null,
            centered: true,
            cancelText: '取消',
            okText: '是, 删除',
            okButtonProps: {
                type: 'primary',
                danger: true,
            },
            onOk: handleOkDel,
        });
    }, []);

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: <div onClick={handleCopy}>复制</div>,
        },
        {
            key: '2',
            label: <div onClick={handleDel}>删除调色板</div>,
        },
    ];

    return (
        <Dropdown
            menu={{ items }}
            placement="bottomRight"
            arrow
            trigger={['click']}
        >
            <IconFont type="icon-gengduo" />
        </Dropdown>
    );
});

export default MoreEditMenu;
