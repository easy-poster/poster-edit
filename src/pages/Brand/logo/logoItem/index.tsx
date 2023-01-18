import { IconFont } from '@/const';
import React from 'react';
import styles from './index.less';

interface LogoItemProps {
    item: any;
    index: number;
    handleDelete: (
        item: any,
        index: number,
        event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    ) => void;
}

const LogoItem = React.memo(({ item, index, handleDelete }: LogoItemProps) => {
    return (
        <div className={styles.logoItem}>
            <img src={item.logo} alt="" />
            <IconFont
                className={styles.delete}
                onClick={(event) => handleDelete(item, index, event)}
                type="icon-chacha"
                style={{
                    fontSize: '20px',
                    color: '#000',
                }}
            />
        </div>
    );
});

export default LogoItem;
