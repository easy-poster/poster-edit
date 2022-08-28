import {
  ActiveSelection,
  Canvas,
  Gradient,
  Object,
  Pattern,
} from 'fabric/fabric-impl';
import { fabric } from 'fabric';
import React from 'react';
import { union } from 'lodash';
import {
  CustomHandler,
  EventHandler,
  GuidelineHandler,
  ImageHandler,
  InteractionHandler,
  WorkareaHandler,
  ZoomHandler,
} from '.';
import CanvasObject from '../CanvasObject';
import { defaults } from '../const';
import { FabricObjectType, WorkareaLayoutType } from '../const/defaults';
// import imgmlr from '@/assets/canvas/middlecontrol.svg';

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
   * @type {{ [key: string]: CustomHandler }}
   */
  handlers?: { [key: string]: CustomHandler };
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
   * 修改对象后的回调
   */
  onModified?: (target: FabricObject) => void;
  /**
   * 选中时的回调
   */
  onSelect?: (target: FabricObject) => void;
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
  onTooltip?: (el: HTMLDivElement, target?: FabricObject) => Promise<any> | any;
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
  public id: string;
  public canvas: FabricCanvas;
  public workarea: WorkareaObject;
  public container: HTMLDivElement;
  public editable: boolean = false;
  public interactionMode: InteractionMode;
  public minZoom: number;
  public maxZoom: number;
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
  public onSelect?: (target: FabricObject) => void;
  public onRemove?: (target: FabricObject) => void;
  public onTransaction?: (transaction: TransactionEvent) => void;
  public onInteraction?: (interactionMode: InteractionMode) => void;
  public onLoad?: (handler: Handler, canvas?: fabric.Canvas) => void;

  public imageHandler: ImageHandler;
  public eventHandler: EventHandler;
  public guidelineHandler: GuidelineHandler;

  public objectMap: Record<string, FabricObject> = {};
  public objects: FabricObject[];
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
  public clipboard: any;

  constructor(options: HandlerOptions) {
    this.init(options);
  }
  [key: string]: any;
  cantainer: HTMLDivElement;
  activeSelectOptions?:
    | Partial<FabricObjectOption<ActiveSelection>>
    | undefined;
  handlers?: { [key: string]: CustomHandler } | undefined;
  onDbClick?:
    | ((canvas: FabricCanvas<Canvas>, target: FabricObject<Object>) => void)
    | undefined;

  public init(options: HandlerOptions) {
    this.initOptions(options);
    this.initCallback(options);
    this.initHandler();
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
    this.width = options.width;
    this.height = options.height;
    this.objects = [];

    this.initControls();
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
    this.eventHandler = new EventHandler(this);
    this.zoomHandler = new ZoomHandler(this);
    this.guidelineHandler = new GuidelineHandler(this);
    this.interactionHandler = new InteractionHandler(this);
  };

  public initControls = () => {
    let imgmlr = document.createElement('img');
    imgmlr.src = 'http://localhost:8000/middlecontrol.svg';

    let imgmtb = document.createElement('img');
    imgmtb.src = 'http://localhost:8000/middlecontrolhoz.svg';

    let imgedge = document.createElement('img');
    imgedge.src = 'http://localhost:8000/edgecontrol.svg';

    let imgrot = document.createElement('img');
    imgrot.src = 'http://localhost:8000/rotateicon.svg';

    function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      const wsize = 20;
      const hsize = 25;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(imgmlr, -wsize / 2, -hsize / 2, wsize, hsize);
      ctx.restore();
    }

    function renderIconRotate(ctx, left, top, styleOverride, fabricObject) {
      const wsize = 40;
      const hsize = 40;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(imgrot, -wsize / 2, -hsize / 2, wsize, hsize);
      ctx.restore();
    }

    function renderIconHoz(ctx, left, top, styleOverride, fabricObject) {
      const wsize = 25;
      const hsize = 20;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(imgmtb, -wsize / 2, -hsize / 2, wsize, hsize);
      ctx.restore();
    }

    function renderIconEdge(ctx, left, top, styleOverride, fabricObject) {
      const wsize = 25;
      const hsize = 25;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(imgedge, -wsize / 2, -hsize / 2, wsize, hsize);
      ctx.restore();
    }

    fabric.Object.prototype.padding = 1;
    fabric.Object.prototype.controls.mtr.withConnection = false;
    fabric.Object.prototype.borderScaleFactor = 2.5;
    fabric.Object.prototype.borderOpacityWhenMoving = 1;
    fabric.Object.prototype.borderColor = '#209fa5';
    // 修改控制点的形状，默认为`rect`矩形，可选的值还有`circle`圆形
    fabric.Object.prototype.cornerStyle = 'circle';
    // 修改控制点的填充色为白色
    fabric.Object.prototype.cornerColor = 'white';
    // 设置控制点不透明，即可以盖住其下的控制线
    fabric.Object.prototype.transparentCorners = false;
    // 修改控制点的边框颜色为`gray`灰色
    fabric.Object.prototype.cornerStrokeColor = 'gray';

    // 单独修改旋转控制点距离主体的纵向距离为-20px
    // fabric.Object.prototype.controls.mtr.offsetY = -30;

    fabric.Object.prototype.controls.ml = new fabric.Control({
      x: -0.5,
      y: 0,
      offsetX: -1,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
      getActionName: fabric.controlsUtils.scaleOrSkewActionName,
      render: renderIcon,
    });

    fabric.Object.prototype.controls.mr = new fabric.Control({
      x: 0.5,
      y: 0,
      offsetX: 1,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
      getActionName: fabric.controlsUtils.scaleOrSkewActionName,
      render: renderIcon,
    });

    fabric.Object.prototype.controls.mb = new fabric.Control({
      x: 0,
      y: 0.5,
      offsetY: 1,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
      getActionName: fabric.controlsUtils.scaleOrSkewActionName,
      render: renderIconHoz,
    });

    fabric.Object.prototype.controls.mt = new fabric.Control({
      x: 0,
      y: -0.5,
      offsetY: -1,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
      getActionName: fabric.controlsUtils.scaleOrSkewActionName,
      render: renderIconHoz,
    });

    fabric.Object.prototype.controls.tl = new fabric.Control({
      x: -0.5,
      y: -0.5,
      cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingEqually,
      render: renderIconEdge,
    });

    fabric.Object.prototype.controls.tr = new fabric.Control({
      x: 0.5,
      y: -0.5,
      cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingEqually,
      render: renderIconEdge,
    });

    fabric.Object.prototype.controls.bl = new fabric.Control({
      x: -0.5,
      y: 0.5,
      cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingEqually,
      render: renderIconEdge,
    });

    fabric.Object.prototype.controls.br = new fabric.Control({
      x: 0.5,
      y: 0.5,
      cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingEqually,
      render: renderIconEdge,
    });

    fabric.Object.prototype.controls.mtr = new fabric.Control({
      x: 0,
      y: -0.5,
      offsetY: -30,
      actionName: 'rotate',
      actionHandler: fabric.controlsUtils.rotationWithSnapping,
      cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
      render: renderIconRotate,
    });

    fabric.Textbox.prototype.controls = fabric.Object.prototype.controls;
    let textBoxControls = (fabric.Textbox.prototype.controls = {});
    textBoxControls.mtr = fabric.Object.prototype.controls.mtr;
    textBoxControls.tr = fabric.Object.prototype.controls.tr;
    textBoxControls.br = fabric.Object.prototype.controls.br;
    textBoxControls.tl = fabric.Object.prototype.controls.tl;
    textBoxControls.bl = fabric.Object.prototype.controls.bl;
    textBoxControls.mt = fabric.Object.prototype.controls.mt;
    textBoxControls.mb = fabric.Object.prototype.controls.mb;

    textBoxControls.ml = new fabric.Control({
      x: -0.5,
      y: 0,
      offsetX: -1,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionHandler: fabric.controlsUtils.changeWidth,
      actionName: 'resizing',
      render: renderIcon,
    });

    textBoxControls.mr = new fabric.Control({
      x: 0.5,
      y: 0,
      offsetX: 1,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionHandler: fabric.controlsUtils.changeWidth,
      actionName: 'resizing',
      render: renderIcon,
    });

    this.canvas.on('text:changed', () => {
      let linewidth =
        this.canvas.getActiveObject().__lineWidths[
          this.canvas.getActiveObject().__lineWidths.length - 1
        ];
      if (
        !isNaN(linewidth) &&
        linewidth + 40 > this.canvas.getActiveObject().width
      ) {
        this.canvas.getActiveObject().set('width', linewidth + 40);
        this.canvas.renderAll();
      }
    });
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
    if (
      typeof canvasOption.width !== 'undefined' &&
      typeof canvasOption.height !== 'undefined'
    ) {
      if (this.eventHandler) {
        this.eventHandler.resize(canvasOption.width, canvasOption.height);
      } else {
        this.canvas.setWidth(canvasOption.width).setHeight(canvasOption.height);
      }
    }

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
      this.canvas.preserveObjectStacking = canvasOption.preserveObjectStacking;
    }

    if (typeof canvasOption.controlsAboveOverlay !== 'undefined') {
      this.canvas.controlsAboveOverlay = canvasOption.controlsAboveOverlay;
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
    console.log('this.fabricObjects', this.fabricObjects);
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
    activeSelectionOption: Partial<FabricObjectOption<fabric.ActiveSelection>>,
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

  /**
   * 获取fabric对象
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
   * 设置对象位置
   *
   * @param {FabricObject} obj
   * @param {boolean} [centered]
   */
  public centerObject = (obj: FabricObject, centered?: boolean) => {
    if (centered) {
      this.canvas.centerObject(obj);
      obj.setCoords();
    } else {
      this.setByPartial(obj, {
        left:
          obj.left / this.canvas.getZoom() -
          obj.width / 2 -
          this.canvas.viewportTransform[4] / this.canvas.getZoom(),
        top:
          obj.top / this.canvas.getZoom() -
          obj.height / 2 -
          this.canvas.viewportTransform[5] / this.canvas.getZoom(),
      });
    }
  };

  public add = (
    obj: FabricObjectOption,
    centered = true,
    loaded = false,
    group = false,
  ) => {
    const { editable, onAdd, gridOption, objectOption } = this;
    const option: any = {
      hasControls: editable,
      hasBorders: editable,
      selectable: editable,
      lockMovementX: !editable,
      lockMovementY: !editable,
      hoverCursor: !editable ? 'pointer' : 'move',
    };
    if (obj.type === FabricObjectType.ITEXT) {
      option.editable = true;
    } else {
      option.editable = editable;
    }

    if (editable && this.workarea.layout === WorkareaLayoutType.FULLSCREEN) {
      option.scaleX = this.workarea.scaleX;
      option.scaleY = this.workarea.scaleY;
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
        break;
      case FabricObjectType.TEXTBOX:
        createObj = this.fabricObjects[obj.type].create({ ...newOption });
        createObj.setControlsVisibility({
          mt: false,
          mb: false,
        });
      default:
        break;
    }
    if (!createObj) return;

    // 添加默认居中
    this.centerObject(createObj, centered);

    this.canvas.add(createObj);
    if (onAdd && editable && !loaded) {
      onAdd(createObj);
    }
    // 添加选中
    this.canvas.setActiveObject(createObj);

    return createObj;
  };

  // add Type --------
  /**
   * Set the image
   * @param {FabricImage} obj
   * @param {(File | string)} [source]
   * @returns
   */
  public setImage = (
    obj: FabricImage,
    source?: File | string,
  ): Promise<FabricImage> => {
    return new Promise((resolve) => {
      if (!source) {
        obj.set('file', null);
        obj.set('src', null);
        resolve(
          obj.setSrc(
            'http://localhost:8000/demo.png',
            () => this.canvas.renderAll(),
            {
              dirty: true,
            },
          ) as FabricImage,
        );
      }
      if (source instanceof File) {
        const reader = new FileReader();
        reader.onload = () => {
          obj.set('file', source);
          obj.set('src', null);
          resolve(
            obj.setSrc(reader.result as string, () => this.canvas.renderAll(), {
              dirty: true,
            }) as FabricImage,
          );
        };
        reader.readAsDataURL(source);
      } else {
        obj.set('file', null);
        obj.set('src', source);
        resolve(
          obj.setSrc(source, () => this.canvas.renderAll(), {
            dirty: true,
          }) as FabricImage,
        );
      }
    });
  };

  /**
   * 添加图片
   * @param obj
   * @returns
   */
  public addImage = (obj: FabricImage) => {
    const { objectOption } = this;
    const { filters = [], src, file, ...otherOption } = obj;
    const image = new Image();

    const createdObj = new fabric.Image(image, {
      originX: 'center',
      originY: 'center',
      ...objectOption,
      ...otherOption,
    }) as FabricImage;
    // createdObj.set({
    // 	filters: this.imageHandler.createFilters(filters),
    // });
    this.setImage(createdObj, src || file);
    return createdObj;
  };

  // add Type end -------
}

export default Handler;
