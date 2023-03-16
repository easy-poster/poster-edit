import React, { ComponentType, useMemo } from 'react';
import ContainerManager from '@/helper/manager/ContainerManager';
import BrowserContainer from './BrowserContainer';
import PWAContainer from './PWAContainer';
import AntdThemeContainer from './AntdThemeContainer';

export const GlobalContainerManager = new ContainerManager();
GlobalContainerManager.register(BrowserContainer);
GlobalContainerManager.register(PWAContainer);
GlobalContainerManager.register(AntdThemeContainer);

/**
 * @discription 全局容器管理组件
 */
const GlobalContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;

    const ReduceContainer: ComponentType<React.PropsWithChildren> =
        useMemo(() => {
            return GlobalContainerManager.containers.reduce(
                (
                    PreComp: ComponentType<React.PropsWithChildren>,
                    CurrentComp: ComponentType<React.PropsWithChildren>,
                ) => {
                    return (props: React.PropsWithChildren) => {
                        return (
                            <PreComp>
                                <CurrentComp>{props.children}</CurrentComp>
                            </PreComp>
                        );
                    };
                },
            );
        }, []);

    return <ReduceContainer>{children}</ReduceContainer>;
});

export default GlobalContainer;
