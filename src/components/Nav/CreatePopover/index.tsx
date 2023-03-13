import React, { useCallback, useState } from 'react';
import { history, useModel } from '@umijs/max';
import { saveProject } from '@/services/project';
import styles from './index.less';
import { IconFont } from '@/const';
import { Popover } from 'antd';

const CreateContent = React.memo(() => {
    const LIST = [
        {
            id: 1,
            icon: '',
            title: '手机尺寸',
        },
    ];

    return (
        <div className={styles.createContent}>
            <div className={styles.createTop}>
                <h3>设计类型</h3>
                <div className={styles.createList}></div>
            </div>
            <div className={styles.btmWrap}>
                <div className={styles.btnWrap}>
                    <IconFont
                        type="icon-tianjia_huaban"
                        style={{ fontSize: 24 }}
                    />
                </div>
                <p>自定义大小</p>
            </div>
        </div>
    );
});

const CreatePopover = React.memo(() => {
    const { initialState } = useModel('@@initialState');
    const userId = initialState?.currentUser?.id;

    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const handleNewProject = useCallback(async () => {
        if (!userId) return;
        try {
            let res = await saveProject({
                title: '未命名的设计',
                width: 720,
                height: 680,
            });
            let uuid = res?.uuid;
            if (uuid) {
                history.push(`/edit/${uuid}`);
            }
        } catch (error) {
            console.error('新建失败：', error);
        }
    }, [userId]);

    return (
        <Popover
            content={<CreateContent />}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
            showArrow={false}
            placement="bottomRight"
            overlayClassName={styles.popoverCreateWrap}
        >
            <div className={styles.headerCreate}>
                <IconFont type="icon-jiahao" style={{ fontSize: '28px' }} />
                <span className={styles.createText}>创建设计</span>
            </div>
        </Popover>
    );
});

export default CreatePopover;
