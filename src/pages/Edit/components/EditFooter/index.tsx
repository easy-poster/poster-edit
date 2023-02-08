import React, { useState, useRef } from 'react';
import { IconFont } from '@/const';
import styles from './index.less';

const EditFooter = React.memo(() => {
    const listRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleBtnClick = () => {
        setIsOpen(!isOpen);
        const listDOM = listRef.current;
        if (listDOM) {
            if (isOpen) {
                listDOM.style.height = `0px`;
            } else {
                listDOM.style.height = `180px`;
            }
        }
    };

    return (
        <div className={styles.editFooter}>
            <div className={styles.editToolBar}>tool bar</div>
            <div className={styles.editListBar} ref={listRef}>
                list bar
            </div>
            <div className={styles.editFooterBtn} onClick={handleBtnClick}>
                <IconFont
                    type="icon-xiangzuo"
                    style={{
                        fontSize: '14px',
                        transform: `${
                            isOpen ? `rotate(270deg)` : `rotate(90deg)`
                        }`,
                    }}
                />
            </div>
        </div>
    );
});

export default EditFooter;
