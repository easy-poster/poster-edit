import React, { useCallback, useState } from 'react';
import { history, useModel } from '@umijs/max';
import { saveProject } from '@/services/project';
import styles from './index.less';
import { IconFont } from '@/const';
import { Button, Form, Popover, Select } from 'antd';
import BridgeController from '@/helper/bridge/BridgeController';
import { useDispatch } from '@umijs/max';

const ExportContent = React.memo(() => {
    const dispatch = useDispatch();
    const [form] = Form.useForm<any>();

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const handleImgExport = () => {
        let resJson = BridgeController.ExportStageJSON();
        console.log('resJson', resJson);
        if (!resJson) return;
        // dispatch({
        //     type: 'project/updatePrj',
        //     payload: {
        //         content: JSON.stringify(resJson),
        //     },
        // });
        window?.handler?.saveCanvasImage();
    };
    return (
        <div className={styles.exportContent}>
            <div className={styles.exportList}>
                <h3>下载</h3>
                <Form form={form} layout="vertical">
                    <Form.Item label="文件类型">
                        <Select
                            defaultValue="lucy"
                            style={{ width: '100%' }}
                            size="large"
                            onChange={handleChange}
                            options={[
                                { value: 'jack', label: 'Jack' },
                                { value: 'lucy', label: 'Lucy' },
                                { value: 'Yiminghe', label: 'yiminghe' },
                                {
                                    value: 'disabled',
                                    label: 'Disabled',
                                    disabled: true,
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="尺寸">
                        <Select
                            defaultValue="lucy"
                            style={{ width: '100%' }}
                            size="large"
                            onChange={handleChange}
                            options={[
                                { value: 'jack', label: 'Jack' },
                                { value: 'lucy', label: 'Lucy' },
                                { value: 'Yiminghe', label: 'yiminghe' },
                                {
                                    value: 'disabled',
                                    label: 'Disabled',
                                    disabled: true,
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="品质">
                        <Select
                            defaultValue="lucy"
                            style={{ width: '100%' }}
                            size="large"
                            onChange={handleChange}
                            options={[
                                { value: 'jack', label: 'Jack' },
                                { value: 'lucy', label: 'Lucy' },
                                { value: 'Yiminghe', label: 'yiminghe' },
                                {
                                    value: 'disabled',
                                    label: 'Disabled',
                                    disabled: true,
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="透明背景">
                        <Select
                            defaultValue="lucy"
                            style={{ width: '100%' }}
                            size="large"
                            onChange={handleChange}
                            options={[
                                { value: 'jack', label: 'Jack' },
                                { value: 'lucy', label: 'Lucy' },
                                { value: 'Yiminghe', label: 'yiminghe' },
                                {
                                    value: 'disabled',
                                    label: 'Disabled',
                                    disabled: true,
                                },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </div>
            <Button size="large" type="primary" block onClick={handleImgExport}>
                下载
            </Button>
        </div>
    );
});

const ExportPopover = React.memo(() => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const handleImgExport = () => {
        let resJson = BridgeController.ExportStageJSON();
        console.log('resJson', resJson);
        if (!resJson) return;
        dispatch({
            type: 'project/updatePrj',
            payload: {
                content: JSON.stringify(resJson),
            },
        });
        window?.handler?.saveCanvasImage();
    };

    return (
        // <Popover
        //     content={<ExportContent />}
        //     trigger="click"
        //     open={open}
        //     onOpenChange={handleOpenChange}
        //     showArrow={false}
        //     placement="bottomRight"
        //     overlayClassName={styles.popoverExportWrap}
        // >
        // </Popover>
        <div className={styles.headerExport} onClick={handleImgExport}>
            <IconFont type="icon-daochu" style={{ fontSize: '24px' }} />
            <span className={styles.text}>导出</span>
        </div>
    );
});

export default ExportPopover;
