import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Input, message, Modal } from 'antd';
import { IconFont } from '@/const';
import HeaderTitle from '@/components/HeaderTitle';
import { BrandContext } from '../../container';
import styles from './index.less';
import { saveBrandItem } from '@/services/brand';

const NewKitModal = React.memo(() => {
    const { refreshBrandList } = useContext(BrandContext);
    const [isOpen, setIsOpen] = useState(false);
    const [kitName, setKitName] = useState('');

    const isDisable = useMemo(() => {
        return !kitName.length;
    }, [kitName]);

    const handleOpenModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleInputChange = useCallback(
        (e: { target: { value: React.SetStateAction<string> } }) => {
            setKitName(String(e.target.value).trim());
        },
        [],
    );

    const handleCancel = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleAddKit = useCallback(async () => {
        try {
            await saveBrandItem({
                brandName: kitName,
            });
            setIsOpen(false);
            refreshBrandList();
        } catch (error) {
            message.error('创建工具箱失败');
        }
    }, [kitName]);

    const handleClose = useCallback(() => {
        setKitName('');
    }, []);

    return (
        <>
            <HeaderTitle
                size="large"
                title="品牌工具箱"
                rightExtra={
                    <Button
                        icon={
                            <IconFont
                                type="icon-tianjia_huaban"
                                style={{
                                    fontSize: '18px',
                                }}
                            />
                        }
                        onClick={handleOpenModal}
                    >
                        新建工具箱
                    </Button>
                }
            />
            <Modal
                title={<HeaderTitle title="创建品牌工具箱" />}
                centered
                keyboard={false}
                maskClosable={false}
                closable={false}
                open={isOpen}
                wrapClassName={styles.kitCreateModal}
                okText="创建"
                onOk={handleAddKit}
                okButtonProps={{
                    disabled: isDisable,
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
        </>
    );
});

export default NewKitModal;
