import React from 'react';
import { Dropdown, MenuProps } from 'antd';
import { IconFont } from '@/const';
import styles from './index.less';

interface MoreEditMenuProps {
    items: MenuProps['items'];
}

const MoreEditMenu = React.memo<MoreEditMenuProps>(({ items }) => {
    return (
        <Dropdown
            menu={{ items }}
            placement="bottomRight"
            arrow
            trigger={['click']}
        >
            <IconFont type="icon-gengduo" style={{ fontSize: '24px' }} />
        </Dropdown>
    );
});

export default MoreEditMenu;
