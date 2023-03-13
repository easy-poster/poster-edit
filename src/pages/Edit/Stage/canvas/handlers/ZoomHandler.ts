import { fabric } from 'fabric';
import { Handler } from '.';
import { VideoObject } from '../objects/Video';

/**
 * @description 放大缩小相关
 */
class ZoomHandler {
    handler: Handler;

    constructor(handler: Handler) {
        this.handler = handler;
    }

    /**
     * @name 放大到某点
     * @param point
     * @param zoom 0~1
     */
    public zoomToPoint = (point: fabric.Point, zoom: number) => {
        const { minZoom, maxZoom } = this.handler;
        let zoomRatio = zoom;
        if (zoom <= minZoom / 100) {
            zoomRatio = minZoom / 100;
        } else if (zoom >= maxZoom / 100) {
            zoomRatio = maxZoom / 100;
        }
        this.handler.canvas.zoomToPoint(point, zoomRatio);
        // this.handler.getObjects().forEach((obj) => {
        //     if (obj.superType === 'element') {
        //         const { id, width, height, player } = obj as VideoObject;
        //         const el = this.handler.elementHandler.findById(id);
        //         // update the element
        //         this.handler.elementHandler.setScaleOrAngle(el, obj);
        //         this.handler.elementHandler.setSize(el, obj);
        //         this.handler.elementHandler.setPosition(el, obj);
        //         if (player) {
        //             player.setPlayerSize(width, height);
        //         }
        //     }
        // });
        if (this.handler.onZoom) {
            this.handler.onZoom(zoomRatio);
        }
        this.handler.canvas.requestRenderAll();
    };

    /**
     * @name 放大缩小到指定大小
     * @param zoom
     */
    public zoomToNumber = (zoom: number) => {
        this.handler.zoomHandler.zoomToPoint(
            new fabric.Point(
                this.handler.canvas.getWidth() / 2,
                this.handler.canvas.getHeight() / 2,
            ),
            zoom,
        );
    };

    /**
     * @name 1比1放大
     */
    public zoomOneToOne = () => {
        const center = this.handler.canvas.getCenter();
        this.handler.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        this.zoomToPoint(new fabric.Point(center.left, center.top), 1);
    };

    /**
     * @name 放大带适应屏幕
     */
    public zoomToFit = () => {
        const { canvas, workarea } = this.handler;
        const { width, height } = workarea!;
        if (!width || !height) return;
        let scaleX = canvas.getWidth() / width;
        let scaleY = canvas.getHeight() / height;
        if (height >= width) {
            scaleX = scaleY;
            if (canvas.getWidth() < width * scaleX) {
                scaleX = scaleX * (canvas.getWidth() / (width * scaleX));
            }
        } else {
            if (canvas.getHeight() < height * scaleX) {
                scaleX = scaleX * (canvas.getHeight() / (height * scaleX));
            }
        }
        const center = canvas.getCenter();
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        this.zoomToPoint(new fabric.Point(center.left, center.top), scaleX);
    };

    /**
     * @name 放大
     */
    public zoomIn = () => {
        const { canvas } = this.handler;
        let zoomRatio = canvas.getZoom();
        zoomRatio += 0.05;
        const center = canvas.getCenter();
        this.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
    };

    /**
     * @name 缩小
     */
    public zoomOut = () => {
        const { canvas } = this.handler;
        let zoomRatio = canvas.getZoom();
        zoomRatio -= 0.05;
        const center = canvas.getCenter();
        this.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
    };

    /**
     * @name 中心对象放大
     * @param {FabricObject} target
     * @param zoomFit
     */
    public zoomToCenterWithObject = (
        target: FabricObject,
        zoomFit?: boolean,
    ) => {
        const { left: canvasLeft, top: canvasTop } =
            this.handler.canvas.getCenter();
        const { left, top, width, height } = target;
        if (top && left && width && height) {
            const diffTop = canvasTop - (top + height / 2);
            const diffLeft = canvasLeft - (left + width / 2);
            if (zoomFit) {
                let scaleX;
                let scaleY;
                scaleX = this.handler.canvas.getWidth() / width;
                scaleY = this.handler.canvas.getHeight() / height;
                if (height > width) {
                    scaleX = scaleY;
                    if (this.handler.canvas.getWidth() < width * scaleX) {
                        scaleX =
                            scaleX *
                            (this.handler.canvas.getWidth() / (width * scaleX));
                    }
                } else {
                    scaleY = scaleX;
                    if (this.handler.canvas.getHeight() < height * scaleX) {
                        scaleX =
                            scaleX *
                            (this.handler.canvas.getHeight() /
                                (height * scaleX));
                    }
                }
                this.handler.canvas.setViewportTransform([
                    1,
                    0,
                    0,
                    1,
                    diffLeft,
                    diffTop,
                ]);
                this.zoomToPoint(
                    new fabric.Point(canvasLeft, canvasTop),
                    scaleX,
                );
            } else {
                const zoom = this.handler.canvas.getZoom();
                this.handler.canvas.setViewportTransform([
                    1,
                    0,
                    0,
                    1,
                    diffLeft,
                    diffTop,
                ]);
                this.zoomToPoint(new fabric.Point(canvasLeft, canvasTop), zoom);
            }
        }
    };

    /**
     * @name 中心放大
     * @param zoomFit
     * @returns
     */
    public zoomToCenter = (zoomFit?: boolean) => {
        const activeObject = this.handler.canvas.getActiveObject();
        if (!activeObject) {
            return;
        }
        this.zoomToCenterWithObject(activeObject, zoomFit);
    };
}

export default ZoomHandler;
