import React, { useCallback, useContext, useMemo } from 'react';
import cn from 'classnames';
import { history } from '@umijs/max';
import { MENU_EDIT, IconFont, ResourcePageType } from '@/const';
import {
    OperatingPanelContext,
    OperatingPanelType,
} from '../../Container/OperatingPanelContainer';
import LogoColor from '@/assets/logo/color.svg';
import styles from './index.less';

const EditMenu = React.memo(
    ({
        activeTab,
        setActiveTab,
    }: {
        activeTab: ResourcePageType;
        setActiveTab: (val: ResourcePageType) => void;
    }) => {
        const { panelType, setPanelType } = useContext(OperatingPanelContext);

        const isNullPanel = useMemo(() => {
            return panelType === OperatingPanelType.NONE;
        }, [panelType]);

        const handleClick = useCallback((id: ResourcePageType) => {
            setActiveTab(id);
            setPanelType(OperatingPanelType.NONE);
        }, []);

        return (
            <div className={styles.editMenu}>
                <nav className={styles.editNav}>
                    <div className={styles.editMenuLogo}>
                        <img
                            src={LogoColor}
                            onClick={() => history.push('/')}
                        />
                    </div>
                    <div className={styles.editMenuList}>
                        {MENU_EDIT.map((item) => {
                            return (
                                <div
                                    key={item.type}
                                    className={cn(styles.editMenuItem, {
                                        [styles.activeItem]:
                                            activeTab === item.type &&
                                            isNullPanel,
                                    })}
                                    onClick={() => handleClick(item.type)}
                                >
                                    <div className={styles.editMenuIcon}>
                                        <IconFont
                                            type={item.icon}
                                            style={{ fontSize: '24px' }}
                                        />
                                    </div>
                                    <span>{item.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </nav>
            </div>
        );
    },
);

export default EditMenu;
