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
            <div className={styles.imgWrap}>
                <img src={item.logoUrl} alt="" />
            </div>
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
