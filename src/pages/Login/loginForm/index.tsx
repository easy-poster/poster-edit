import React, { useEffect, useLayoutEffect, useState } from 'react';
import { history } from '@umijs/max';
import { Button, Divider, Form, Input, message, Tabs } from 'antd';
import useUrlState from '@ahooksjs/use-url-state';
import Captcha from '../components/captcha';
import styles from './index.less';
import { loginTypeUrl } from '..';
import { storage } from '@/utils';
import { login } from '@/services/user';
import { useModel } from '@umijs/max';
import { flushSync } from 'react-dom';
import { useAuth } from '@/hooks/eventBus';

const LoginForm = React.memo(
    ({ setLoginType }: { setLoginType: (active: loginTypeUrl) => void }) => {
        const { initialState, setInitialState } = useModel('@@initialState');
        const [form] = Form.useForm();

        const { refreshCaptchaEmit } = useAuth();

        const handleGotget = () => {
            setLoginType({
                type: 'forget',
            });
        };

        const fetchUserInfo = async () => {
            const userInfo = await initialState?.getCurrentUserInfo?.();
            if (userInfo) {
                flushSync(() => {
                    setInitialState((s) => ({
                        ...s,
                        currentUser: userInfo,
                    }));
                });
            }
        };

        const handleLogin = async () => {
            try {
                const values = await form.validateFields();
                values.captchaId = storage.get('vcImgId');
                let res = await login(values);
                if (res) {
                    storage.setTokenStore(res);
                    await fetchUserInfo();
                    history.push('/');
                    message.success('登录成功');
                }
            } catch (error: any) {
                if (error?.code === 1001) {
                    message.error(error?.message);
                    refreshCaptchaEmit();
                } else {
                    message.error('登录失败，请稍后再试');
                }
            }
        };

        return (
            <div className={styles.loginForm}>
                <div className={styles.title}>登录你的账号</div>
                <div className={styles.loginList}>
                    {/* <div className="item">
                                <IconFont
                                    type="icon-weixin"
                                    style={{
                                        fontSize: '30px',
                                        marginRight: 10,
                                    }}
                                />
                                微信登录
                            </div>
                            <div className="item">
                                <IconFont
                                    type="icon-QQ"
                                    style={{
                                        fontSize: '32px',
                                        marginRight: 10,
                                    }}
                                />
                                QQ登录
                            </div>
                            <div className="item">
                                <IconFont
                                    type="icon-weibo"
                                    style={{
                                        fontSize: '30px',
                                        marginRight: 10,
                                    }}
                                />
                                微博登录
                            </div>
                            <Divider>或</Divider> */}
                    <Form
                        form={form}
                        initialValues={{
                            email: '',
                            password: '',
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
                        >
                            <Input placeholder="电子邮箱" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: `请输入密码`,
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input.Password placeholder="密码" />
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
                        >
                            <Input placeholder="验证码" maxLength={4} />
                        </Form.Item>
                        <Captcha />
                    </Form>
                    <Button
                        type="link"
                        className={styles.forgetBtn}
                        onClick={handleGotget}
                    >
                        忘记密码？
                    </Button>
                </div>
                <div className={styles.tips}>
                    继续即表示您同意eposter的
                    <a href="#">条款</a>和<a href="#">隐私政策</a>。
                </div>
                <div className={styles.loginBtn} onClick={handleLogin}>
                    登录
                </div>
            </div>
        );
    },
);

export default LoginForm;
