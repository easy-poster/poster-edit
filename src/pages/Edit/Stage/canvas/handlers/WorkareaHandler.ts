import { fabric } from 'fabric';
import { Handler } from '.';

/**
 * @description 画布工作区
 */
class WorkareaHandler {
    handler: Handler;

    constructor(handler: Handler) {
        this.handler = handler;
        this.init();
    }

    public init() {
        const { workareaOption } = this.handler;
        this.handler.workarea = new fabric.Rect({
            absolutePositioned: true,
            fill: '#FFF',
            hasControls: true,
            transparentCorners: false,
            borderColor: '#0E98FC',
            cornerColor: '#0E98FC',
            selectable: false,
            ...workareaOption,
        }) as WorkareaObject;
        this.handler.canvas.clipPath = this.handler.workarea;
        this.handler.canvas.add(this.handler.workarea);
        this.handler.objects = this.handler.getObjects();
        this.handler.canvas.centerObject(this.handler.workarea);
        this.handler.canvas.renderAll();
    }

    /**
     * 设置工作区布局
     * @param {WorkareaLayout} layout
     * @returns
     */
    public setLayout = (layout: WorkareaLayout) => {
        this.handler.workarea!.set('layout', layout);
        const { _element, isElement, width, height } = this.handler.workarea!;
        const { canvas } = this.handler;
        let [scaleX, scaleY] = [1, 1];
        const isFixed = layout === 'fixed';
        const isResponsive = layout === 'responsive';
        const isFullscreen = layout === 'fullscreen';
        if (isElement && width && height) {
            if (isFixed) {
                scaleX = width / _element.width;
                scaleY = height / _element.height;
            } else if (isResponsive) {
                const scales = this.calculateScale();
                scaleX = scales.scaleX;
                scaleY = scales.scaleY;
            } else {
                scaleX = canvas.getWidth() / _element.width;
                scaleY = canvas.getHeight() / _element.height;
            }
        }

        this.handler.getObjects().forEach((obj) => {
            const { id } = obj;
            if (id !== 'workarea' && obj.width && obj.height) {
                const objScaleX = !isFullscreen ? 1 : scaleX;
                const objScaleY = !isFullscreen ? 1 : scaleY;
                obj.set({
                    scaleX: !isFullscreen ? 1 : objScaleX,
                    scaleY: !isFullscreen ? 1 : objScaleY,
                });
            }
        });

        if (isResponsive && width && height) {
            const center = canvas.getCenter();
            this.handler.workarea?.set({
                width: width,
                height: height,
            });
            scaleX = canvas.getWidth() / width;
            scaleY = canvas.getHeight() / height;
            if (height >= width) {
                scaleX = scaleY;
            } else {
                scaleY = scaleX;
            }
            this.handler.zoomHandler.zoomToPoint(
                new fabric.Point(center.left, center.top),
                scaleX,
            );

            canvas.centerObject(this.handler.workarea!);
            canvas.renderAll();
            return;
        }

        if (isElement) {
            this.handler.workarea?.set({
                width: _element.width,
                height: _element.height,
                scaleX,
                scaleY,
            });
        } else {
            const comWidth = isFixed ? width : this.handler.canvas.getWidth();
            const comWheight = isFixed
                ? height
                : this.handler.canvas.getHeight();
            this.handler.workarea?.set({
                comWidth,
                comWheight,
                backgroundColor: 'rgba(255, 255, 255, 1)',
            });
            this.handler.canvas.renderAll();
            if (isFixed) {
                canvas.centerObject(this.handler.workarea!);
            } else {
                this.handler.workarea?.set({
                    left: 0,
                    top: 0,
                });
            }
        }
        canvas.centerObject(this.handler.workarea!);
        const center = canvas.getCenter();
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        this.handler.zoomHandler.zoomToPoint(
            new fabric.Point(center.left, center.top),
            1,
        );
        canvas.renderAll();
    };

    /**
     * 计算工作区缩放比例
     * @returns
     */
    public calculateScale = () => {
        const { canvas, workarea } = this.handler;
        const { width, height, _element } = workarea!;
        const Width = _element?.width || width;
        const Height = _element?.height || height;
        let scaleX = canvas.getWidth() / Width;
        let scaleY = canvas.getHeight() / Height;

        if (Height >= Width) {
            scaleX = scaleY;
            if (canvas.getWidth() < Width * scaleX) {
                scaleX = scaleX * (canvas.getWidth() / (Width * scaleX));
            }
        } else {
            scaleY = scaleX;
            if (canvas.getHeight() < Height * scaleX) {
                scaleX = scaleX * (canvas.getHeight() / (Height * scaleX));
            }
        }
        return { scaleX, scaleY };
    };
}

export default WorkareaHandler;
