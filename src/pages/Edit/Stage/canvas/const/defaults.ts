// import { WorkareaObject } from "typings";

// 工作区类型
export enum WorkareaLayoutType {
    FIXED = 'fixed',
    RESPONSIVE = 'responsive',
    FULLSCREEN = 'fullscreen',
}

export enum InteractionModeType {
    /** @name 普通选中模式 */
    SELECTION = 'selection',
    /** @name 抓捕模式 */
    GRAB = 'grab',
    /** @name 多边形 */
    POLYGON = 'polygon',
    /** @name 线 */
    LINE = 'line',
    /** @name 箭头 */
    ARROW = 'arrow',
    /** @name 连接 */
    LINK = 'link',
    /** @name 图片裁剪模式 */
    CROP = 'crop',
}

export enum SuperType {
    DRAWING = 'drawing',
    NODE = 'node',
    ELEMENT = 'element',
    LINK = 'link',
    PORT = 'port',
    SVG = 'svg',
    IMAGE = 'image',
}

export enum CursorType {
    DEFAULT = 'default',
    POINTER = 'pointer',
    MOVE = 'move',
    GRAB = 'grab',
}

export enum FabricObjectType {
    IMAGE = 'image',
    ITEXT = 'i-text',
    TEXTBOX = 'textbox',
    SVG = 'svg',
    VIDEO = 'video',
    CIRCLE = 'circle',
    POLYGON = 'polygon',
    RECT = 'rect',
    TRIANGLE = 'triangle',
    LINE = 'line',
}

export const canvasOption = {
    preserveObjectStacking: true,
    selection: true,
    defaultCursor: 'default',
    backgroundColor: '#1c1c26',
    controlsAboveOverlay: true, //控制器显示最上层
};

export const keyEvent = {
    move: true,
    all: true,
    copy: true,
    paste: true,
    esc: true,
    del: true,
    clipboard: false,
    transaction: true,
    zoom: true,
    cut: true,
    grab: true,
};

export const gridOption = {
    enabled: false,
    grid: 10,
    snapToGrid: false,
    lineColor: '#ebebeb',
    borderColor: '#cccccc',
};

export const workareaOption: Partial<WorkareaObject> = {
    width: 600,
    height: 400,
    lockScalingX: true,
    lockScalingY: true,
    scaleX: 1,
    scaleY: 1,
    backgroundColor: '#fff',
    hasBorders: false,
    hasControls: false,
    selectable: false,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: 'default',
    name: 'title',
    id: 'workarea',
    type: 'image',
    layout: WorkareaLayoutType.FIXED, // fixed, responsive, fullscreen
    link: {},
    tooltip: {
        enabled: false,
    },
    isElement: false,
};

export const objectOption: Partial<FabricObjectOption> = {
    rotation: 0,
    centeredRotation: true,
    strokeUniform: true,
};

export const guidelineOption = {
    enabled: true,
};

export const activeSelectionOption = {
    hasControls: true,
};

export const propertiesToInclude = [
    'id',
    'name',
    'width',
    'height',
    'locked',
    'file',
    'src',
    'link',
    'tooltip',
    'animation',
    'layout',
    'videoLoadType',
    'autoplay',
    'shadow',
    'muted',
    'loop',
    'code',
    'icon',
    'userProperty',
    'trigger',
    'configuration',
    'superType',
    'points',
    'svg',
    'loadType',
];
