import { ActiveSelection, Canvas, Gradient, Pattern } from 'fabric/fabric-impl';
import { fabric } from 'fabric';
import React from 'react';
import { union, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
    AlignmentHandler,
    EventHandler,
    GuidelineHandler,
    ImageHandler,
    InteractionHandler,
    TransactionHandler,
    WorkareaHandler,
    ZoomHandler,
    ShortcutHandler,
    ContextmenuHandler,
} from '.';
import CanvasObject from '../CanvasObject';
import { defaults } from '../const';
import { defaultFilters, FabricObjectType } from '../const/defaults';
import initControls from '../utils/controls';

// 滤镜纹理限制了只能使用2k图
// fabric.textureSize = 8192;

export interface Option {
    /**
     * Canvas id
     * @type {string}
     */
    id: string;
    /**
     * Canvas object
     * @type {FabricCanvas}
     */
    canvas: FabricCanvas;
    /**
     * Canvas parent element
     * @type {HTMLDivElement}
     */
    container: HTMLDivElement;
    /**
     * Canvas 是否可编辑
     * @type {boolean}
     */
    editable: boolean;
    /**
     * Canvas 交互模式
     * @type {InteractionMode}
     */
    interactionMode: InteractionMode;
    /**
     * 持久化对象的属性
     * @type {string[]}
     */
    propertiesToInclude: string[];
    /**
     * 工作区配置
     * @type {WorkareaOption}
     */
    workareaOption: WorkareaOption;
    /**
     * 最小比例
     * @type {number}
     */
    minZoom: number;
    /**
     * 最大比例
     * @type {number}
     */
    maxZoom: number;
    /**
     * Canvas 配置
     * @type {CanvasOption}
     */
    canvasOption: CanvasOption;
    /**
     * Fabric 默认配置
     * @type {FabricObjectOption}
     */
    objectOption: FabricObjectOption;
    /**
     * 网格 配置
     * @type {GridOption}
     */
    gridOption?: GridOption;
    /**
     * 选中属性配置
     * @type
     */
    activeSelectOptions?: Partial<FabricObjectOption<fabric.ActiveSelection>>;
    /**
     * 键盘事件类型
     * @type {KeyEvent}
     */
    keyEvent: KeyEvent;
    /**
     * 添加自定义对象
     * @type {{ [key: string]: any }}
     */
    fabricObjects?: FabricObjects;
    /**
     * Handler
     * @type {{ [key: string]: any }}
     */
    handlers?: { [key: string]: any };
    [key: string]: any;
}
export interface Callback {
    /**
     * canvas 加载完成
     */
    onLoad?: (handler: Handler, canvas?: fabric.Canvas) => void;
    /**
     * 添加对象后的回调
     */
    onAdd?: (target: FabricObject) => void;
    /**
     * 删除对象后的回调
     */
    onRemove?: (target: FabricObject) => void;
    /**
     * 点击对象后的回调
     */
    onClick?: (canvas: FabricCanvas, target: FabricObject) => void;
    /**
     * 双击对象后的回调
     */
    onDbClick?: (canvas: FabricCanvas, target: FabricObject) => void;
    /**
     * 修改对象位置，大小，角度等的回调
     */
    onModified?: (target: FabricObject) => void;
    /**
     * 选中时的回调
     */
    onSelect?: (target?: FabricObject[]) => void;
    /**
     * 返回右键上下文
     */
    onContext?: (
        el: HTMLDivElement,
        e: React.MouseEvent,
        target?: FabricObject,
    ) => Promise<any> | any;
    /**
     * 返回tooltip
     */
    onTooltip?: (
        el: HTMLDivElement,
        target?: FabricObject,
    ) => Promise<any> | any;
    /**
     * 放大缩小回调
     */
    onZoom?: (zooRatio: number) => void;
    /**
     * 撤销重做回调
     */
    onTransaction?: (transaction: TransactionEvent) => void;
    /**
     * 交互模式切换回调
     */
    onInteraction?: (interactionMode: InteractionMode) => void;
}

export type HandlerOptions = Option & Callback;

/**
 * Canvas 交互相关
 * @class Handler
 * @implements {HandlerOptions}
 */
class Handler implements HandlerOptions {
    public id!: string;
    public canvas!: FabricCanvas;
    public workarea!: WorkareaObject | null;
    public container!: HTMLDivElement;
    public editable: boolean = false;
    public interactionMode!: InteractionMode;
    public minZoom!: number;
    public maxZoom!: number;
    public propertiesToInclude: string[] = defaults.propertiesToInclude;
    public workareaOption: WorkareaOption = defaults.workareaOption;
    public canvasOption: CanvasOption = defaults.canvasOption;
    public gridOption: GridOption = defaults.gridOption;
    public objectOption: FabricObjectOption = defaults.objectOption;
    public guidelineOption?: GuidelineOption = defaults.guidelineOption;
    public keyEvent: KeyEvent = defaults.keyEvent;
    public activeSelectionOption?: Partial<
        FabricObjectOption<fabric.ActiveSelection>
    > = defaults.activeSelectionOption;
    public fabricObjects: FabricObjects = CanvasObject;
    public zoomEnabled?: boolean;
    public width?: number;
    public height?: number;

    public onAdd?: (object: FabricObject) => void;
    public onContext?: (
        el: HTMLDivElement,
        e: React.MouseEvent,
        target?: FabricObject,
    ) => Promise<any>;
    public onTooltip?: (
        el: HTMLDivElement,
        target?: FabricObject,
    ) => Promise<any>;
    public onZoom?: (zoomRatio: number) => void;
    public onClick?: (canvas: FabricCanvas, target: FabricObject) => void;
    public onDblClick?: (canvas: FabricCanvas, target: FabricObject) => void;
    public onModified?: (target: FabricObject) => void;
    public onSelect?: (target?: FabricObject[]) => void;
    public onRemove?: (target: FabricObject) => void;
    public onTransaction?: (transaction: TransactionEvent) => void;
    public onInteraction?: (interactionMode: InteractionMode) => void;
    public onLoad?: (handler: Handler, canvas?: fabric.Canvas) => void;

    public imageHandler!: ImageHandler;
    public zoomHandler!: ZoomHandler;
    public alignmentHandler!: AlignmentHandler;
    public guidelineHandler!: GuidelineHandler;
    public interactionHandler!: InteractionHandler;
    public transactionHandler!: TransactionHandler;
    public eventHandler!: EventHandler;
    public workareaHandler!: WorkareaHandler;
    public shortcutHandler!: ShortcutHandler;
    public contextmenuHandler!: ContextmenuHandler;

    public objectMap: Record<string, FabricObject> = {};
    public objects!: FabricObject[];
    public activeLine?: any;
    public activeShape?: any;
    public zoom = 1;
    public prevTarget?: FabricObject;
    public target?: FabricObject;
    public pointArray?: any[];
    public lineArray?: any[];
    public isCut = false;

    public isRequsetAnimFrame = false;
    public requestFrame: any;
    /**
     * Copied object
     *
     * @public
     * @type {*}
     */
    public clipboard!: FabricObject | null;

    constructor(options: HandlerOptions) {
        this.init(options);
    }
    [key: string]: any;
    cantainer!: HTMLDivElement;
    activeSelectOptions?:
        | Partial<FabricObjectOption<ActiveSelection>>
        | undefined;
    handlers?: Handler | undefined;
    onDbClick?:
        | ((canvas: FabricCanvas<Canvas>, target: FabricObject<any>) => void)
        | undefined;

    public init(options: HandlerOptions) {
        this.initOptions(options);
        this.initHandler();
        this.initCallback(options);
    }

    public initOptions = (options: HandlerOptions) => {
        this.id = options.id;
        this.canvas = options.canvas;
        this.container = options.container;
        this.editable = options.editable;
        this.interactionMode = options.interactionMode;
        this.minZoom = options.minZoom;
        this.maxZoom = options.maxZoom;
        this.zoomEnabled = options.zoomEnabled;
        this.width = options.workareaOption.width;
        this.height = options.workareaOption.height;
        this.objects = [];

        initControls();

        this.setPropertiesToInclude(options.propertiesToInclude);
        this.setWorkareaOption(options.workareaOption);
        this.setCanvasOption(options.canvasOption);
        this.setObjectOption(options.objectOption);
        this.setFabricObjects(options.fabricObjects);
        this.setGridOption(options.gridOption);
        this.setGuidelineOption(options.guidelineOption);
        this.setActiveSelectionOption(options.activeSelectionOption);
        this.setKeyEvent(options.keyEvent);
    };

    public initCallback = (options: HandlerOptions) => {
        this.onAdd = options.onAdd;
        this.onTooltip = options.onTooltip;
        this.onZoom = options.onZoom;
        this.onContext = options.onContext;
        this.onClick = options.onClick;
        this.onModified = options.onModified;
        this.onDbClick = options.onDbClick;
        this.onSelect = options.onSelect;
        this.onRemove = options.onRemove;
        this.onTransaction = options.onTransaction;
        this.onInteraction = options.onInteraction;
        this.onLoad = options.onLoad;
    };

    public initHandler = () => {
        this.workareaHandler = new WorkareaHandler(this);
        this.imageHandler = new ImageHandler(this);
        this.zoomHandler = new ZoomHandler(this);
        this.alignmentHandler = new AlignmentHandler(this);
        this.guidelineHandler = new GuidelineHandler(this);
        this.contextmenuHandler = new ContextmenuHandler(this);
        this.interactionHandler = new InteractionHandler(this);
        this.transactionHandler = new TransactionHandler(this);
        this.eventHandler = new EventHandler(this);
        this.shortcutHandler = new ShortcutHandler(this);
    };

    // 初始化设置---------
    /**
     * 设置持久化数据
     * @param propertiesToInclude
     */
    public setPropertiesToInclude = (propertiesToInclude: string[]) => {
        this.propertiesToInclude = union(
            propertiesToInclude,
            this.propertiesToInclude,
        );
    };

    /**
     * 设置工作区参数
     * @param workareaOption
     */
    public setWorkareaOption = (workareaOption: WorkareaOption) => {
        this.workareaOption = { ...this.workareaOption, ...workareaOption };
        if (this.workarea) {
            this.workarea.set({
                ...workareaOption,
            });
        }
    };

    /**
     * 设置canvas画布参数
     * @param canvasOption
     */
    public setCanvasOption = (canvasOption: CanvasOption) => {
        this.canvasOption = { ...this.canvasOption, ...canvasOption };
        this.canvas.setBackgroundColor(
            canvasOption.backgroundColor as string | Pattern | Gradient,
            this.canvas.renderAll.bind(this.canvas),
        );

        if (typeof canvasOption.selection !== 'undefined') {
            this.canvas.selection = canvasOption.selection;
        }

        if (typeof canvasOption.hoverCursor !== 'undefined') {
            this.canvas.hoverCursor = canvasOption.hoverCursor;
        }

        if (typeof canvasOption.defaultCursor !== 'undefined') {
            this.canvas.defaultCursor = canvasOption.defaultCursor;
        }

        if (typeof canvasOption.preserveObjectStacking !== 'undefined') {
            this.canvas.preserveObjectStacking =
                canvasOption.preserveObjectStacking;
        }

        if (typeof canvasOption.controlsAboveOverlay !== 'undefined') {
            this.canvas.controlsAboveOverlay =
                canvasOption.controlsAboveOverlay;
        }
    };

    /**
     * 设置fabric默认参数
     * @param objectOption
     */
    public setObjectOption = (objectOption: FabricObjectOption) => {
        this.objectOption = { ...this.objectOption, ...objectOption };
    };

    /**
     * 设置自定义fabric参数
     * @param fabricObjects
     */
    public setFabricObjects = (fabricObjects?: FabricObjects) => {
        this.fabricObjects = { ...this.fabricObjects, ...fabricObjects };
    };

    /**
     * 设置网格配置
     * @param gridOption
     */
    public setGridOption = (gridOption?: GridOption) => {
        this.gridOption = { ...this.gridOption, ...gridOption };
    };

    /**
     * 设置辅助线参数
     * @param guidelineOption
     */
    public setGuidelineOption = (guidelineOption: GuidelineOption) => {
        this.guidelineOption = { ...this.guidelineOption, ...guidelineOption };
        if (this.guidelineHandler) {
            this.guidelineHandler.init();
        }
    };

    /**
     * 设置选中配置
     * @param activeSelectionOption
     */
    public setActiveSelectionOption = (
        activeSelectionOption: Partial<
            FabricObjectOption<fabric.ActiveSelection>
        >,
    ) => {
        this.activeSelectOptions = {
            ...this.activeSelectOptions,
            ...activeSelectionOption,
        };
    };

    /**
     * 设置快捷键配置
     * @param keyEvent
     */
    public setKeyEvent = (keyEvent: KeyEvent) => {
        this.keyEvent = { ...this.keyEvent, ...keyEvent };
    };
    //初始化设置结束---------

    //公用方法开始--------
    /**
     * @name 获取fabric对象
     * @returns {FabricObject[]}
     */
    public getObjects = (): FabricObject[] => {
        const objects = this.canvas.getObjects().filter((obj: FabricObject) => {
            if (obj.id === 'workarea') {
                return false;
            } else if (obj.id === 'grid') {
                return false;
            } else if (obj.superType === 'port') {
                return false;
            } else if (!obj.id) {
                return false;
            }
            return true;
        }) as FabricObject[];
        if (objects.length) {
            objects.forEach(
                (obj: FabricObject) => obj.id && (this.objectMap[obj.id] = obj),
            );
        } else {
            this.objectMap = {};
        }
        return objects;
    };

    /**
     * @name 设置对象位置
     * @param {FabricObject} obj
     * @param {boolean} [centered]
     */
    public centerObject = (obj: FabricObject, centered?: boolean) => {
        if (centered) {
            this.canvas.centerObject(obj);
            obj.setCoords();
        } else {
            if (
                obj.left &&
                obj.top &&
                obj.width &&
                obj.height &&
                this.canvas.viewportTransform
            ) {
                this.setByPartial(obj, {
                    left:
                        obj.left / this.canvas.getZoom() -
                        obj.width / 2 -
                        this.canvas.viewportTransform[4] /
                            this.canvas.getZoom(),
                    top:
                        obj.top / this.canvas.getZoom() -
                        obj.height / 2 -
                        this.canvas.viewportTransform[5] /
                            this.canvas.getZoom(),
                });
            }
        }
    };

    /**
     * @name 根据id查找对象
     * @param id
     * @returns {FabricObject | undefined}
     */
    public findById = (id: string): FabricObject | undefined => {
        let findObject;
        const exist = this.objects.some((obj) => {
            if (obj.id === id) {
                findObject = obj;
                return true;
            }
            return false;
        });
        if (!exist) {
            console.error('Not found object by id');
            return undefined;
        }
        return findObject;
    };

    /**
     * @name 设置对象属性
     * @param key
     * @param value
     */
    public sekAttr = (key: keyof FabricObject, value: any) => {
        const activeObject = this.canvas.getActiveObject() as FabricObject;
        if (!activeObject) return;
        activeObject.set(key, value);
        activeObject.setCoords();
        this.canvas.requestRenderAll();
        const { onModified } = this;
        if (onModified) {
            onModified(activeObject);
        }
    };

    /**
     * @name 通过对象设置属性
     * @param obj
     * @param key
     * @param value
     * @returns
     */
    public setByObject = (
        obj: FabricObject,
        key: keyof FabricObject,
        value: any,
    ) => {
        if (!obj) return;
        obj.set(key, value);
        obj.setCoords();
        this.canvas.renderAll();
        const { onModified } = this;
        if (onModified) {
            onModified(obj);
        }
    };

    /**
     * @name 通过id设置对象属性
     * @param id
     * @param key
     * @param value
     */
    public setById = (id: string, key: keyof FabricObject, value: any) => {
        const findObject = this.findById(id);
        if (findObject) {
            this.setByObject(findObject, key, value);
        }
    };

    /**
     * @name 设置对象多个属性
     * @param option
     * @returns
     */
    public setObject = (option: Partial<FabricObject>) => {
        const activeObject = this.canvas.getActiveObject() as FabricObject;
        if (!activeObject) return;
        Object.keys(option).forEach((key) => {
            if (option[key] !== activeObject[key]) {
                activeObject.set(key, option[key]);
                activeObject.setCoords();
            }
        });
        this.canvas.requestRenderAll();
        const { onModified } = this;
        if (onModified) {
            onModified(activeObject);
        }
    };

    /**
     * @name 通过对象设置多个属性
     * @param obj
     * @param option
     * @returns
     */
    public setByPartial = (obj: FabricObject, option: FabricObjectOption) => {
        if (!obj) return;
        obj.set(option);
        obj.setCoords();
        this.canvas.renderAll();
    };

    /**
     * @name 设置对象是否可见
     * @param visible
     * @returns
     */
    public setVisible = (visible?: boolean) => {
        const activeObject = this.canvas.getActiveObject() as FabricObject;
        if (!activeObject) return;
        activeObject.set({
            visible,
        });
        this.canvas.renderAll();
    };

    /**
     * @name 选中对象
     * @param obj
     * @param find
     */
    public select = (obj: FabricObject, find?: boolean) => {
        let findObject: any = obj;
        if (find && obj.id) {
            findObject = this.findById(obj.id);
        }
        if (findObject) {
            this.canvas.discardActiveObject();
            this.canvas.setActiveObject(findObject);
            this.canvas.requestRenderAll();
        }
    };

    /**
     * @name 通过id选中对象
     * @param id
     */
    public selectById = (id: string) => {
        const findObject = this.findById(id);
        if (findObject) {
            this.canvas.discardActiveObject();
            this.canvas.setActiveObject(findObject);
            this.canvas.requestRenderAll();
        }
    };

    /**
     * @name 选中所有
     * @returns
     */
    public selectAll = () => {
        this.canvas.discardActiveObject();
        const filteredObjects = this.canvas.getObjects().filter((obj: any) => {
            if (obj.id === 'workarea') {
                return false;
            } else if (!obj.evented) {
                return false;
            } else if (obj.locked) {
                return false;
            }
            return true;
        });

        if (!filteredObjects.length) return;

        if (filteredObjects.length === 1) {
            this.canvas.setActiveObject(filteredObjects[0]);
            this.canvas.renderAll();
            return;
        }
        const activeSelection = new fabric.ActiveSelection(filteredObjects, {
            canvas: this.canvas,
            ...this.activeSelectionOption,
        });
        this.canvas.setActiveObject(activeSelection);
        this.canvas.renderAll();
    };
    // 公用方法结束--------

    // 对象增删改开始-------
    /**
     * @name 加载图片
     * @description 先加载完图片才能add进canvas,做一个图片压缩，最高支持2k
     * @param obj
     * @returns
     */
    public loadImage = (obj: FabricObjectOption) => {
        return new Promise<any>((resolve, reject) => {
            let scaleX = 1;
            let scaleY = 1;
            let limitSize = 2048;
            try {
                fabric.Image.fromURL(
                    obj.src,
                    (image) => {
                        if (this.workarea?.width && this.workarea?.height) {
                            if (
                                image.width! * image.height! >
                                this.workarea.width * this.workarea.height
                            ) {
                                // 加个误差值
                                let EXTRA = 1;
                                let Maxbd =
                                    image.width! / this.workarea.width >
                                    image.height! / this.workarea.height
                                        ? 'width'
                                        : 'height';
                                switch (Maxbd) {
                                    case 'width':
                                        scaleX =
                                            (EXTRA + this.workarea.width) /
                                            image.width!;
                                        scaleY =
                                            (EXTRA + this.workarea.width) /
                                            image.width!;
                                        break;
                                    case 'height':
                                        scaleX =
                                            (EXTRA + this.workarea.height) /
                                            image.height!;
                                        scaleY =
                                            (EXTRA + this.workarea.height) /
                                            image.height!;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                        let newObj = {
                            ...image,
                            scaleX: scaleX.toFixed(8),
                            scaleY: scaleY.toFixed(8),
                        };
                        resolve(newObj);
                    },
                    {
                        crossOrigin: 'anonymous',
                    },
                );
            } catch (error) {}
        });
    };

    /**
     * @name 添加资源前处理
     * @param obj
     * @returns
     */
    public preAdd = async (obj: FabricObjectOption) => {
        if (obj.type === FabricObjectType.IMAGE) {
            let src = obj?.src;
            if (!src) return;
            // 添加图片前计算大小
            let newObj = await this.loadImage(obj);
            newObj = { ...newObj, ...obj };
            this.add(newObj, true);
        } else {
            this.add(obj, true);
        }
    };

    /**
     * @name 添加对象
     * @param obj
     * @param centered 是否居中
     * @param loaded 是否是初始化加载的
     * @returns
     */
    public add = (obj: FabricObjectOption, centered = true, loaded = false) => {
        const { editable, onAdd, objectOption } = this;
        const option: any = {
            hasControls: !obj.locked,
            lockMovementX: obj.locked,
            lockMovementY: obj.locked,
            hoverCursor: obj.locked ? 'pointer' : 'move',
        };
        if (obj.type === FabricObjectType.TEXTBOX) {
            option.editable = true;
        } else {
            option.editable = editable;
        }

        const newOption = {
            ...objectOption,
            ...obj,
            ...option,
        };

        let createObj;
        switch (obj.type) {
            case FabricObjectType.IMAGE:
                createObj = this.addImage({
                    ...newOption,
                    ...{
                        lockUniScaling: true,
                        objectCaching: true,
                        absolutePositioned: true,
                    },
                });
                createObj.setControlsVisibility({
                    mt: false,
                    mb: false,
                    ml: false,
                    mr: false,
                });

                break;
            case FabricObjectType.TEXTBOX:
                createObj = this.fabricObjects[obj.type].create({
                    ...newOption,
                });

                createObj.setControlsVisibility({
                    mt: false,
                    mb: false,
                });
            default:
                break;
        }
        if (!createObj) return;

        // 添加默认居中
        if (centered) {
            this.centerObject(createObj, centered);
            // 添加选中
            this.canvas.setActiveObject(createObj);
        }

        this.canvas.add(createObj);
        this.objects = this.getObjects();

        if (!this.transactionHandler.active && !loaded) {
            this.transactionHandler.save('add');
        }

        if (onAdd && editable && !loaded) {
            onAdd(createObj);
        }

        return createObj;
    };

    /**
     * @name 设置图片
     * @param {FabricImage} obj
     * @param {string} [source]
     * @returns
     */
    public setImage = (
        obj: FabricImage,
        source: string,
    ): Promise<FabricImage> => {
        return new Promise<FabricImage>((resolve, reject) => {
            if (!source) return;
            obj.set('src', source);
            resolve(
                obj.setSrc(source, () => this.canvas.renderAll(), {
                    dirty: true,
                    /** @warn 这里加跨域才有效果 */
                    crossOrigin: 'Anonymous',
                }) as FabricImage,
            );
        });
    };

    /**
     * @name 添加图片
     * @param obj
     * @returns
     */
    public addImage = (obj: FabricImage) => {
        const { objectOption } = this;
        let { src, filters = [], ...otherOption } = obj;
        const image = new Image();

        const createdObj = new fabric.Image(image, {
            originX: 'center',
            originY: 'center',
            ...objectOption,
            ...otherOption,
        }) as FabricImage;
        createdObj.set({
            filters: this.imageHandler.createFilters(filters as IFilter[]),
        });

        this.setImage(createdObj, src!);

        return createdObj;
    };

    /**
     * @name 删除对象
     * @param {FabricObject} target
     */
    public remove = (target?: FabricObject) => {
        const activeObject =
            target || (this.canvas.getActiveObject() as FabricObject);
        if (!activeObject) return;
        if (
            typeof activeObject.deletable !== 'undefined' &&
            !activeObject.deletable
        )
            return;

        if (activeObject.type !== 'activeSelection') {
            this.canvas.discardActiveObject();
            this.canvas.remove(activeObject);
        } else {
            const { _objects: activeObjects } = activeObject;
            const existDeleted = activeObjects.some(
                (obj: FabricObject) =>
                    typeof obj.deletable !== 'undefined' && !obj.deletable,
            );
            if (existDeleted) return;
            this.canvas.discardActiveObject();
        }

        if (!this.transactionHandler.active) {
            this.transactionHandler.save('remove');
        }
        this.objects = this.getObjects();
        const { onRemove } = this;
        if (onRemove) {
            onRemove(activeObject);
        }
    };

    /**
     * @name 通过id删除对象
     * @param id
     */
    public removeById = (id: string) => {
        const findObject = this.findById(id);
        if (findObject) {
            this.remove(findObject);
        }
    };

    /**
     * @name 复制副本
     */
    public duplicate = () => {
        const {
            onAdd,
            propertiesToInclude,
            gridOption: { grid = 10 },
        } = this;
        const activeObject = this.canvas.getActiveObject() as FabricObject;
        if (!activeObject) return;
        if (
            typeof activeObject.cloneable !== 'undefined' &&
            !activeObject.cloneable
        )
            return;

        activeObject.clone((cloneObj: FabricObject) => {
            this.canvas.discardActiveObject();
            if (!cloneObj?.left || !cloneObj?.top) return;
            cloneObj.set({
                left: cloneObj.left + grid,
                top: cloneObj.top + grid,
                evented: true,
            });

            if (cloneObj.type === 'activeSelection') {
                const activeSelection = cloneObj as fabric.ActiveSelection;
                activeSelection.canvas = this.canvas;
                activeSelection.forEachObject((obj: FabricObject) => {
                    obj.set('id', uuidv4());
                    this.canvas.add(obj);
                    this.objects = this.getObjects();
                    if (obj?.dblclick) {
                        obj.on(
                            'mousedblclick',
                            this.eventHandler.object.mousedblclick,
                        );
                    }
                });
                if (onAdd) {
                    onAdd(activeSelection);
                }
                activeSelection.setCoords();
            } else {
                if (activeObject.id === cloneObj.id) {
                    cloneObj.set('id', uuidv4());
                }
                this.canvas.add(cloneObj);
                this.objects = this.getObjects();
                // why todo
                if (cloneObj.dblclick) {
                    cloneObj.on(
                        'mousedblclick',
                        this.eventHandler.object.mousedblclick,
                    );
                }
                if (onAdd) {
                    onAdd(cloneObj);
                }
            }
            this.canvas.setActiveObject(cloneObj);
            this.canvas.requestRenderAll();
        }, propertiesToInclude);
    };

    /**
     * 通过id复制对象
     * @param id
     * @returns
     */
    public duplicateById = (id: string) => {
        const {
            onAdd,
            propertiesToInclude,
            gridOption: { grid = 10 },
        } = this;
        const findObject = this.findById(id);
        if (findObject) {
            if (
                typeof findObject.cloneable !== 'undefined' &&
                !findObject.cloneable
            )
                return;

            findObject.clone((cloneObj: FabricObject) => {
                if (!cloneObj?.left || !cloneObj?.top) return;
                cloneObj.set({
                    left: cloneObj.left + grid,
                    top: cloneObj.top + grid,
                    id: uuidv4(),
                    evented: true,
                });
                this.canvas.add(cloneObj);
                this.objects = this.getObjects();
                if (onAdd) {
                    onAdd(cloneObj);
                }
                if (cloneObj.dblclick) {
                    cloneObj.on(
                        'mousedblclick',
                        this.eventHandler.object.mousedblclick,
                    );
                }
                this.canvas.setActiveObject(cloneObj);
                this.canvas.requestRenderAll();
            }, propertiesToInclude);
        }
        return true;
    };

    /**
     * @name 复制对象
     * @returns
     */
    public copy = () => {
        const { propertiesToInclude } = this;
        const activeObject = this.canvas.getActiveObject() as FabricObject;
        if (!activeObject) return;
        if (
            typeof activeObject.cloneable !== 'undefined' &&
            !activeObject.cloneable
        )
            return;

        activeObject.clone((cloneObj: FabricObject) => {
            if (this.keyEvent.clipboard) {
                this.copyToClipboard(
                    JSON.stringify(
                        cloneObj.toObject(propertiesToInclude),
                        null,
                        '\t',
                    ),
                );
            } else {
                this.clipboard = cloneObj;
            }
        }, propertiesToInclude);

        return true;
    };

    /**
     * @name 复制文本到剪切板
     * @param value
     */
    public copyToClipboard = (value: any) => {
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        textarea.value = value;
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.canvas.wrapperEl?.focus();
    };

    /**
     * @name 剪切
     */
    public cut = () => {
        this.copy();
        this.remove();
        this.isCut = true;
    };

    /**
     * @name 粘贴
     * @returns
     */
    public paste = () => {
        const {
            onAdd,
            propertiesToInclude,
            gridOption: { grid = 10 },
            clipboard,
            isCut,
        } = this;
        const padding = isCut ? 0 : grid;
        if (!clipboard) return;
        if (typeof clipboard.cloneable !== 'undefined' && !clipboard.cloneable)
            return;

        this.isCut = false;

        clipboard.clone((cloneObj: FabricObject) => {
            if (!cloneObj?.left || !cloneObj?.top) return;
            this.canvas.discardActiveObject();
            cloneObj.set({
                left: cloneObj.left + padding,
                top: cloneObj.top + padding,
                id: isCut ? clipboard.id : uuidv4(),
                evented: true,
            });

            if (cloneObj.type === 'activeSelection') {
                cloneObj.canvas = this.canvas;
                cloneObj.forEachObject((obj: FabricObject) => {
                    obj.set('id', isCut ? obj.id : uuidv4());
                    this.canvas.add(obj);
                    if (obj.dblclick) {
                        obj.on(
                            'mousedblclick',
                            this.eventHandler.object.mousedblclick,
                        );
                    }
                });
            } else {
                this.canvas.add(cloneObj);
                if (cloneObj.dblclick) {
                    cloneObj.on(
                        'mousedblclick',
                        this.eventHandler.object.mousedblclick,
                    );
                }
            }

            const newClipboard = clipboard.set({
                top: cloneObj.top,
                left: cloneObj.left,
            });

            if (isCut) {
                this.clipboard = null;
            } else {
                this.clipboard = newClipboard;
            }

            if (!this.transactionHandler.active) {
                this.transactionHandler.save('paste');
            }

            this.objects = this.getObjects();
            if (onAdd) {
                onAdd(cloneObj);
            }
            cloneObj.setCoords();
            switch (cloneObj?.type) {
                case FabricObjectType.IMAGE:
                    cloneObj.setControlsVisibility({
                        mt: false,
                        mb: false,
                        ml: false,
                        mr: false,
                    });
                case FabricObjectType.TEXTBOX:
                    cloneObj.setControlsVisibility({
                        mt: false,
                        mb: false,
                    });
                default:
                    break;
            }
            this.canvas.setActiveObject(cloneObj);
            this.canvas.requestRenderAll();
        }, propertiesToInclude);
    };

    /**
     * @description 锁定选中图层
     */
    public lockActive() {
        const activeObject = this.canvas.getActiveObject() as FabricObject;
        if (activeObject) {
            this.setObject({
                lockMovementX: !activeObject.locked,
                lockMovementY: !activeObject.locked,
                hasControls: activeObject.locked,
                hoverCursor: !activeObject.locked ? 'pointer' : 'move',
                editable: !activeObject.locked,
                locked: !activeObject.locked,
            });
        }
    }

    /**
     * @name 上移层级
     */
    public bringForward = () => {
        const activeObject = this.canvas.getActiveObject() as FabricObject;
        if (activeObject) {
            this.canvas.bringForward(activeObject);
            if (!this.transactionHandler.active) {
                this.transactionHandler.save('bringForward');
            }
            const { onModified } = this;
            if (onModified) {
                onModified(activeObject);
            }
        }
    };

    /**
     * @name 移动到最上的层级
     */
    public bringToFront = () => {
        const activeObject = this.canvas.getActiveObject() as FabricObject;
        if (activeObject) {
            this.canvas.bringToFront(activeObject);
            if (!this.transactionHandler.active) {
                this.transactionHandler.save('bringToFront');
            }
            const { onModified } = this;
            if (onModified) {
                onModified(activeObject);
            }
        }
    };

    /**
     * @name 下移层级
     */
    public sendBackwards = () => {
        const activeObject = this.canvas.getActiveObject() as FabricObject;
        if (activeObject) {
            const firstObject = this.canvas.getObjects()[1] as FabricObject;
            if (firstObject.id === activeObject.id) {
                return;
            }
            if (!this.transactionHandler.active) {
                this.transactionHandler.save('sendBackwards');
            }
            this.canvas.sendBackwards(activeObject);
            const { onModified } = this;
            if (onModified) {
                onModified(activeObject);
            }
        }
    };

    /**
     * @name 移动到最底的层级
     */
    public sendToBack = () => {
        const activeObject = this.canvas.getActiveObject() as FabricObject;
        if (activeObject) {
            this.canvas.sendToBack(activeObject);
            this.canvas.sendToBack(this.canvas.getObjects()[1]);
            if (!this.transactionHandler.active) {
                this.transactionHandler.save('sendToBack');
            }
            const { onModified } = this;
            if (onModified) {
                onModified(activeObject);
            }
        }
    };

    /**
     * @name 图片翻转
     * @param type
     */
    public flipImg = (type: number) => {
        const activeObject = this.canvas.getActiveObject() as FabricObject;
        console.log('activeObject', activeObject);
        if (activeObject && activeObject.type === FabricObjectType.IMAGE) {
            switch (+type) {
                case 0:
                    // 水平翻转
                    activeObject.set('flipX', !activeObject.flipX).setCoords();
                    break;
                case 1:
                    // 垂直翻转
                    activeObject.set('flipY', !activeObject.flipY).setCoords();
                    break;
                default:
                    break;
            }
            const { onModified } = this;
            if (onModified) {
                onModified(activeObject);
            }
        }
    };

    /**
     * @name 保存画面为图片
     * @param {string} [option={ name: 'New Image', format: 'png', quality: 1 }]
     */
    public saveCanvasImage = (
        option = { name: 'New Image', format: 'png', quality: 1 },
    ) => {
        this.zoomHandler.zoomOneToOne();

        const { left, top, width, height } = this.workarea!;
        const dataUrl = this.canvas.toDataURL({
            ...option,
            left,
            top,
            width,
            height,
            enableRetinaScaling: true,
        });

        if (dataUrl) {
            const anchorEl = document.createElement('a');
            anchorEl.href = dataUrl;
            anchorEl.download = `${option.name}.png`;
            document.body.appendChild(anchorEl);
            anchorEl.click();
            anchorEl.remove();
        }
    };

    /**
     * @name 导入画布json数据 先废弃不用
     * @param json
     * @param callback
     */
    public importJSON = async (
        json: any,
        callback?: (canvas: FabricCanvas) => void,
    ) => {
        if (isEmpty(json)) return;
        if (typeof json === 'string') {
            // eslint-disable-next-line no-param-reassign
            json = JSON.parse(json);
        }
        console.log('json', json);
        let prevLeft = 0;
        let prevTop = 0;
        const workarea = json.find(
            (obj: FabricObjectOption) => obj.id === 'workarea',
        );
        if (!this.workarea) {
            this.workareaHandler.init();
        }
        if (workarea) {
            prevLeft = workarea.left;
            prevTop = workarea.top;
            this.workarea?.set(workarea);
            // this.handlers?.workareaHandler.setWorkarea(true);
            this.workarea?.setCoords();
        } else {
            this.canvas.centerObject(this.workarea!);
            this.workarea?.setCoords();
            if (this.workarea?.left && this.workarea?.top) {
                prevLeft = this.workarea.left;
                prevTop = this.workarea.top;
            }
        }
        json.forEach((obj: FabricObjectOption) => {
            if (obj?.id === 'workerea') return;

            const { left, top } = this.workarea!;

            const diffLeft = left! - prevLeft;
            const diffTop = top! - prevTop;
            obj.left! += diffLeft;
            obj.top! += diffTop;

            this.add(obj, false);
            this.canvas.renderAll();
        });

        this.objects = this.getObjects();

        if (callback) {
            callback(this.canvas);
        }
        return Promise.resolve(this.canvas);
    };

    /**
     * @name 导出画布JSON数据
     * @returns
     */
    public exportJSON = () => {
        console.log(
            'export JSON',
            this.canvas.toObject(this.propertiesToInclude),
        );
        this.canvas.renderAll();
        return this.canvas.renderAll().toObject(this.propertiesToInclude)
            .objects as FabricObject[];
    };

    /**
     * @name 清除画布
     * @param includeWorkarea
     */
    public clear = (includeWorkarea = false) => {
        if (includeWorkarea) {
            this.canvas.clear();
            this.workarea = null;
        } else {
            this.canvas.discardActiveObject();
            this.canvas.getObjects().forEach((obj: any) => {
                if (obj?.id === 'workarea') return;
                this.canvas.remove(obj);
            });
        }
        this.objects = this.getObjects();
        this.canvas.renderAll();
    };

    /**
     * @name 销毁画布
     */
    public destroy = () => {
        this.eventHandler.destroy();
        this.guidelineHandler.destroy();
        this.contextmenuHandler.destroy();
        this.workareaHandler.destroy();
        this.canvas.clear();
    };
}

export default Handler;
