import React, { useCallback, useState } from 'react';
import { Dropdown, MenuProps, Tooltip } from 'antd';
import { IconFont } from '@/const';
import BarButton from '../../components/BarButton';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';

const LayerBar = React.memo(() => {
    const [isOpenDrop, setIsOpenDrop] = useState(false);

    const handleLayerActive = useCallback((open: boolean) => {
        setIsOpenDrop(open);
    }, []);

    const handleMenuClick: MenuProps['onClick'] = ({ key, domEvent }) => {
        domEvent.stopPropagation();
        switch (+key) {
            case 1:
                BridgeController.LayerForward();
                break;
            case 2:
                BridgeController.LayerForward();
                break;
            case 3:
                BridgeController.LayerToFront();
                break;
            case 4:
                BridgeController.LayerToBack();
                break;
            default:
                break;
        }
    };

    const items: MenuProps['items'] = [
        {
            label: (
                <>
                    <IconFont
                        type="icon-shangyiyiceng"
                        style={{ fontSize: '24px' }}
                    />
                    &nbsp;上移一层
                </>
            ),
            key: 1,
        },
        {
            label: (
                <>
                    <IconFont
                        type="icon-xiayiyiceng"
                        style={{ fontSize: '24px' }}
                    />
                    &nbsp;下移一层
                </>
            ),
            key: 2,
        },
        {
            label: (
                <>
                    <IconFont
                        type="icon-zhiyudingceng"
                        style={{ fontSize: '24px' }}
                    />
                    &nbsp;置顶图层
                </>
            ),
            key: 3,
        },
        {
            label: (
                <>
                    <IconFont
                        type="icon-zhiyudiceng"
                        style={{ fontSize: '24px' }}
                    />
                    &nbsp;置底图层
                </>
            ),
            key: 4,
        },
    ];

    return (
        <Dropdown
            open={isOpenDrop}
            overlayClassName={styles.layerDropWrap}
            menu={{ items, onClick: handleMenuClick }}
            trigger={['click']}
            onOpenChange={handleLayerActive}
        >
            <Tooltip title="图层" placement="bottom">
                <BarButton active={isOpenDrop}>
                    <IconFont
                        type="icon-023tuceng"
                        style={{ fontSize: '24px' }}
                    />
                </BarButton>
            </Tooltip>
        </Dropdown>
    );
});

export default LayerBar;
