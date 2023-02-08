import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Alert, Button, Checkbox, Input, message, Modal } from 'antd';
import { IconFont } from '@/const';
import HeaderTitle from '@/components/HeaderTitle';
import { BrandContext } from '../../container';
import styles from './index.less';
import { delBrandItem, saveBrandItem } from '@/services/brand';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { BrandListContext } from '../../BrandList';

const DelKitModal = React.memo(() => {
    const { refreshBrandList } = useContext(BrandContext);
    const { isDelOpen, setIsDelOpen, activeItem } =
        useContext(BrandListContext);
    const [checked, setChecked] = useState(false);
    const [kitName, setKitName] = useState('');

    const isDisable = useMemo(() => {
        return !checked;
    }, [checked]);

    const handleCheckChange = (e: CheckboxChangeEvent) => {
        setChecked(e.target.checked);
    };

    const handleCancel = useCallback(() => {
        setIsDelOpen(false);
    }, []);

    const handleDelKit = useCallback(async () => {
        if (!activeItem?.id) return;
        try {
            await delBrandItem({
                id: activeItem?.id,
            });
            setIsDelOpen(false);
            refreshBrandList();
            message.success('删除成功');
        } catch (error) {
            message.error('删除工具箱失败');
        }
    }, [activeItem]);

    const handleClose = useCallback(() => {
        setKitName('');
        setChecked(false);
    }, []);

    return (
        <Modal
            title={<HeaderTitle title="你确定要删除品牌工具箱吗" />}
            centered
            maskClosable={false}
            closable={false}
            open={isDelOpen}
            wrapClassName={styles.kitCreateModal}
            okText="删除品牌工具箱"
            onOk={handleDelKit}
            okButtonProps={{
                disabled: isDisable,
                type: 'primary',
                danger: true,
            }}
            cancelText="取消"
            onCancel={handleCancel}
            afterClose={handleClose}
        >
            <p style={{ marginBottom: 10 }}>
                你将要删除
                <span style={{ fontWeight: 'bolder' }}>
                    &nbsp;{activeItem?.brandName}&nbsp;
                </span>
                , 现有设计不会受到影响。
            </p>
            <div className={styles.warnContent}>
                <Alert
                    showIcon
                    message="注意"
                    description={
                        <div className={styles.text}>
                            <p>
                                此操作将永久删除品牌工具箱，您将无法再次访问此品牌工具箱及其相关内容
                            </p>
                            <ul>
                                <li>所有logo</li>
                                <li>所有调色板</li>
                                <li>所有上传的字体和品牌文字样式</li>
                            </ul>
                        </div>
                    }
                    type="warning"
                />
            </div>
            <Checkbox checked={checked} onChange={handleCheckChange}>
                我了解此操作无法撤销
            </Checkbox>
        </Modal>
    );
});

export default DelKitModal;
