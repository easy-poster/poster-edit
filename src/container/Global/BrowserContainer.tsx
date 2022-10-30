import React from 'react';

/**
 * @description 浏览器相关控制和兼容
 */
const BrowserContainer = React.memo<React.PropsWithChildren<unknown>>((props) => {
    const { children } = props;
    return <>{children}</>;
});

export default BrowserContainer;
