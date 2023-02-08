import React, { ComponentType, useMemo } from 'react';
import ContainerManager from '@/helper/manager/ContainerManager';
import CanvasContainer from './CanvasContainer';

export const EditContainerManager = new ContainerManager();
EditContainerManager.register(CanvasContainer);

/**
 * @discription 画布舞台管理容器
 */
const StageContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;

    const ReduceContainer: ComponentType<React.PropsWithChildren> =
        useMemo(() => {
            return EditContainerManager.containers.reduce(
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

export default StageContainer;
