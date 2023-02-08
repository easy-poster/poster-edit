import React, { ReactNode } from 'react';
import styles from './index.less';

interface HeaderProps {
    title: string;
    size?: 'small' | 'middle' | 'large';
    rightExtra?: ReactNode;
    className?: string;
}

const HeaderTitle = React.memo(
    ({ title, size = 'middle', rightExtra }: HeaderProps) => {
        return (
            <div className={styles.header}>
                <h1 className={styles[size]}>{title}</h1>
                {rightExtra}
            </div>
        );
    },
);

export default HeaderTitle;
