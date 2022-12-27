import { ComponentType } from 'react';

class ContainerManager {
    containers: ComponentType[] = [];

    register(Container: ComponentType) {
        if (!this.containers.includes(Container)) {
            this.containers.push(Container);
        }
    }
}

export default ContainerManager;
