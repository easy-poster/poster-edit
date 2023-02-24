import React, { useCallback, useContext, useState } from 'react';
import {
    OperatingPanelContext,
    OperatingPanelType,
} from '@/pages/Edit/Container/OperatingPanelContainer';
import BarButton from '../components/BarButton';
import styles from './index.less';
import { Dropdown, MenuProps } from 'antd';
import { IconFont } from '@/const';
import BridgeController from '@/helper/bridge/BridgeController';

const ImageBar = React.memo(() => {
    const { panelType, setPanelType } = useContext(OperatingPanelContext);

    const [isOpenDrop, setIsOpenDrop] = useState(false);

    const handleEdit = useCallback(() => {
        setPanelType(
            OperatingPanelType.IMAGE === panelType
                ? OperatingPanelType.NONE
                : OperatingPanelType.IMAGE,
        );
    }, [panelType]);

    const handleMenuClick: MenuProps['onClick'] = ({ key, domEvent }) => {
        domEvent.stopPropagation();
        BridgeController.FlipImage(+key);
    };

    const items: MenuProps['items'] = [
        {
            label: (
                <>
                    <IconFont
                        type="icon-zuoyoufanzhuan_huaban1"
                        style={{ fontSize: '24px' }}
                    />
                    &nbsp;水平翻转
                </>
            ),
            key: 0,
        },
        {
            type: 'divider',
        },
        {
            label: (
                <>
                    <IconFont
                        type="icon-chuizhifanzhuan_huaban1"
                        style={{ fontSize: '24px' }}
                    />
                    &nbsp;垂直翻转
                </>
            ),
            key: 1,
        },
    ];

    const handleFlipActive = useCallback((open: boolean) => {
        setIsOpenDrop(open);
    }, []);

    return (
        <div className={styles.imageBarWrap}>
            <BarButton
                onClick={handleEdit}
                active={OperatingPanelType.IMAGE === panelType}
            >
                编辑图像
            </BarButton>
            <Dropdown
                open={isOpenDrop}
                overlayClassName={styles.flipDropWrap}
                menu={{ items, onClick: handleMenuClick }}
                trigger={['click']}
                onOpenChange={handleFlipActive}
            >
                <BarButton active={isOpenDrop}>翻转</BarButton>
            </Dropdown>
        </div>
    );
});

export default ImageBar;
