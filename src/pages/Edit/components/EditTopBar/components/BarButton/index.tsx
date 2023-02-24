import React from 'react';
import cn from 'classnames';
import styles from './index.less';

interface BarButtonProps {
    onClick?: () => void;
    active?: boolean;
    className?: string | undefined;
}

const BarButton = React.memo<React.PropsWithChildren<BarButtonProps>>(
    (props) => {
        const { children, className, active, ...rest } = props;
        return (
            <div
                className={cn(styles.barButton, className, {
                    [styles.active]: active,
                })}
                {...rest}
            >
                {children}
            </div>
        );
    },
);

export default BarButton;
