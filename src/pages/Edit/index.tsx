import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  dynamic,
  useModel,
  useParams,
  connect,
  useDispatch,
  useStore,
  useSelector,
} from 'umi';
import HeaderBar from './components/HeaderBar';
import SizeBar from './components/SizeBar';
import * as PIXI from 'pixi.js';
import { IconFont, ItemType } from '@/const';
import './index.less';
import { useSetState, useSize } from 'ahooks';
import Stage from './Stage';
import { db, epProject } from '@/utils/db';

const AsyncStage = dynamic({
  loader: async function () {
    // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
    const { default: Stage } = await import(
      /* webpackChunkName: "external_A" */ './Stage'
    );
    return Stage;
  },
});

const Edit = () => {
  const params = useParams<{ id: string }>();
  // 底部伸缩
  const listRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const projectState = useSelector((state) => {
    return state.project.prj;
  });

  useEffect(() => {
    if (params?.id) {
      dispatch({
        type: 'project/getPrj',
        payload: { uuid: params.id },
      });
    }

    return () => {
      console.log('清除内存');
      window.app = null;
    };
  }, []);

  const handleBtnClick = () => {
    setIsOpen(!isOpen);
    const listDOM = listRef.current;
    if (listDOM) {
      if (isOpen) {
        listDOM.style.height = `0px`;
      } else {
        listDOM.style.height = `180px`;
      }
    }
  };

  const downloadRecording = (chunks: any[] | undefined) => {
    let blob = new Blob(chunks, { type: 'video/webm' });
    var url = URL.createObjectURL(blob);
    console.log('url', url);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'animockup.webm';
    document.body.appendChild(a);
    a.click();
    // window.ysFixWebmDuration(new Blob(chunks,{type: "video/webm"}), 5000, {logger: false}).then(function(blob){
    //   var url = URL.createObjectURL(blob);
    //   debugger
    //   const a = document.createElement('a');
    //   a.style.display = 'none';
    //   a.href = url;;
    //   a.download = "animockup.webm";
    //   document.body.appendChild(a);
    //   a.click();
    // });
  };

  const { setShowBuy } = useModel('buy');
  const handleUpdate = () => {
    setShowBuy(true);
  };

  const handleExport = () => {
    console.log('导出', MediaRecorder.isTypeSupported('video/mp4'));
    const stageDom = document.getElementById('stage');
    const fps = 60; //24 30;
    const multiplier = 1;
    const bitrate = 1000000; // 1000000 360p; 2500000 720p; 1080p 8000000;
    if (stageDom && stageDom.childNodes[0]) {
      const stageStream = stageDom.childNodes[0].captureStream(60);
      let chunks: any[] | undefined = [];
      console.log('stageStream', stageStream);
      var recorder = new MediaRecorder(stageStream, {
        videoBitsPerSecond: bitrate,
        mimeType: 'video/webm;codecs=vp9',
        audioBitsPerSecond: 0,
      });
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = (e) => {
        console.log('chunks', chunks);
        downloadRecording(chunks);
      };

      setTimeout(function () {
        recorder.start(10);
      }, 100);

      setTimeout(function () {
        // recording = false;
        recorder.stop();
      }, 10000);
    }
  };

  const handleImgExport = () => {
    const stageDom = document.getElementById('stage');
    if (stageDom && window.app && Object.keys(projectState).length !== 0) {
      const stage = window.app.stage;
      const renderer = window.app.renderer;
      if (stage && renderer) {
        const { x, y } = stage.getBounds();
        const stageImage = renderer.plugins.extract.image(
          stage,
          'image/jpeg',
          1,
        );
        stageImage.onload = () => {
          const canvasElement = document.createElement('canvas');
          const ctx: any = canvasElement.getContext('2d');
          canvasElement.width = projectState.width;
          canvasElement.height = projectState.height;
          ctx.drawImage(
            stageImage,
            -x,
            -y,
            projectState.width,
            projectState.height,
            0,
            0,
            projectState.width,
            projectState.height,
          );
          const data = canvasElement.toDataURL('image/jpeg');
          const download = document.createElement('a');
          download.href = data;
          download.download = '测试图片';
          download.click();
          download.remove();
        };
      }
    }
  };

  return (
    <>
      <div className="edit-header">
        <div className="header-left">
          <HeaderBar projectProps={projectState} />
        </div>
        <div className="header-right">
          <div className="header-update" onClick={handleUpdate}>
            <IconFont type="icon-huiyuan" style={{ fontSize: '28px' }} />
            <span className="update-text">升级</span>
          </div>
          <div className="header-export" onClick={handleImgExport}>
            导出
          </div>
        </div>
      </div>
      <div className="edit-content">
        <div className="edit-main">
          <div className="edit-container">
            <AsyncStage />
            {/* <Stage /> */}
          </div>
          <SizeBar />
        </div>
        <div className="edit-footer">
          <div className="edit-tool-bar">tool bar</div>
          <div className="edit-list-bar" ref={listRef}>
            list bar
          </div>
          <div className="edit-footer-btn" onClick={handleBtnClick}>
            <IconFont
              type="icon-xiangzuo"
              style={{
                fontSize: '14px',
                transform: `${isOpen ? `rotate(270deg)` : `rotate(90deg)`}`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
