import React, { useState } from 'react';
import { Divider, Form, Input, message, Tabs } from 'antd';
import cn from 'classnames';
import { loginTypeUrl } from '..';
import styles from './index.less';
import { useDebounceFn } from 'ahooks';
import ResetPass from '../resetPass';
import { sendEmailVerifyCode } from '@/services/user';
import { storage } from '@/utils';

const Forget = React.memo(
    ({ setLoginType }: { setLoginType: (active: loginTypeUrl) => void }) => {
        const [sendEmail, setSendEmail] = useState('');
        const [form] = Form.useForm();

        const { run: handleSendResetVerify } = useDebounceFn(
            async () => {
                try {
                    let formEmail = await form.validateFields();
                    if (formEmail?.email) {
                        // 发送验证码
                        let res = await sendEmailVerifyCode({
                            email: formEmail.email,
                            type: 'reset',
                        });
                        storage.set('resetVcId', res?.id, 60 * 5);
                        setSendEmail(formEmail.email);
                        message.success('验证码发送成功');
                    }
                } catch (error: any) {
                    console.log('Save failed:', error);
                    if (error?.code === 1001) {
                        message.error(error?.message);
                    } else {
                        message.error('发送验证码失败，请稍后再试');
                    }
                }
            },
            {
                wait: 200,
            },
        );

        return (
            <div className={styles.forgetWrap}>
                {!!sendEmail ? (
                    <ResetPass
                        sendEmail={sendEmail}
                        setLoginType={setLoginType}
                    />
                ) : (
                    <div className={styles.forget}>
                        <div className={styles.title}>忘记密码</div>
                        <p className={styles.tips}>
                            输入您的电子邮件，我们将联系您以重置密码。
                        </p>
                        <Form
                            form={form}
                            initialValues={{
                                email: '',
                            }}
                            component={false}
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: `请输入电子邮件`,
                                        whitespace: true,
                                    },
                                    {
                                        type: 'email',
                                        message: '请输入有效的电子邮箱地址',
                                    },
                                ]}
                            >
                                <Input placeholder="电子邮件" />
                            </Form.Item>
                        </Form>
                        <div className={styles.btnWrap}>
                            <div
                                className={cn(styles.btn, styles.cancer)}
                                onClick={() => setLoginType({ type: 'login' })}
                            >
                                我记得密码了
                            </div>
                            <div
                                className={cn(styles.btn, styles.comfirm)}
                                onClick={handleSendResetVerify}
                            >
                                发送验证码
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    },
);

export default Forget;
