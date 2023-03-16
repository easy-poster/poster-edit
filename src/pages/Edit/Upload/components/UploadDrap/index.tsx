import React, {
    ChangeEvent,
    useCallback,
    useContext,
    useRef,
    useState,
} from 'react';
import { message } from 'antd';
import cn from 'classnames';
import styles from './index.less';
import { saveResource } from '@/services/resource';
import { v4 as uuidv4 } from 'uuid';
import { ResourceContext } from '../../container/ResourceContainer';
import { tools } from '@/utils';

const UploadDrop = React.memo(() => {
    const inputImgRef = useRef<HTMLInputElement>(null);
    const [isOver, setIsOver] = useState(false);
    const { getResource } = useContext(ResourceContext);

    const addImage = useCallback(async (file: File) => {
        if (file) {
            try {
                let images = {
                    type: file.type,
                    blob: new Blob([file], { type: file.type }),
                };
                let coverBlob = await tools.compressImg(images, 240, 140);
                let result = await saveResource({
                    uuid: uuidv4(),
                    createTime: new Date(),
                    updateTime: new Date(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: images.blob,
                    cover: coverBlob,
                });
                return result;
            } catch (error) {
                console.log('error', error);
            }
        }
    }, []);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    };

    const uploadQueue = (files: FileList | never[]) => {
        let promiseAry = [];

        for (const key in files) {
            if (Object.hasOwnProperty.call(files, key)) {
                const file = files[key];
                let type = file.type;
                if (type.substring(0, 6) !== 'image/') continue;
                promiseAry.push(
                    new Promise((resolve, reject) => {
                        addImage(file).then((result) => {
                            resolve({ key, result });
                        });
                    }),
                );
            }
        }

        Promise.allSettled(promiseAry)
            .then(() => {
                // 重新请求数据
                getResource();
                message.success('添加成功');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        let files = e.dataTransfer.files || [];
        if (files?.length === 0) {
            return false;
        }
        uploadQueue(files);
    };

    const inputImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        let target = e.target as HTMLInputElement;
        let files = target.files || [];
        if (files?.length === 0) {
            return false;
        }
        uploadQueue(files);
    };

    const handleClickUpload = () => {
        if (inputImgRef.current) {
            inputImgRef.current?.click();
        }
    };

    return (
        <div className={styles.btnWrap}>
            <div
                className={cn(styles.uploadDrop, {
                    [styles.over]: isOver,
                })}
                onDragOver={(e) => handleDragOver(e)}
                onDragLeave={(e) => handleLeave(e)}
                onDrop={(e) => handleDrop(e)}
            >
                {!isOver ? (
                    <>
                        从您的电脑拖拽或
                        <span
                            className={styles.btn}
                            onClick={handleClickUpload}
                        >
                            浏览图片
                        </span>
                    </>
                ) : (
                    '放下图片文件即可添加'
                )}
                <input
                    type="file"
                    ref={inputImgRef}
                    multiple={true}
                    onChange={inputImageChange}
                    style={{ display: 'none' }}
                    accept=".png,.jpg,.jpeg,.svg"
                />
            </div>
        </div>
    );
});

export default UploadDrop;
