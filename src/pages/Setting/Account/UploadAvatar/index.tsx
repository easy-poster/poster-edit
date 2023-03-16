import React, { useCallback, useMemo, useRef, useState } from 'react';
import { message, Upload } from 'antd';
import { useModel } from '@umijs/max';
import ImgCrop from 'antd-img-crop';
import {
    RcFile,
    UploadChangeParam,
    UploadFile,
    UploadProps,
} from 'antd/es/upload/interface';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getUploadSTS, updateUserInfo } from '@/services';
import { tools } from '@/utils';
import styles from './index.less';
import { flushSync } from 'react-dom';

interface OSSDataType {
    dir: string;
    expire: string;
    host: string;
    OSSAccessKeyId: string;
    policy: string;
    signature: string;
}

interface AliyunOSSUploadProps {
    value?: UploadFile[];
    onChange?: (fileList: UploadFile[]) => void;
}

const acceptTypes = '.bmp,.gif,.png,jpeg,.jpg';

const UploadAvatar = React.memo(() => {
    const { initialState, setInitialState } = useModel('@@initialState');

    const [loading, setLoading] = useState(false);
    const [OSSData, setOSSData] = useState<OSSDataType>();
    const fileRef = useRef();

    const headImg = useMemo(() => {
        return initialState?.currentUser?.headImg;
    }, [initialState]);

    const initOSSData = useCallback(async () => {
        try {
            let data = await getUploadSTS();
            if (data) {
                setOSSData(data);
            }
        } catch (error) {}
    }, []);

    /**
     * @description 检查上传头像类型
     * @param file
     * @returns
     */
    const checkAvatarFile = async (file: RcFile) => {
        let imgTypeStr = file.type.split('/')[1];
        let isLimit2M = file.size / 1024 / 1024 < 2;
        if (!acceptTypes.includes(imgTypeStr)) {
            message.error('请上传图片文件');
            return;
        }
        if (!isLimit2M) {
            message.error('图片必须小于2M');
            return;
        }
    };

    const handleBeforeCrop = useCallback(
        async (file: RcFile, fileList: RcFile[]) => {
            await initOSSData();
            return Promise.resolve(true);
        },
        [OSSData],
    );

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

    const handleBeforeUpload = useCallback(
        async (file: RcFile) => {
            // 处理文件类型
            checkAvatarFile(file);

            // 处理OSS配置
            if (!OSSData) return;
            const expire = Number(OSSData?.expire) * 1000;
            if (expire < Date.now()) {
                await initOSSData();
            }

            const suffix = file.name.slice(file.name.lastIndexOf('.'));
            const filename = Date.now() + suffix;
            // @ts-ignore
            file.url = 'avatar/' + filename;
            // @ts-ignore
            fileRef.current = file.url;

            return file;
        },
        [OSSData],
    );

    const handleChange: UploadProps['onChange'] = async (
        info: UploadChangeParam<UploadFile>,
    ) => {
        console.log('info', info);
        if (info.file.status !== 'uploading') {
            setLoading(true);
        }
        if (info.file.status === 'done') {
            setLoading(false);
            message.success('头像更新成功');
            await updateUserInfo({
                headImg: info.file.url,
            });
            await fetchUserInfo();
        } else if (info.file.status === 'error') {
            message.error('更新失败');
            setLoading(false);
        }
    };

    const getExtraData: UploadProps['data'] = () => {
        console.log('fileUrl', fileRef.current);
        return {
            key: fileRef.current,
            OSSAccessKeyId: OSSData?.OSSAccessKeyId,
            policy: OSSData?.policy,
            Signature: OSSData?.signature,
        };
    };

    const uploadProps: UploadProps = {
        name: 'file',
        accept: acceptTypes,
        listType: 'picture-circle',
        action: OSSData?.host,
        showUploadList: false,
        data: getExtraData,
        beforeUpload: handleBeforeUpload,
        onChange: handleChange,
    };

    const UploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>更换头像</div>
        </div>
    );

    return (
        <div className={styles.avatarUploader}>
            <h2>头像</h2>
            <ImgCrop
                zoomSlider
                rotationSlider
                cropShape="round"
                modalTitle="编辑上传头像"
                modalOk="确定"
                modalCancel="取消"
                beforeCrop={handleBeforeCrop}
            >
                <Upload {...uploadProps}>
                    {headImg ? (
                        <img
                            src={headImg}
                            alt="avatar"
                            style={{ width: '100%' }}
                        />
                    ) : (
                        UploadButton
                    )}
                </Upload>
            </ImgCrop>
        </div>
    );
});

export default UploadAvatar;
