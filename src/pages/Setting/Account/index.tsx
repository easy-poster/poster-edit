import React, { useEffect, useRef, useState } from 'react';
import {
    Avatar,
    Button,
    Divider,
    Form,
    Input,
    InputRef,
    message,
    Upload,
} from 'antd';
import avatarImg from '@/assets/avatar.jpg';
import './index.less';
import { useModel } from '@umijs/max';
import { updateUserInfo } from '@/services/user';
import { flushSync } from 'react-dom';

const Account = () => {
    const [form] = Form.useForm();
    const { initialState, setInitialState } = useModel('@@initialState');
    const user = initialState?.currentUser;

    const [avatar, setAvatar] = useState(avatarImg);

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

    /**
     * @name 获取最新用户信息
     */
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

    // name
    const [isNameEdit, setIsNameEdit] = useState(false);
    const inputNameRef = useRef<InputRef>(null);
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

            await updateUserInfo(values);
            await fetchUserInfo();
            if (isNameEdit) {
                setIsNameEdit(false);
            }
            message.success('更新成功');
        } catch (error) {
            form.setFieldsValue({ username: user?.username });
            message.error('更新失败');
        } finally {
        }
    };

    // description
    const [isDescEdit, setIsDescEdit] = useState(false);
    const inputDescRef = useRef<InputRef>(null);
    const handleDescEdit = () => {
        setIsDescEdit(true);
    };

    useEffect(() => {
        if (isDescEdit) {
            inputDescRef.current!.focus();
        }
    }, [isDescEdit]);

    const handleDescSave = async () => {
        try {
            console.log('form', form);
            const values = await form.validateFields();
            await updateUserInfo(values);
            await fetchUserInfo();
            if (isDescEdit) {
                setIsDescEdit(false);
            }
            message.success('更新成功');
        } catch (errInfo) {
            form.setFieldsValue({ description: user?.description });
            message.error('更新失败');
        }
    };

    return (
        <div className="accountWrap">
            <h2 className="title">你的账户</h2>
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
                            {user?.username}
                        </div>
                    ) : (
                        <Form
                            form={form}
                            initialValues={{
                                username: user?.username,
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
                                        max: 100,
                                        message: '名字不能超过100个字',
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
                </div>
            </div>
            <Divider />
            <div className="name-wrap">
                <div className="title">个人介绍</div>
                <div className="content">
                    {!isDescEdit ? (
                        <div className="desc" onClick={() => handleDescEdit()}>
                            {user?.description || '介绍下自己吧'}
                        </div>
                    ) : (
                        <Form
                            form={form}
                            initialValues={{
                                description: user?.description,
                            }}
                            component={false}
                        >
                            <Form.Item style={{ margin: 0 }} name="description">
                                <Input.TextArea
                                    ref={inputDescRef}
                                    onPressEnter={handleDescSave}
                                    onBlur={handleDescSave}
                                    autoSize={{ minRows: 3, maxRows: 6 }}
                                    maxLength={150}
                                    showCount
                                />
                            </Form.Item>
                        </Form>
                    )}
                </div>
            </div>
            {/* <div className='name-wrap'>
        <div className='name'>关联社交账户</div>
        <Button type="primary">添加</Button>
      </div> */}
        </div>
    );
};

export default Account;
