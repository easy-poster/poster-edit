import React from 'react';

/**
 * @description PWA容器相关
 */
const PWAContainer = React.memo<React.PropsWithChildren<unknown>>((props) => {
    const { children } = props;
    return <>{children}</>;
});

export default PWAContainer;
