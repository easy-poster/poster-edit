import React, { useState } from 'react';
import { Button, Divider, Form, Input, message, Tabs } from 'antd';
import { useDebounceFn } from 'ahooks';
import cn from 'classnames';
import { loginTypeUrl } from '..';
import styles from './index.less';
import { storage } from '@/utils';
import { resetPs } from '@/services/user';

const ResetPass = React.memo(
    ({
        sendEmail,
        setLoginType,
    }: {
        sendEmail: string;
        setLoginType: (active: loginTypeUrl) => void;
    }) => {
        const [form] = Form.useForm();

        const { run: handleResetPass } = useDebounceFn(
            async () => {
                try {
                    console.log('form', form);
                    const values = await form.validateFields();
                    const captchaId = storage.get('resetVcId');
                    const data = {
                        email: sendEmail,
                        password: values.password,
                        captchaId: captchaId,
                        verifyCode: values.verifyCode,
                    };

                    await resetPs(data);

                    message.success('密码重置成功');

                    setLoginType({
                        type: 'login',
                    });
                } catch (error: any) {
                    if (error?.code === 1001) {
                        message.error(error?.message);
                    } else {
                        message.error('密码重置失败，请稍后再试');
                    }
                }
            },
            {
                wait: 200,
            },
        );

        return (
            <div className={styles.reset}>
                <div className={styles.title}>请您查看收件箱</div>
                <p className={styles.tips}>
                    我们向{sendEmail}发送了一封电子邮件。
                </p>
                <Form
                    form={form}
                    initialValues={{
                        password: '',
                        rpassword: '',
                        verifyCode: '',
                    }}
                    component={false}
                >
                    <Form.Item
                        name="password"
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
                        <Input.Password placeholder="密码" maxLength={20} />
                    </Form.Item>
                    <Form.Item
                        name="rpassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: `请输入确认密码`,
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue('password') === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error('两次输入的密码不一样'),
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="再次输入密码"
                            maxLength={20}
                        />
                    </Form.Item>
                    <Form.Item
                        name="verifyCode"
                        rules={[
                            {
                                required: true,
                                message: `请输验证码`,
                                whitespace: true,
                            },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="邮箱验证码" maxLength={6} />
                    </Form.Item>
                </Form>
                <div className={styles.btnWrap}>
                    <Button
                        type="link"
                        onClick={() => setLoginType({ type: 'login' })}
                    >
                        我记得密码了
                    </Button>
                    <div
                        className={cn(styles.btn, styles.gologin)}
                        onClick={handleResetPass}
                    >
                        重置密码
                    </div>
                </div>
            </div>
        );
    },
);

export default ResetPass;
