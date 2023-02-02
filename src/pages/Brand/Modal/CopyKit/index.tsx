import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Checkbox, Input, message, Modal } from 'antd';
import { IconFont } from '@/const';
import Header from '../../components/Header';
import { BrandContext } from '../../container';
import styles from './index.less';
import { saveBrandItem } from '@/services/brand';
import { BrandListContext } from '../../BrandList';

const CopyKitModal = React.memo(() => {
    const { refreshBrandList } = useContext(BrandContext);
    const { isCopyOpen, setIsCopyOpen, activeItem } =
        useContext(BrandListContext);
    const [kitName, setKitName] = useState('');

    const isDisable = useMemo(() => {
        return !kitName.length;
    }, [kitName]);

    const handleInputChange = useCallback(
        (e: { target: { value: React.SetStateAction<string> } }) => {
            setKitName(String(e.target.value).trim());
        },
        [],
    );

    const handleCancel = useCallback(() => {
        setIsCopyOpen(false);
    }, []);

    const handleAddKit = useCallback(async () => {
        try {
            await saveBrandItem({
                brandName: kitName,
            });
            setIsCopyOpen(false);
            refreshBrandList();
            message.success('复制成功');
        } catch (error) {
            message.error('创建工具箱失败');
        }
    }, [kitName]);

    const handleClose = useCallback(() => {
        setKitName('');
    }, []);

    return (
        <Modal
            title={<Header title="复制品牌工具箱" />}
            centered
            maskClosable={false}
            closable={false}
            open={isCopyOpen}
            wrapClassName={styles.kitCreateModal}
            okText="复制"
            onOk={handleAddKit}
            okButtonProps={{
                disabled: isDisable,
                type: 'primary',
            }}
            cancelText="取消"
            onCancel={handleCancel}
            afterClose={handleClose}
        >
            <p style={{ marginBottom: 10 }}>名称</p>
            <Input
                size="large"
                value={kitName}
                onChange={handleInputChange}
                maxLength={50}
            />
        </Modal>
    );
});

export default CopyKitModal;
