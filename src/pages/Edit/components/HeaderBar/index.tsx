import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, InputRef, message } from 'antd';
import { IconFont } from '@/const';
import { Link } from '@umijs/max';
import { useSelector } from '@umijs/max';
import './index.less';
import { updateProject } from '@/services/project';
import useProject from './useProject';

const HeaderBar = React.memo(() => {
    const [form] = Form.useForm();
    const { getProjectHooks } = useProject();

    const projectState = useSelector((state: any) => {
        return state.project;
    });

    // title
    const [isTitleEdit, setIsTitleEdit] = useState(false);
    const [title, setTitle] = useState('');
    const inputTitleRef = useRef<InputRef>(null);

    useEffect(() => {
        if (projectState.title) {
            setTitle(projectState.title);
        }

        return () => {};
    }, [projectState]);

    const handleEdit = () => {
        setIsTitleEdit(true);
    };

    useEffect(() => {
        if (isTitleEdit) {
            inputTitleRef.current?.focus();
        }
    }, [isTitleEdit]);

    const handleTitleSave = async () => {
        try {
            const values = await form.validateFields();
            setTitle(values.title || title);
            await updateProject({
                id: projectState.id,
                title: values.title || title,
            });
            if (isTitleEdit) {
                setIsTitleEdit(false);
            }
            getProjectHooks();
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
            message.error('修改名字失败，请稍后再试');
        }
    };

    return (
        <div className="header-bar-wrap">
            <div className="bread">
                {/* <div className="bread-item">
                    <Link to="/">个人空间</Link>
                </div>
                <div className="bread-item-separator">
                    <IconFont
                        type="icon-xiangyou"
                        style={{
                            fontSize: '14px',
                        }}
                    />
                </div> */}
                {!isTitleEdit ? (
                    <div className="bread-item" onClick={() => handleEdit()}>
                        {title}
                    </div>
                ) : (
                    <Form
                        form={form}
                        initialValues={{
                            title: title,
                        }}
                        component={false}
                    >
                        <Form.Item style={{ margin: 0 }} name="title">
                            <Input
                                autoComplete="off"
                                maxLength={50}
                                ref={inputTitleRef}
                                onPressEnter={handleTitleSave}
                                onBlur={handleTitleSave}
                            />
                        </Form.Item>
                    </Form>
                )}
            </div>
        </div>
    );
});

export default HeaderBar;
