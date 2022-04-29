import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Form, Input } from 'antd';
import './index.less';
import { IconFont } from '@/const';
import { Link } from 'umi';

const HeaderBar = () => {
  const [form] = Form.useForm();

  // title
  const [isTitleEdit, setIsTitleEdit] = useState(false);
  const [title, setTitle] = useState('暂无标题');
  const inputTitleRef = useRef(null);
  const handleEdit = () => {
    setIsTitleEdit(true);
  };

  useEffect(() => {
    if (isTitleEdit) {
      inputTitleRef.current!.focus();
    }
  }, [isTitleEdit]);

  const handleTitleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('values', values);
      setTitle(values.title || title);
      if (isTitleEdit) {
        setIsTitleEdit(false);
      }
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  return (
    <div className="header-bar-wrap">
      <div className="bread">
        <div className="bread-item">
          <Link to="/">个人空间</Link>
        </div>
        <div className="bread-item-separator">
          <IconFont
            type="icon-xiangyou"
            style={{
              fontSize: '14px',
            }}
          />
        </div>
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
};

export default HeaderBar;
