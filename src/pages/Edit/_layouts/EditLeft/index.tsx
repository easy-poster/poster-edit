import React, {
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import EditMenu from '@/pages/Edit/components/EditMenu';
import { IconFont, ResourcePageType } from '@/const';
import UploadPage from '../../Upload';
import ImagePage from '../../Image';
import GraphicalPage from '../../Graphical';
import TextPage from '../../Text';
import BackgroundPage from '../../Background';
import OperatingPanel from './OperatingPanel';
import {
    OperatingPanelContext,
    OperatingPanelType,
} from '../../Container/OperatingPanelContainer';
import styles from './index.less';

const ResourcePageMap = {
    [ResourcePageType.UPLOADPAGE]: UploadPage,
    [ResourcePageType.IMAGEPAGE]: ImagePage,
    [ResourcePageType.GRAPHICALPAGE]: GraphicalPage,
    [ResourcePageType.TEXTPAGE]: TextPage,
    [ResourcePageType.BACKGROUND]: BackgroundPage,
};

const EditLeft = React.memo(() => {
    const resouceRef = useRef<HTMLDivElement>(null);
    const lineDropRef = useRef<HTMLDivElement>(null);
    const resouceWrapRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(true);
    const [activeTab, setActiveTab] = useState(ResourcePageType.UPLOADPAGE);
    const { panelType } = useContext(OperatingPanelContext);

    const isShowPanel = useMemo(() => {
        return panelType !== OperatingPanelType.NONE;
    }, [panelType]);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const ResourcePage = useMemo(() => {
        return ResourcePageMap[activeTab] || React.Fragment;
    }, [activeTab]);

    useLayoutEffect(() => {
        const resouceDOM = resouceRef.current;
        if (resouceDOM) {
            resouceDOM.style.width = '296px';
        }
    }, []);

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

    return (
        <div className={styles.editLeft}>
            <EditMenu activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className={styles.editResouce}>
                <div className={styles.resouceWrap} ref={resouceWrapRef}>
                    <div className={styles.resouceContent} ref={resouceRef}>
                        <div
                            style={{
                                display: isShowPanel ? 'none' : 'block',
                            }}
                        >
                            <ResourcePage />
                        </div>
                        <OperatingPanel />
                    </div>
                    {isOpen && (
                        <div
                            className={styles.editLine}
                            ref={lineDropRef}
                        ></div>
                    )}
                </div>
                <div className={styles.editBtn} onClick={handleClick}>
                    <IconFont
                        type="icon-xiangzuo"
                        style={{
                            fontSize: '14px',
                            transform: `${
                                isOpen ? `rotate(0deg)` : `rotate(-180deg)`
                            }`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export default EditLeft;
