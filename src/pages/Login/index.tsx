import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useHistory } from 'umi';
import { Divider, Form, Input, Tabs } from 'antd';
import useUrlState from '@ahooksjs/use-url-state';
import './index.less';
import { IconFont } from '@/const';

// log | forget

const { TabPane } = Tabs;

const Login = () => {
  const history = useHistory();
  const [loginType, setLoginType] = useUrlState({ type: 'log' });

  const [form] = Form.useForm();

  const handleGotget = () => {
    setSendEmail('');
    setLoginType({
      type: 'forget',
    });
  };

  const [sendEmail, setSendEmail] = useState('');
  useEffect(() => {
    setSendEmail('');
  }, []);

  const handleResetPass = async () => {
    try {
      console.log('form', form);
      const values = await form.validateFields();
      console.log('values', values);
      setSendEmail(values.email);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const handleLogin = async () => {
    try {
      console.log('form', form);
      const values = await form.validateFields();
      console.log('values', values);
      history.push('/');
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  return (
    <div className="login-wrap">
      <div className="left">eposter 动图创作</div>
      <div className="right">
        {loginType.type === 'forget' ? (
          !!sendEmail ? (
            <div className="result">
              <div className="title">请您查看收件箱</div>
              <p className="tips">我们向{sendEmail}发送了一封电子邮件。</p>
              <p>单击邮件里的链接以重置密码。</p>
            </div>
          ) : (
            <div className="forget">
              <div className="title">忘记密码</div>
              <p className="tips">输入您的电子邮件，我们将联系您以重置密码。</p>
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
                  ]}
                >
                  <Input placeholder="电子邮件" />
                </Form.Item>
              </Form>
              <div className="btn-wrap">
                <div
                  className="btn cancer"
                  onClick={() => setLoginType({ type: 'log' })}
                >
                  我记得密码了
                </div>
                <div className="btn comfirm" onClick={handleResetPass}>
                  重置密码
                </div>
              </div>
            </div>
          )
        ) : (
          <>
            <div className="title">只需几秒钟即可登录或注册</div>
            <div className="login-list">
              <div className="item">
                <IconFont
                  type="icon-weixin"
                  style={{ fontSize: '30px', marginRight: 10 }}
                />
                微信登录
              </div>
              <div className="item">
                <IconFont
                  type="icon-QQ"
                  style={{ fontSize: '32px', marginRight: 10 }}
                />
                QQ登录
              </div>
              <div className="item">
                <IconFont
                  type="icon-weibo"
                  style={{ fontSize: '30px', marginRight: 10 }}
                />
                微博登录
              </div>
              <Divider>或</Divider>
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
                      message: `请输入电子邮件`,
                      whitespace: true,
                    },
                    {
                      type: 'email',
                      message: '请输入有效的电子邮件地址',
                    },
                  ]}
                >
                  <Input placeholder="电子邮件" />
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
              </Form>
              <div className="forget-btn" onClick={handleGotget}>
                忘记密码？
              </div>
            </div>
            <div className="tips">
              继续即表示您同意eposter的
              <a href="#">条款</a>和<a href="#">隐私政策</a>。
            </div>
            <div className="login-btn" onClick={handleLogin}>
              登录
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
