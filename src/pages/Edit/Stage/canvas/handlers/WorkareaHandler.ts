import { fabric } from 'fabric';
import { debounce } from 'lodash';
import { Handler } from '.';

/**
 * @description 画布工作区
 */
class WorkareaHandler {
    handler: Handler;
    workSpaceDOM: HTMLDivElement;
    resizeAbserve!: ResizeObserver;
    bgarea!: fabric.Image;

    constructor(handler: Handler) {
        this.handler = handler;
        this.workSpaceDOM = this.handler.container;

        this.initBg();
        this.init();
        this.initResizeObserve();
    }

    /**
     * @name 初始化画布大小
     */
    public initBg() {
        this.handler.canvas.setWidth(this.workSpaceDOM.offsetWidth);
        this.handler.canvas.setHeight(this.workSpaceDOM.offsetHeight);
    }

    /**
     * @name 初始化背景图元素
     */
    public initBgImage() {
        const { workareaOption } = this.handler;
        this.bgarea = new fabric.Image('', {
            ...workareaOption,
            ...{
                type: 'backgroundImage',
                originX: 'center',
                originY: 'center',
            },
        });
        this.handler.canvas.add(this.bgarea);
    }

    /**
     * @name 初始化画布工作区
     */
    public init() {
        const { workareaOption } = this.handler;
        this.handler.workarea = new fabric.Rect({
            ...workareaOption,
        }) as WorkareaObject;

        this.handler.canvas.clipPath = this.handler.workarea;
        this.handler.canvas.add(this.handler.workarea);
        this.handler.objects = this.handler.getObjects();
        this.handler.canvas.centerObject(this.handler.workarea);
        this.handler.workarea?.setCoords();
        this.handler.canvas.renderAll();

        this.initBgImage();

        /**
         * @todo 画布渲染完成后才渲染内容，先用定时器，应该有最佳解决办法，后面看
         */
        setTimeout(() => {
            this.initContent();
        }, 1000);
    }

    /**
     * @name 设置背景图片
     * @param backgroundImage
     */
    public setBgImage(backgroundImage: string, loaded = false) {
        const { workareaOption, canvas, onModified } = this.handler;
        fabric.Image.fromURL(backgroundImage ?? '', (img) => {
            if (
                workareaOption.width &&
                workareaOption.height &&
                img.width &&
                img.height
            ) {
                // 加个误差值
                let EXTRA = 2;
                const scale = Math.max(
                    (EXTRA + workareaOption?.width) / img.width,
                    (EXTRA + workareaOption?.height) / img.height,
                );
                this.bgarea.setSrc(img.getSrc());
                this.bgarea.originX = 'center';
                this.bgarea.scale(+scale.toFixed(8));
                canvas.centerObject(this.bgarea);
                this.bgarea?.setCoords();
                // todo 这个刷新背景定时器后面再看
                setTimeout(() => {
                    canvas.renderAll();
                    this.handler.objects = this.handler.getObjects();
                }, 0);

                if (!loaded) {
                    const activeObject =
                        canvas.getActiveObject() as FabricObject;
                    setTimeout(() => {
                        if (onModified) {
                            onModified(activeObject);
                        }
                    }, 0);
                }
            }
        });
    }

    /**
     * @name 设置背景
     * @param type
     * @param value
     */
    public setBg(type: 'IMAGE' | 'COLOR', value: string) {
        if (!value) return;
        switch (type) {
            case 'IMAGE':
                this.handler.workarea?.set('fill', '#FFF');
                this.setBgImage(value, false);
                break;
            case 'COLOR':
                this.bgarea.setSrc('');
                this.handler.workarea?.set('fill', value);
                this.handler.canvas.renderAll();
            default:
                break;
        }
    }

    /**
     * @name 初始化监听包裹画布的div大小变化
     */
    private initResizeObserve() {
        this.resizeAbserve = new ResizeObserver(
            debounce((entries) => {
                let width = entries[0].contentRect.width,
                    height = entries[0].contentRect.height;
                if (width > 200 && height > 200) {
                    this.handler.eventHandler.resize(width, height);
                }
            }, 16.67),
        );
        if (this.workSpaceDOM) {
            this.resizeAbserve.observe(this.workSpaceDOM);
        }
    }

    /**
     * @name 初始化画布内容
     * @returns
     */
    private initContent() {
        const { workareaOption } = this.handler;
        const { content } = workareaOption;
        let json = [];
        if (typeof content === 'string') {
            json = JSON.parse(content as string);
        }
        if (!json) return;

        try {
            let prevLeft = 0;
            let prevTop = 0;
            const workarea = json.find(
                (obj: FabricObjectOption) => obj.id === 'workarea',
            );
            if (!workarea) return;
            prevLeft = workarea.left;
            prevTop = workarea.top;

            json.forEach((obj: FabricObjectOption) => {
                if (obj.id === 'workarea') {
                    // 加载背景
                    if (obj.type === 'backgroundImage') {
                        this.setBgImage(obj?.src ?? '', true);
                    }
                    return;
                }
                const { left, top } = this.handler.workarea!;
                const diffLeft = left! - prevLeft;
                const diffTop = top! - prevTop;
                obj.left! += diffLeft;
                obj.top! += diffTop;
                this.handler.add(obj, false, true);
                this.handler.canvas.renderAll();
                this.handler.objects = this.handler.getObjects();
            });
            let transactionState = json.filter((obj: any) => {
                if (obj.id === 'workarea') {
                    return false;
                }
                return true;
            });
            // 初始化撤销状态数据
            this.handler.transactionHandler.initState(transactionState);
        } catch (error) {
            console.error('error', error);
        }
    }

    /**
     * @name 设置工作区布局
     * @param {WorkareaLayout} layout "fixed" | "responsive" | "fullscreen"
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
     * 加载工作区
     * @param loaded
     */
    // public setWorkarea(loaded: boolean) {
    //     const { canvas, workarea, editable } = this.handler;
    //     let width = canvas.getWidth();
    //     let height = canvas.getHeight();
    //     if (workarea.layout === 'fixed') {
    //         width = workarea.width * workarea.scaleX;
    //         height = workarea.height * workarea.scaleY;
    //     }
    //     let scaleX = 1;
    //     let scaleY = 1;
    //     workarea.set({
    //         width,
    //         height,
    //         scaleX,
    //         scaleY,
    //         isElement: false,
    //         selectable: false,
    //     });
    //     canvas.centerObject(workarea);
    //     if (editable && !loaded) {
    //         const { layout } = workarea;
    //         canvas.getObjects().forEach((obj) => {
    //             const { id } = obj as FabricObject;
    //             if (id !== 'workarea') {
    //                 scaleX = layout === 'fullscreen' ? scaleX : obj.scaleX!;
    //                 scaleY = layout === 'fullscreen' ? scaleY : obj.scaleY!;
    //                 const el = this.handler.elementHandler.findById(id);
    //                 this.handler.elementHandler.setSize(el, obj);
    //                 obj.set({
    //                     scaleX,
    //                     scaleY,
    //                 });
    //                 obj.setCoords();
    //             }
    //         });
    //     }
    //     const center = canvas.getCenter();
    //     const zoom =
    //         loaded || workarea.layout === 'fullscreen'
    //             ? 1
    //             : this.handler.canvas.getZoom();
    //     canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    //     this.handler.zoomHandler.zoomToPoint(
    //         new fabric.Point(center.left, center.top),
    //         zoom,
    //     );
    //     canvas.renderAll();
    // }

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

    /**
     * @name 销毁所有事件
     */
    public destroy = () => {
        if (this.workSpaceDOM && this.resizeAbserve) {
            this.resizeAbserve.disconnect();
        }
    };
}

export default WorkareaHandler;
