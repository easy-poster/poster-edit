import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu, MenuProps } from 'antd';
import cn from 'classnames';
import BridgeEmitter, { F2N } from '@/helper/bridge/BridgeEmitter';
import BridgeController from '@/helper/bridge/BridgeController';
import { IconFont } from '@/const';
import styles from './index.less';

/**
 * @description 右键菜单modal
 */
const ContextMenu = React.memo(() => {
    const [isShow, setIsShow] = useState(false);
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    const [contextObj, setContextObj] = useState<FabricObject | undefined>();

    const items = [
        {
            disabled: false,
            label: (
                <div className={styles.menuItemWrap}>
                    <div className={styles.left}>
                        <IconFont
                            type="icon-fuzhi1"
                            style={{ fontSize: '24px' }}
                        />
                        <span>复制</span>
                    </div>
                    <div className={styles.right}>
                        <span>CTRL</span>
                        <span>C</span>
                    </div>
                </div>
            ),
            key: 1,
        },
        {
            disabled: false,
            label: (
                <div className={styles.menuItemWrap}>
                    <div className={styles.left}>
                        <IconFont
                            type="icon-niantie"
                            style={{ fontSize: '24px' }}
                        />
                        <span>粘贴</span>
                    </div>
                    <div className={styles.right}>
                        <span>CTRL</span>
                        <span>V</span>
                    </div>
                </div>
            ),
            key: 2,
        },
        {
            disabled: false,
            label: (
                <div className={styles.menuItemWrap}>
                    <div className={styles.left}>
                        <IconFont
                            type="icon-jiesuo"
                            style={{ fontSize: '24px' }}
                        />
                        <span>锁定</span>
                    </div>
                    <div className={styles.right}>
                        <span>CTRL</span>
                        <span>L</span>
                    </div>
                </div>
            ),
            key: 3,
        },
        {
            disabled: false,
            label: (
                <div className={styles.menuItemWrap}>
                    <div className={styles.left}>
                        <IconFont
                            type="icon-lajitong"
                            style={{ fontSize: '24px' }}
                        />
                        <span>删除</span>
                    </div>
                    <div className={styles.right}>
                        <span>DELETE</span>
                    </div>
                </div>
            ),
            key: 4,
        },
        {
            disabled: false,
            label: (
                <div className={styles.menuItemWrap}>
                    <div className={styles.left}>
                        <IconFont
                            type="icon-shangyiyiceng"
                            style={{ fontSize: '24px' }}
                        />
                        <span>上移一层</span>
                    </div>
                    <div className={styles.right}>
                        <span>CTRL</span>
                        <span>]</span>
                    </div>
                </div>
            ),
            key: 5,
        },
        {
            disabled: false,
            label: (
                <div className={styles.menuItemWrap}>
                    <div className={styles.left}>
                        <IconFont
                            type="icon-xiayiyiceng"
                            style={{ fontSize: '24px' }}
                        />
                        <span>下移一层</span>
                    </div>
                    <div className={styles.right}>
                        <span>CTRL</span>
                        <span>[</span>
                    </div>
                </div>
            ),
            key: 6,
        },
        {
            disabled: false,
            label: (
                <div className={styles.menuItemWrap}>
                    <div className={styles.left}>
                        <IconFont
                            type="icon-zhiyudingceng"
                            style={{ fontSize: '24px' }}
                        />
                        <span>置顶图层</span>
                    </div>
                    <div className={styles.right}>
                        <span>CTRL</span>
                        <span>ALT</span>
                        <span>]</span>
                    </div>
                </div>
            ),
            key: 7,
        },
        {
            disabled: false,
            label: (
                <div className={styles.menuItemWrap}>
                    <div className={styles.left}>
                        <IconFont
                            type="icon-zhiyudiceng"
                            style={{ fontSize: '24px' }}
                        />
                        <span>置底图层</span>
                    </div>
                    <div className={styles.right}>
                        <span>CTRL</span>
                        <span>ALT</span>
                        <span>[</span>
                    </div>
                </div>
            ),
            key: 8,
        },
    ];

    const itemMemo: MenuProps['items'] = useMemo(() => {
        return items.map((it) => {
            return {
                ...it,
                ...{
                    disabled: !contextObj && it?.key !== 2 ? true : false,
                },
            };
        });
    }, [items, contextObj]);

    const handleMenuClick: MenuProps['onClick'] = ({ key, domEvent }) => {
        domEvent.stopPropagation();
        switch (+key) {
            case 1:
                BridgeController.copyObject();
                break;
            case 2:
                BridgeController.pasteObject();
                break;
            case 3:
                BridgeController.LayerLock();
                break;
            case 4:
                BridgeController.DelResource();
                break;
            case 5:
                BridgeController.LayerForward();
                break;
            case 6:
                BridgeController.LayerForward();
                break;
            case 7:
                BridgeController.LayerToFront();
                break;
            case 8:
                BridgeController.LayerToBack();
                break;
            default:
                break;
        }
        setIsShow(false);
    };

    const handleOnContext = useCallback((params: onContextParams) => {
        const { show, e, target } = params;
        setContextObj(target);
        setIsShow(show);
        setPosition({
            x: e?.clientX ?? 0,
            y: e?.clientY ?? 0,
        });
    }, []);

    useEffect(() => {
        BridgeEmitter.on(F2N.CONTEXT, handleOnContext);
        return () => {
            BridgeEmitter.off(F2N.CONTEXT, handleOnContext);
        };
    }, []);

    return (
        <div
            className={cn(styles.contextMenuWrap, {
                [styles.show]: isShow,
            })}
            style={{
                left: position.x,
                top: position.y,
            }}
        >
            <Menu
                className={styles.menuWrap}
                selectable={false}
                items={itemMemo}
                style={{ width: 260 }}
                onClick={handleMenuClick}
            />
        </div>
    );
});

export default ContextMenu;
