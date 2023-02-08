import React from 'react';

/**
 * @description canvas容器
 */
const CanvasContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;
    return <>{children}</>;
});

export default CanvasContainer;
