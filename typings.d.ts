import '@umijs/max/typings';
/**
 * 画布相关
 */

// 把canvas 和 handler 挂载在window上
declare interface Window {
    canvas: FabricCanvas | null;
    handler: any;
}

declare type AnimationType =
    | 'fade'
    | 'bounce'
    | 'shake'
    | 'scaling'
    | 'rotation'
    | 'flash'
    | 'custom'
    | 'none';

declare interface AnimationProperty {
    delay?: number;
    duration?: number;
    autoplay?: boolean;
    loop?: boolean | number;
    type: AnimationType;
    offset?: number;
    opacity?: number;
    bounce?: 'vertical' | 'horizontal';
    shake?: 'vertical' | 'horizontal';
    scale?: number;
    angle?: number;
    fill?: string | fabric.Pattern;
    stroke?: string;
}

declare interface LinkProperty {
    enabled?: boolean;
    type?: string;
    state?: string;
    [key: string]: any;
}

declare interface TooltipProperty {
    enabled?: boolean;
    type?: string;
    template?: string;
}

declare interface TriggerProperty {
    enabled?: boolean;
    type?: string;
    script?: string;
    effect?: string;
}

declare interface FabricCanvasOption {
    wrapperEl?: HTMLElement;
}

declare type FabricCanvas<T extends any = fabric.Canvas> = T & FabricCanvasOption;

declare interface KeyEvent {
    /**
     * Arrow key
     * @type {boolean}
     */
    move?: boolean;
    /**
     * Ctrl + A
     * @type {boolean}
     */
    all?: boolean;
    /**
     * Ctrl + C
     * @type {boolean}
     */
    copy?: boolean;
    /**
     * Ctrl + P
     * @type {boolean}
     */
    paste?: boolean;
    /**
     * Escape
     * @type {boolean}
     */
    esc?: boolean;
    /**
     * Delete or Backspace
     * @type {boolean}
     */
    del?: boolean;
    /**
     * 复制对象时，是否应复制剪贴板上的对象选项
     * @type {boolean}
     */
    clipboard?: boolean;
    /**
     * Ctrl + Z, Ctrl + Y
     * @type {boolean}
     */
    transaction?: boolean;
    /**
     * Plus, Minus
     *
     * @type {boolean}
     */
    zoom?: boolean;
    /**
     * Ctrl + X
     *
     * @type {boolean}
     */
    cut?: boolean;
    /**
     * 拖拽
     */
    grab?: boolean;
}

declare type InteractionMode =
    | 'selection'
    | 'grab'
    | 'polygon'
    | 'line'
    | 'arrow'
    | 'link'
    | 'crop';

declare interface FabricEvent<T extends any = Event> extends Omit<fabric.IEvent, 'e'> {
    e: T;
    target?: FabricObject;
    subTargets?: FabricObject[];
    button?: number;
    isClick?: boolean;
    pointer?: fabric.Point;
    absolutePointer?: fabric.Point;
    transform?: {
        corner: string;
        original: FabricObject;
        originX: string;
        originY: string;
        width: number;
    };
}

declare type FabricObjects = {
    [key: string]: {
        create: (...args: any) => FabricObject;
    };
};

declare interface CanvasOption extends fabric.ICanvasOptions {
    /**
     * Unique id of Canvas
     * @type {string}
     */
    id?: string;
}

declare type FabricObjectOption<T extends any = fabric.IObjectOptions> = T & {
    /**
     * Object id
     * @type {string}
     */
    id?: string;
    /**
     * Parent object id
     * @type {string}
     */
    parentId?: string;
    /**
     * Original opacity
     * @type {number}
     */
    originOpacity?: number;
    /**
     * Original top position
     * @type {number}
     */
    originTop?: number;
    /**
     * Original left position
     * @type {number}
     */
    originLeft?: number;
    /**
     * Original scale X
     * @type {number}
     */
    originScaleX?: number;
    /**
     * Original scale Y
     * @type {number}
     */
    originScaleY?: number;
    /**
     * Original angle
     * @type {number}
     */
    originAngle?: number;
    /**
     * Original fill color
     *
     * @type {(string | fabric.Pattern | fabric.Gradient)}
     */
    originFill?: string | fabric.Pattern | fabric.Gradient;
    /**
     * Original stroke color
     * @type {string}
     */
    originStroke?: string;
    /**
     * Original rotation
     *
     * @type {number}
     */
    originRotation?: number;
    /**
     * Object editable
     * @type {boolean}
     */
    editable?: boolean;
    /**
     * Object Super type
     * @type {string}
     */
    superType?: string;
    /**
     * @description
     * @type {string}
     */
    description?: string;
    /**
     * Animation property
     * @type {AnimationProperty}
     */
    animation?: AnimationProperty;
    /**
     * Anime instance
     * @type {anime.AnimeInstance}
     */
    anime?: anime.AnimeInstance;
    /**
     * Tooltip property
     * @type {TooltipProperty}
     */
    tooltip?: TooltipProperty;
    /**
     * Link property
     * @type {LinkProperty}
     */
    link?: LinkProperty;
    /**
     * Is running animation
     * @type {boolean}
     */
    animating?: boolean;
    /**
     * Object class
     * @type {string}
     */
    class?: string;
    /**
     * Is possible delete
     * @type {boolean}
     */
    deletable?: boolean;
    /**
     * Is enable double click
     * @type {boolean}
     */
    dblclick?: boolean;
    /**
     * Is possible clone
     * @type {boolean}
     */
    cloneable?: boolean;
    /**
     * Is locked object
     * @type {boolean}
     */
    locked?: boolean;
    /**
     * This property replaces "angle"
     *
     * @type {number}
     */
    rotation?: number;
    /**
     * Whether it can be clicked
     *
     * @type {boolean}
     */
    clickable?: boolean;
    [key: string]: any;
};

declare type FabricObject<T extends any = fabric.Object> = T & FabricObjectOption;

declare interface GridOption {
    /**
     * 是否编辑
     * @type {boolean}
     */
    enabled?: boolean;
    /**
     * 网格间隔
     * @type {number}
     */
    grid?: number;
    /**
     * 移动物体时，是否应调整网格间隔上的位置
     * @type {boolean}
     */
    snapToGrid?: boolean;
    /**
     * 网格线颜色
     * @type {string}
     */
    lineColor?: string;
    /**
     * 网格边框颜色
     * @type {string}
     */
    borderColor?: string;
}

declare interface GuidelineOption {
    /**
     * When have moved object, whether should show guideline
     * @type {boolean}
     */
    enabled?: boolean;
}

declare type TransactionType =
    | 'add'
    | 'remove'
    | 'moved'
    | 'scaled'
    | 'rotated'
    | 'skewed'
    | 'group'
    | 'ungroup'
    | 'paste'
    | 'bringForward'
    | 'bringToFront'
    | 'sendBackwards'
    | 'sendToBack'
    | 'redo'
    | 'undo';

declare interface TransactionTransform {
    scaleX?: number;
    scaleY?: number;
    skewX?: number;
    skewY?: number;
    angle?: number;
    left?: number;
    top?: number;
    flipX?: number;
    flipY?: number;
    originX?: string;
    originY?: string;
}

declare interface TransactionEvent {
    json: string;
    type: TransactionType;
}

declare type FILTER_TYPES =
    | 'grayscale'
    | 'invert'
    | 'remove-color'
    | 'sepia'
    | 'brownie'
    | 'brightness'
    | 'contrast'
    | 'saturation'
    | 'noise'
    | 'vintage'
    | 'pixelate'
    | 'blur'
    | 'sharpen'
    | 'emboss'
    | 'technicolor'
    | 'polaroid'
    | 'blend-color'
    | 'gamma'
    | 'kodachrome'
    | 'blackwhite'
    | 'blend-image'
    | 'hue'
    | 'resize'
    | 'tint'
    | 'mask'
    | 'multiply'
    | 'sepia2';

declare interface IFilter {
    type: FILTER_TYPES;
    [key: string]: any;
}

declare type FabricImage = FabricObject &
    fabric.Image & {
        /**
         * Image URL
         * @type {string}
         */
        src?: string;
        /**
         * Image File or Blob
         * @type {File}
         */
        file?: File;
        /**
         * Image Filter
         * @type {IFilter[]}
         */
        filters?: IFilter[];
        _element?: any;
    };

declare interface FabricElement extends FabricObject<fabric.Rect> {
    /**
     * Wrapped Element
     * @type {HTMLDivElement}
     */
    container: HTMLDivElement;
    /**
     * Target Element
     * @type {HTMLDivElement}
     */
    element: HTMLDivElement;
    /**
     * Source of Element Object
     */
    setSource: (source: any) => void;
}

declare type WorkareaLayout = 'fixed' | 'responsive' | 'fullscreen';

declare interface WorkareaOption {
    /**
     * Image URL
     * @type {string}
     */
    src?: string;
    /**
     * Image File or Blbo
     * @type {File}
     */
    file?: File;
    /**
     * Workarea Width
     * @type {number}
     */
    width?: number;
    /**
     * Workarea Height
     * @type {number}
     */
    height?: number;
    /**
     * Workarea Background Color
     * @type {string}
     */
    backgroundColor?: string;
    /**
     * Workarea Layout Type
     * @type {WorkareaLayout}
     */
    layout?: WorkareaLayout;
}

declare type WorkareaObject = FabricImage & {
    /**
     * Workarea Layout Type
     * @type {WorkareaLayout}
     */
    layout?: WorkareaLayout;
    /**
     * Workarea Image Element
     * @type {HTMLImageElement}
     */
    _element?: HTMLImageElement;
    /**
     * Whether exist the element
     * @type {boolean}
     */
    isElement?: boolean;
    /**
     * Stored width in workarea
     * @type {number}
     */
    workareaWidth?: number;
    /**
     * Stored height in workarea
     * @type {number}
     */
    workareaHeight?: number;
};
