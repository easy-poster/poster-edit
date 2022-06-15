import React, { useEffect, useMemo, useRef, useState } from 'react';
import { List, message } from 'antd';
import demoImg from '@/assets/demo.png';
import './index.less';
import { db } from '@/utils/db';
import tools from '@/utils/tools';
import { IconFont, ImageDefData, ItemType } from '@/const';
import { useDispatch, useModel, useParams, useSelector } from 'umi';

const UploadPage = () => {
  const inputImgRef = useRef(null);

  const [images, setImages] = useState([]);
  const dispatch = useDispatch();
  const projectState = useSelector((state) => {
    return state.project.prj;
  });
  const layeres = useSelector((state) => {
    return state.project.layeres;
  });

  const getImage = async () => {
    let result = [];
    result = await db.epImage
      .where({
        userId: 1,
      })
      .reverse()
      .sortBy('updateTime');
    if (result.length > 0) {
      result = result.map((it) => {
        return { ...it, coverBlob: tools.getWebUrl(it.cover || '') };
      });
    }
    setImages(result);
  };

  useEffect(() => {
    getImage();
    return () => {};
  }, []);

  const addImage = async (file) => {
    if (db && file) {
      try {
        let images = {
          type: file.type,
          blob: new Blob([file], { type: file.type }),
        };
        let coverBlob = await tools.compressImg(images, 240, 140);
        let result = await db.epImage.add({
          userId: 1,
          createTime: new Date(),
          updateTime: new Date(),
          name: file.name, // tools.resourceRepeat(myImage, file?.name) || file?.name
          size: file.size,
          type: file.type,
          blob: images.blob,
          cover: coverBlob,
        });
        return result;
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleLeave = (e) => {
    e.preventDefault();
    setIsOver(false);
  };

  const uploadQueue = (files: Array<any>) => {
    let promiseAry = [];

    for (const key in files) {
      if (Object.hasOwnProperty.call(files, key)) {
        const file = files[key];
        let type = file.type;
        if (type.substring(0, 6) !== 'image/') continue;
        promiseAry.push(
          new Promise(async (resolve, reject) => {
            let result = await addImage(file);
            resolve({ key, result });
          }),
        );
      }
    }

    Promise.allSettled(promiseAry)
      .then((result) => {
        console.log('result', result);
        // 重新请求数据
        getImage();
        message.success('添加成功');
        // message.success({
        //   content: '添加成功',
        //   // className: 'custom-class',
        // });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    let files = e.dataTransfer.files || [];
    if (files?.length === 0) {
      return false;
    }
    uploadQueue(files);
  };

  const inputImageChange = (e) => {
    let files = e?.target?.files || [];
    if (files?.length === 0) {
      return false;
    }
    uploadQueue(files);
  };

  const handleClickUpload = () => {
    if (inputImgRef.current) {
      inputImgRef.current && inputImgRef.current.click();
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

  const handleAdd = (data: any) => {
    if (!window.app && Object.keys(projectState).length !== 0) {
      message.warning('项目正在初始化');
      return false;
    }
    let img = new Image();
    let blobUrl = URL.createObjectURL(data.blob);
    img.src = blobUrl;
    img.onload = () => {
      if (img.width * img.height > projectState.width * projectState.height) {
        let imgAspectRatio = img.width / img.height;
        let Maxbd =
          img.width / projectState.width > img.height / projectState.height
            ? 'width'
            : 'height';
        switch (Maxbd) {
          case 'width':
            img.width = projectState.width;
            img.height = img.width / imgAspectRatio;
            break;
          case 'height':
            img.height = projectState.height;
            img.width = img.height * imgAspectRatio;
            break;
          default:
            break;
        }
      }
      let result = {
        ...ImageDefData,
        id: `${new Date().getTime()}_${data.id}`,
        name: data.name,
        resourceId: data.id,
        size: data.size,
        width: img.width,
        height: img.height,
        left: projectState.width / 2,
        top: projectState.height / 2,
      };
      let resources = [];
      resources.push({
        alias: result.id,
        source: blobUrl,
        options: {
          loadType: 2,
          xhrType: 'document',
        },
      });
      if (resources.length) {
        const objectContainer = window.app.getContainer(window.app, 'STAGE');
        window.app
          .addNode(
            window.app,
            result,
            resources,
            layeres.length + 10,
            objectContainer,
          )
          .then(async (sprite) => {
            // 存储到数据库
            try {
              let newLayeres = [...layeres, result];
              dispatch({
                type: 'project/updateLayeres',
                payload: {
                  id: projectState.id,
                  uuid: projectState.uuid,
                  newLayeres,
                },
              });
            } catch (err) {
              console.log('err', err);
            }
          });
      }
    };
  };

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
            <div className="img-item" key={item.id}>
              <div className="img-wrap">
                <img className="img-cover" alt="example" src={item.coverBlob} />
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
