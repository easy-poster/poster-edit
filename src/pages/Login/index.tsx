import React, { useEffect, useLayoutEffect, useState } from 'react';
import { history } from '@umijs/max';
import { Divider, Form, Input, message, Tabs } from 'antd';
import useUrlState from '@ahooksjs/use-url-state';
import { IconFont } from '@/const';
import Captcha from './components/captcha';
import LoginForm from './loginForm';
import Register from './register';
import styles from './index.less';
import Forget from './forget';

export type LoginType = 'login' | 'register' | 'forget';

export interface loginTypeUrl {
    type: LoginType;
}

const Login = () => {
    const [loginType, setLoginType] = useUrlState<loginTypeUrl>({
        type: 'login',
    });

    const handleTabChange = (active: string) => {
        setLoginType({
            type: active as LoginType,
        });
    };

    return (
        <div className={styles.loginWrap}>
            <div className={styles.left}>eposter 动图创作</div>
            <div className={styles.right}>
                {loginType.type === 'forget' ? (
                    <Forget setLoginType={setLoginType} />
                ) : (
                    <Tabs
                        defaultActiveKey="register"
                        activeKey={loginType.type}
                        centered
                        items={[
                            {
                                label: '登录',
                                key: 'login',
                                children: (
                                    <LoginForm setLoginType={setLoginType} />
                                ),
                            },
                            {
                                label: '创建账号',
                                key: 'register',
                                children: (
                                    <Register setLoginType={setLoginType} />
                                ),
                            },
                        ]}
                        onChange={handleTabChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Login;
