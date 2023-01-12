import React, { useEffect, useLayoutEffect, useState } from 'react';
import { history } from '@umijs/max';
import { Button, Divider, Form, Input, message, Tabs } from 'antd';
import useUrlState from '@ahooksjs/use-url-state';
import Captcha from '../components/captcha';
import styles from './index.less';
import { useCountDown, useDebounceFn } from 'ahooks';
import { register, sendEmailVerifyCode } from '@/services/user';
import { storage } from '@/utils';
import { loginTypeUrl } from '..';

const Count = 60 * 1000;

const Register = React.memo(
    ({ setLoginType }: { setLoginType: (active: loginTypeUrl) => void }) => {
        const [form] = Form.useForm();
        const [targetDate, setTargetDate] = useState<number>();
        const [loading, setLoading] = useState(false);

        const [countdown] = useCountDown({
            targetDate,
        });

        const { run: handleSendVerify } = useDebounceFn(
            async () => {
                let formEmail = await form.validateFields(['email']);
                if (formEmail?.email) {
                    try {
                        // 发送验证码
                        let res = await sendEmailVerifyCode({
                            email: formEmail.email,
                            type: 'register',
                        });
                        storage.set('registerVcId', res?.id, 60);
                        setTargetDate(Date.now() + Count);
                        message.success('验证码发送成功');
                    } catch (error: any) {
                        if (error?.code === 1001) {
                            message.error(error?.message);
                        }
                    }
                }
            },
            {
                wait: 500,
            },
        );

        const { run: handleRegister } = useDebounceFn(
            async () => {
                try {
                    setLoading(true);
                    const values = await form.validateFields();
                    delete values?.rpassword;
                    values.captchaId = storage.get('registerVcId');
                    let res = await register(values);
                    if (res) {
                        message.success('注册成功，请登录');
                        storage.remove('registerVcId');
                        setLoginType({
                            type: 'login',
                        });
                    }
                } catch (error: any) {
                    if (error?.code === 1001) {
                        message.error(error?.message);
                    }
                } finally {
                    setLoading(false);
                }
            },
            {
                wait: 200,
            },
        );

        return (
            <div className={styles.register}>
                <div className={styles.title}>使用电子邮箱创建账号</div>
                <div className={styles.registerList}>
                    <Form
                        form={form}
                        initialValues={{
                            email: '',
                            verifyCode: '',
                            password: '',
                            rpassword: '',
                        }}
                        component={false}
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: `请输入电子邮箱`,
                                    whitespace: true,
                                },
                                {
                                    type: 'email',
                                    message: '请输入有效的电子邮箱地址',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input placeholder="电子邮箱" />
                        </Form.Item>
                        <div className={styles.verifyWrap}>
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
                            <Button
                                type={countdown === 0 ? 'primary' : 'default'}
                                disabled={countdown !== 0}
                                className={styles.sendVBtn}
                                onClick={handleSendVerify}
                            >
                                {countdown === 0
                                    ? '发送验证码'
                                    : `重新发送${Math.round(
                                          countdown / 1000,
                                      )} s`}
                            </Button>
                        </div>
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
                            <Input.Password
                                autoComplete="new-password"
                                placeholder="密码"
                                maxLength={20}
                            />
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
                                autoComplete="new-password"
                                placeholder="再次输入密码"
                                maxLength={20}
                            />
                        </Form.Item>
                    </Form>
                </div>
                <div className={styles.tips}>
                    继续即表示您同意eposter的
                    <a href="#">条款</a>和<a href="#">隐私政策</a>。
                </div>
                <Button
                    className={styles.loginBtn}
                    type="primary"
                    block
                    size="large"
                    loading={loading}
                    onClick={handleRegister}
                >
                    创建账号
                </Button>
            </div>
        );
    },
);

export default Register;
