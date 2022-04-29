import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { IRouteComponentProps, useModel } from 'umi';
import EditMenu from '@/pages/Edit/components/EditMenu';
import { IconFont } from '@/const';
import UploadPage from '../Upload';
import ImagePage from '../Image';
import GraphicalPage from '../Graphical';
import TextPage from '../Text';
import BackgroundPage from '../Background';
import BrandPage from '../Brand';
import './index.less';

const EditLayout = (props: IRouteComponentProps) => {
  const resouceRef = useRef<HTMLDivElement>(null);
  const lineDropRef = useRef<HTMLDivElement>(null);
  const resouceWrapRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const lineDropDOM = lineDropRef.current;
    const resouceDOM = resouceRef.current;

    if (lineDropDOM && resouceDOM) {
      lineDropDOM.onmouseover = () => {
        lineDropDOM.style.opacity = '1';
      };
      lineDropDOM.onmouseleave = () => {
        lineDropDOM.style.opacity = '0';
      };
      lineDropDOM.onmousedown = (e) => {
        let startX = e.clientX;
        let resizeLeft = lineDropDOM.offsetLeft;
        document.onmousemove = (_event) => {
          let endX = _event.clientX;
          let moveLen = resizeLeft + (endX - startX);
          resouceDOM.style.width = `${moveLen}px`;
          lineDropDOM.style.borderColor = 'rgb(77, 201, 145)';
          lineDropDOM.style.opacity = '1';
        };
        document.onmouseup = (evt) => {
          evt?.stopPropagation();
          document.onmousemove = null;
          document.onmouseup = null;
          lineDropDOM.style.borderColor = '';
          lineDropDOM.style.opacity = '0';
        };
      };
    }
    return () => {
      if (lineDropDOM) {
        lineDropDOM.onmousedown = null;
        lineDropDOM.onmouseover = null;
        lineDropDOM.onmouseleave = null;
      }
    };
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useLayoutEffect(() => {
    const resouceDOM = resouceRef.current;
    if (resouceDOM) {
      resouceDOM.style.width = '296px';
    }
  }, []);

  useEffect(() => {
    const resouceWrapDOM = resouceWrapRef.current;
    const resouceDOM = resouceRef.current;
    let timer: NodeJS.Timeout;
    if (resouceWrapDOM && resouceDOM) {
      if (isOpen) {
        resouceWrapDOM.style.width = `${resouceDOM.clientWidth}px`;
        timer = setTimeout(() => {
          resouceWrapDOM.style.width = 'auto';
        }, 510);
      } else {
        resouceWrapDOM.style.width = `${resouceWrapDOM.clientWidth}px`;
        timer = setTimeout(() => {
          resouceWrapDOM.style.width = '4px';
          resouceWrapDOM.style.overflow = 'hidden';
        }, 200);
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  const { activeTab } = useModel('switchEditTab');

  const renderItem = () => {
    switch (+activeTab) {
      case 1:
        return <UploadPage />;
      case 2:
        return <ImagePage />;
      case 3:
        return <GraphicalPage />;
      case 4:
        return <TextPage />;
      case 5:
        return <BackgroundPage />;
      case 6:
        return <BrandPage />;
      default:
        return <UploadPage />;
    }
  };

  return (
    <div className="edit-wrap">
      <div className="edit-left">
        <EditMenu />
        <div className="edit-resouce">
          <div className="resouce-wrap" ref={resouceWrapRef}>
            <div className="resouce-content" ref={resouceRef}>
              {renderItem()}
            </div>
            {isOpen && <div className="edit-line" ref={lineDropRef}></div>}
          </div>
          <div className="edit-btn" onClick={handleClick}>
            <IconFont
              type="icon-xiangzuo"
              style={{
                fontSize: '14px',
                transform: `${isOpen ? `rotate(0deg)` : `rotate(-180deg)`}`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="edit-right">{props.children}</div>
    </div>
  );
};

export default EditLayout;
