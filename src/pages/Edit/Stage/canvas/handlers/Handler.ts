import {
  ActiveSelection,
  Canvas,
  Gradient,
  Object,
  Pattern,
} from 'fabric/fabric-impl';
import React from 'react';
import { union } from 'lodash';
import {
  CustomHandler,
  EventHandler,
  GuidelineHandler,
  ImageHandler,
  WorkareaHandler,
  ZoomHandler,
} from '.';
import CanvasObject from '../CanvasObject';
import { defaults } from '../const';

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

  private isRequsetAnimFrame = false;
  private requestFrame: any;
  /**
   * Copied object
   *
   * @private
   * @type {*}
   */
  private clipboard: any;

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

  private init(options: HandlerOptions) {
    this.initOptions(options);
    this.initCallback(options);
    this.initHandler();
  }

  private initOptions = (options: HandlerOptions) => {
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

  private initCallback = (options: HandlerOptions) => {
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

  private initHandler = () => {
    this.workareaHandler = new WorkareaHandler(this);
    this.imageHandler = new ImageHandler(this);
    this.eventHandler = new EventHandler(this);
    this.zoomHandler = new ZoomHandler(this);
    this.guidelineHandler = new GuidelineHandler(this);
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
      objects.forEach((obj) => (this.objectMap[obj.id] = obj));
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
}

export default Handler;
