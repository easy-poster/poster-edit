import React from 'react';
import cn from 'classnames';
import styles from './index.less';

const BarButton = React.memo<React.HTMLAttributes<any>>((props) => {
    const { children, className, ...rest } = props;
    return (
        <div className={cn(styles.barButton, className)} {...rest}>
            {children}
        </div>
    );
});

export default BarButton;
