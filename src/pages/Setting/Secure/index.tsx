import React, { useCallback, useState } from 'react';
import {
    Alert,
    Button,
    Divider,
    Form,
    Input,
    message,
    Modal,
    Tabs,
} from 'antd';
import styles from './index.less';
import { logout, resetPs, updatePass } from '@/services/user';
import { storage } from '@/utils';

const Secure = React.memo(() => {
    const [form] = Form.useForm();
    const [isModify, setisModify] = useState(false);
    const [isLogout, setIsLogout] = useState(false);

    const handleModifyPs = useCallback(async () => {
        const modufyForm = await form.validateFields();
        try {
            delete modufyForm.rnewPassword;
            await updatePass(modufyForm);
            storage.logout();
            message.success('密码更新成功，请重新登录');
        } catch (error: any) {
            if (error?.code === 1001) {
                message.error(error?.message);
            }
        }
    }, []);

    const handleCancelPs = useCallback(() => {
        setisModify(false);
    }, []);

    const handleAllLogout = useCallback(async () => {
        try {
            await logout();
            storage.logout();
            message.success('注销成功');
        } catch (error) {}
    }, []);

    return (
        <div className={styles.secure}>
            <div className={styles.item}>
                <h2 className={styles.title}>修改密码</h2>
                <div className={styles.content}>
                    <div className={styles.inner}>
                        <Alert message="修改密码后须重新登录" type="warning" />
                        <Button onClick={() => setisModify(true)}>
                            修改密码
                        </Button>
                    </div>
                </div>
            </div>
            <div className={styles.item}>
                <h2 className={styles.title}>安全</h2>
                <div className={styles.content}>
                    <Button
                        className={styles.cancellation}
                        onClick={() => setIsLogout(true)}
                    >
                        注销账号
                    </Button>
                    <p className={styles.tips}>
                        从所有设备上注销，通过退出所有设备结束所有登录状态。
                    </p>
                </div>
            </div>

            <Modal
                wrapClassName="modifyPsWrap"
                title="修改密码"
                centered
                okText="确认修改"
                cancelText="取消"
                open={isModify}
                onOk={handleModifyPs}
                onCancel={handleCancelPs}
            >
                <Form
                    form={form}
                    initialValues={{
                        oldPassword: '',
                        newPassword: '',
                        rnewPassword: '',
                    }}
                    component={false}
                >
                    <Form.Item
                        name="oldPassword"
                        rules={[
                            {
                                required: true,
                                message: `请输入密码`,
                                whitespace: true,
                            },
                            {
                                pattern:
                                    /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{8,20}$/,
                                message: `密码应为字母，数字，特殊符号(~!@#$%^&*()_.)，两种及以上组合，8-20位字符串`,
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            autoComplete="new-password"
                            placeholder="旧密码"
                            maxLength={20}
                        />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                message: `请输入新密码`,
                                whitespace: true,
                            },
                            {
                                pattern:
                                    /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{8,20}$/,
                                message: `密码应为字母，数字，特殊符号(~!@#$%^&*()_.)，两种及以上组合，8-20位字符串`,
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            autoComplete="new-password"
                            placeholder="新密码"
                            maxLength={20}
                        />
                    </Form.Item>
                    <Form.Item
                        name="rnewPassword"
                        dependencies={['newPassword']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: `请重新输入新密码`,
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue('newPassword') === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error('两次输入的新密码不一样'),
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            autoComplete="new-password"
                            placeholder="再次输入新密码"
                            maxLength={20}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="你确定要从所有设备上注销吗？"
                okText="从所有设备上注销"
                cancelText="取消"
                centered
                okButtonProps={{
                    type: 'primary',
                    danger: true,
                }}
                open={isLogout}
                onOk={handleAllLogout}
                onCancel={() => setIsLogout(false)}
            >
                <p style={{ marginTop: 20, marginBottom: 30 }}>
                    如果尚未保存在其他设备进行的编辑，你将会丢失对设计的更改。
                </p>
            </Modal>
        </div>
    );
});

export default Secure;
