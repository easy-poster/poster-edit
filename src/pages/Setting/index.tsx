import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Divider, Form, Input, message, Upload } from 'antd';
import './index.less';

const Setting = () => {
  const [form] = Form.useForm();

  const [avatar, setAvatar] = useState('https://joeschmoe.io/api/v1/random');

  const uploadImgProps = {
    accept: 'image/*',
    action: '',
    showUploadList: false,
    beforeUpload(file: any) {
      console.log('beforeUpload file', file);
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  // name
  const [isNameEdit, setIsNameEdit] = useState(false);
  const [userName, setUserName] = useState('落沙123');
  const inputNameRef = useRef(null);
  const handleEdit = () => {
    setIsNameEdit(true);
  };

  useEffect(() => {
    if (isNameEdit) {
      inputNameRef.current!.focus();
    }
  }, [isNameEdit]);

  const handleNameSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('values', values);
      setUserName(values.username);
      if (isNameEdit) {
        setIsNameEdit(false);
      }
      // toggleEdit();
      // handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  // email
  const [isEmailEdit, setIsEmailEdit] = useState(false);
  const [email, setEmail] = useState('418788724@qq.com');
  const inputEmailRef = useRef(null);
  const handleEmailEdit = () => {
    setIsEmailEdit(true);
  };

  useEffect(() => {
    if (isEmailEdit) {
      inputEmailRef.current!.focus();
    }
  }, [isEmailEdit]);

  const handleEmailSave = async () => {
    try {
      console.log('form', form);
      const values = await form.validateFields();
      console.log('values', values);
      setEmail(values.email);
      if (isEmailEdit) {
        setIsEmailEdit(false);
      }
      // toggleEdit();
      // handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  return (
    <div className="setting-wrap">
      <div className="title">你的账户</div>
      <div className="account">
        <div className="avatar-wrap">
          <Avatar size={90} src={avatar} />
          <div className="text">上传你的个人头像</div>
        </div>
        <Upload {...uploadImgProps}>
          <Button size="large" shape="round">
            上传照片
          </Button>
        </Upload>
      </div>
      <Divider />
      <div className="name-wrap">
        <div className="title">名称</div>
        <div className="content">
          {!isNameEdit ? (
            <div className="name" onClick={() => handleEdit()}>
              {userName}
            </div>
          ) : (
            <Form
              form={form}
              initialValues={{
                username: userName,
              }}
              component={false}
            >
              <Form.Item
                style={{ margin: 0 }}
                name="username"
                rules={[
                  {
                    required: true,
                    message: `请输入名称`,
                    whitespace: true,
                  },
                  {
                    max: 50,
                    message: '名字不能超过50个字',
                  },
                ]}
              >
                <Input
                  ref={inputNameRef}
                  onPressEnter={handleNameSave}
                  onBlur={handleNameSave}
                />
              </Form.Item>
            </Form>
          )}
          {/* <Button size='large' shape='round' onClick={() => handleEdit()}>编辑</Button> */}
        </div>
      </div>
      <Divider />
      <div className="name-wrap">
        <div className="title">电子邮件</div>
        <div className="content">
          {!isEmailEdit ? (
            <div className="name" onClick={() => handleEmailEdit()}>
              {email || '添加电子邮件'}
            </div>
          ) : (
            <Form
              form={form}
              initialValues={{
                email: email,
              }}
              component={false}
            >
              <Form.Item
                style={{ margin: 0 }}
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: '请输入有效的电子邮件地址',
                  },
                ]}
              >
                <Input
                  ref={inputEmailRef}
                  onPressEnter={handleEmailSave}
                  onBlur={handleEmailSave}
                />
              </Form.Item>
            </Form>
          )}
          {/* <div className='name'>添加电子邮件</div>
          <Button size='large' shape='round'>添加</Button> */}
        </div>
      </div>
      {/* <div className='name-wrap'>
        <div className='name'>关联社交账户</div>
        <Button type="primary">添加</Button>
      </div> */}
    </div>
  );
};

export default Setting;
