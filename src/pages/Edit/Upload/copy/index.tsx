import React, {
    ChangeEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import db, { epImage } from '@/utils/db';
import tools from '@/utils/tools';
import { IconFont } from '@/const';
import { useModel } from '@umijs/max';
import { FabricObjectType } from '../Stage/canvas/const/defaults';
import './index.less';

type imagesRes = epImage & {
    coverBlob?: string;
};

const UploadPage = () => {
    const inputImgRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<imagesRes[]>([]);
    const [isOver, setIsOver] = useState(false);

    const { initialState } = useModel('@@initialState');
    const userId = initialState?.currentUser?.id;

    console.log('upload');

    const getImage = useCallback(async () => {
        let result: imagesRes[] = [];
        result = await db.epImage
            .where({
                userId: userId,
            })
            .reverse()
            .sortBy('updateTime');
        if (result.length > 0) {
            result = result.map((it) => {
                return { ...it, coverBlob: tools.getWebUrl(it.cover || '') };
            });
        }
        setImages(result);
    }, [userId]);

    const addImage = useCallback(
        async (file: File) => {
            if (db && file) {
                try {
                    let images = {
                        type: file.type,
                        blob: new Blob([file], { type: file.type }),
                    };
                    let coverBlob = await tools.compressImg(images, 240, 140);
                    let result = await db.epImage.add({
                        userId: userId,
                        uuid: uuidv4(),
                        createTime: new Date(),
                        updateTime: new Date(),
                        name: file.name, // tools.resourceRepeat(myImage, file?.name) || file?.name
                        size: file.size,
                        type: file.type,
                        src: images.blob,
                        cover: coverBlob,
                    });
                    return result;
                } catch (error) {
                    console.log('error', error);
                }
            }
        },
        [userId],
    );

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
                getImage();
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

    const handleDel = async (item: any) => {
        if (item.id) {
            try {
                let res = await db.epImage
                    .where('id')
                    .equals(+item.id)
                    .delete();
                if (res) {
                    // 重新请求数据
                    getImage();
                }
            } catch (error) {
                console.log('error', error);
            }
        }
    };

    const handleAdd = (data: imagesRes) => {
        if (!window.handler) {
            message.warning('项目正在初始化');
            return;
        }
        window.handler.add({
            type: FabricObjectType.IMAGE,
            url: tools.getWebUrl(data.src || ''),
        });
    };

    useEffect(() => {
        getImage();
    }, []);

    return (
        <div className="upload-wrap">
            <div className="btn-wrap">
                <div
                    className={`upload-drop ${isOver ? 'over' : ''}`}
                    onDragOver={(e) => handleDragOver(e)}
                    onDragLeave={(e) => handleLeave(e)}
                    onDrop={(e) => handleDrop(e)}
                >
                    {!isOver ? (
                        <>
                            从您的电脑拖拽或
                            <span className="btn" onClick={handleClickUpload}>
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
            <div className="upload-list">
                {images.map((item) => {
                    return (
                        <div className="img-item" key={item.uuid}>
                            <div className="img-wrap">
                                <img
                                    className="img-cover"
                                    alt="example"
                                    src={item.coverBlob}
                                />
                                <div className="edit-wrap">
                                    <div
                                        className="img-btn edit-del"
                                        onClick={() => handleDel(item)}
                                    >
                                        <IconFont
                                            type="icon-shanchu"
                                            style={{ fontSize: '14px' }}
                                        />
                                    </div>
                                    <div
                                        className="img-btn edit-add"
                                        onClick={() => handleAdd(item)}
                                    >
                                        <IconFont
                                            type="icon-tianjia_huaban"
                                            style={{ fontSize: '16px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="title">{item.name}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UploadPage;
