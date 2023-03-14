import React, { useCallback, useState } from 'react';
import { Button, Form, Input, Popover } from 'antd';
import { history, useModel } from '@umijs/max';
import { saveProject } from '@/services/project';
import { IconFont } from '@/const';
import styles from './index.less';

type Values = { width: number; height: number };

const CreateContent = React.memo(() => {
    const { initialState } = useModel('@@initialState');
    const userId = initialState?.currentUser?.id;
    const [isCustom, setCustom] = useState(false);
    const [form] = Form.useForm();
    const [disable, setDisable] = useState(true);

    const LIST = [
        {
            id: 1,
            icon: '',
            type: '演示文稿',
            width: 1920,
            height: 1080,
        },
        {
            id: 2,
            icon: '',
            type: 'logo',
            width: 500,
            height: 500,
        },
        {
            id: 3,
            icon: '',
            type: '名片',
            width: 1000,
            height: 600,
        },
        {
            id: 4,
            icon: '',
            type: 'Banner',
            width: 1920,
            height: 600,
        },
    ];

    const handleValuesChange = useCallback((_: any, values: Values) => {
        const { width = 0, height = 0 } = values;
        console.log(width, height);
        if (+width < 40 || +width > 8000 || +height < 40 || +height > 8000) {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, []);

    const handleNewTypeProject = useCallback(
        async (it: Values & { type: string }) => {
            if (!userId) return;
            try {
                let res = await saveProject({
                    type: it.type,
                    width: it.width,
                    height: it.height,
                });
                let uuid = res?.uuid;
                if (uuid) {
                    history.push(`/edit/${uuid}`);
                }
            } catch (error) {
                console.error('新建失败：', error);
            }
        },
        [userId],
    );

    const handleCustomProject = useCallback(() => {
        if (!userId) return;
        form.validateFields()
            .then(async (resForm) => {
                const dimension = {
                    width: resForm?.width?.trim(),
                    height: resForm?.height?.trim(),
                };
                let res = await saveProject({
                    ...dimension,
                });
                let uuid = res?.uuid;
                if (uuid) {
                    history.push(`/edit/${uuid}`);
                }
            })
            .catch(() => {});
    }, [form, userId]);

    const handleCustom = useCallback((value: boolean) => {
        setCustom(value);
    }, []);

    return (
        <div className={styles.createContent}>
            {isCustom ? (
                <>
                    <div className={styles.customHeader}>
                        <h3>自定义尺寸</h3>
                        <span onClick={() => handleCustom(false)}>
                            <IconFont
                                type="icon-chacha1"
                                style={{ fontSize: 24 }}
                            />
                        </span>
                    </div>
                    <div className={styles.customContent}>
                        <Form
                            className={styles.formWrap}
                            form={form}
                            onValuesChange={handleValuesChange}
                        >
                            <Form.Item
                                name="width"
                                getValueFromEvent={(e) => {
                                    let value = e.target.value as string;
                                    let newVal = value.replace(/\D/g, '');
                                    return newVal;
                                }}
                                rules={[
                                    {
                                        required: true,
                                        validator: (_: any, value?: string) => {
                                            if (!value?.trim())
                                                return Promise.reject(
                                                    '请输入宽度',
                                                );
                                            if (
                                                +value?.trim() < 40 ||
                                                +value.trim() > 8000
                                            )
                                                return Promise.reject(
                                                    '尺寸必须大于40px且不超过8000px',
                                                );
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Input
                                    size="large"
                                    maxLength={4}
                                    placeholder="宽"
                                />
                            </Form.Item>
                            <Form.Item
                                name="height"
                                getValueFromEvent={(e) => {
                                    let value = e.target.value as string;
                                    let newVal = value.replace(/\D/g, '');
                                    return newVal;
                                }}
                                rules={[
                                    {
                                        required: true,
                                        validator: (_: any, value?: string) => {
                                            if (!value?.trim())
                                                return Promise.reject(
                                                    '请输入高度',
                                                );
                                            if (
                                                +value?.trim() < 40 ||
                                                +value.trim() > 8000
                                            )
                                                return Promise.reject(
                                                    '尺寸必须大于40px且不超过8000px',
                                                );
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Input
                                    size="large"
                                    maxLength={4}
                                    placeholder="高"
                                />
                            </Form.Item>
                        </Form>
                        <span>px</span>
                    </div>
                    <div className={styles.createBtn}>
                        <Button
                            size="large"
                            type="primary"
                            block
                            disabled={disable}
                            onClick={handleCustomProject}
                        >
                            创建设计
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.createTop}>
                        <h3>设计类型</h3>
                        <ul className={styles.createList}>
                            {LIST.map((it) => {
                                return (
                                    <li
                                        key={it.id}
                                        className={styles.listItem}
                                        onClick={() => handleNewTypeProject(it)}
                                    >
                                        <span>{it.type}</span>
                                        <span className={styles.size}>
                                            {it.width}&nbsp;*&nbsp;{it.height}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className={styles.btmWrap}>
                        <div
                            className={styles.btnWrap}
                            onClick={() => handleCustom(true)}
                        >
                            <IconFont
                                type="icon-tianjia_huaban"
                                style={{ fontSize: 24 }}
                            />
                        </div>
                        <p>自定义大小</p>
                    </div>
                </>
            )}
        </div>
    );
});

const CreatePopover = React.memo(() => {
    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    return (
        <Popover
            content={<CreateContent />}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
            showArrow={false}
            placement="bottomRight"
            destroyTooltipOnHide
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
