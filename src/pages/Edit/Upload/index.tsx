import React, { useEffect, useMemo, useRef, useState } from 'react';
import { List } from 'antd';
import demoImg from '@/assets/demo.png';
import './index.less';
import { db } from '@/utils/db';
import tools from '@/utils/tools';
import { IconFont } from '@/const';

const UploadPage = () => {
  const inputImgRef = useRef(null);

  const [images, setImages] = useState([]);

  const compressImg = (imgProps: any, width: number, height: number) => {
    return new Promise<string>((resolve, reject) => {
      let img = new Image();
      let base64 = '',
        blob,
        type = 'image/jpg';
      blob = imgProps.blob;
      type = imgProps.type;

      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        if (img.width * img.height > width * height) {
          let canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          let imgAspectRatio = img.width / img.height;
          let Maxbd =
            img.width / width > img.height / height ? 'width' : 'height';
          switch (Maxbd) {
            case 'width':
              canvas.width = width;
              canvas.height = canvas.width / imgAspectRatio;
              break;
            case 'height':
              canvas.height = height;
              canvas.width = canvas.height * imgAspectRatio;
              break;
            default:
              break;
          }
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
          base64 = canvas.toDataURL(type, 1) || '';
          resolve(base64);
        }
      };
      img.onerror = () => {
        reject();
      };
    });
  };

  const getImage = async () => {
    let result = [];
    result = await db.epImage
      .where({
        userId: 123,
      })
      .reverse()
      .sortBy('id');
    if (result.length > 0) {
      setImages(result);
    }
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
        let base64 = await compressImg(images, 240, 140);
        let result = await db.epImage.add({
          userId: 123,
          createTime: new Date(),
          updateTime: new Date(),
          name: file.name, // tools.resourceRepeat(myImage, file?.name) || file?.name
          size: file.size,
          type: file.type,
          blob: images.blob,
          cover: base64,
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

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    let files = e.dataTransfer.files;

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

    Promise.all(promiseAry)
      .then((result) => {
        console.log('result', result);
        // 重新请求数据
        getImage();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const inputImageChange = (e) => {
    if (e?.target?.files.length === 0) {
      return false;
    }
    let promiseAry = [];
    // 批量上传
    for (const key in e.target.files) {
      if (Object.hasOwnProperty.call(e.target.files, key)) {
        const file = e.target.files[key];
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
        // 重新请求数据
        getImage();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickUpload = () => {
    if (inputImgRef.current) {
      inputImgRef.current && inputImgRef.current.click();
    }
  };

  const handleDel = async (item: any) => {
    console.log('item del', item);
    if (item.id) {
      try {
        await db.epImage.delete(item.id);
        // 重新请求数据
        getImage();
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  const handleAdd = (item: any) => {
    console.log('item add', item);
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
                <img className="img-cover" alt="example" src={item.cover} />
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
