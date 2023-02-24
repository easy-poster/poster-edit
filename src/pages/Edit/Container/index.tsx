import React, { ComponentType, useMemo } from 'react';
import ContainerManager from '@/helper/manager/ContainerManager';
import ProjectContainer from './ProjectContainer';
import OperatingPanelContainer from './OperatingPanelContainer';
import SelectContainer from './SelectContainer';

export const EditContainerManager = new ContainerManager();
EditContainerManager.register(ProjectContainer);
EditContainerManager.register(OperatingPanelContainer);
EditContainerManager.register(SelectContainer);

/**
 * @discription 编辑页管理组件
 */
const EditContainer = React.memo<React.PropsWithChildren>((props) => {
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

export default EditContainer;
