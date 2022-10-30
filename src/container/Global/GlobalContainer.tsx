import React from 'react';
import BrowserContainer from './BrowserContainer';
import PWAContainer from './PWAContainer';

/**
 * @discription 全局容器管理组件
 */
const GlobalContainer = React.memo<React.PropsWithChildren<{}>>((props) => {
    const { children } = props;

    return (
        <BrowserContainer>
            <PWAContainer>{children}</PWAContainer>
        </BrowserContainer>
    );
});

export default GlobalContainer;
