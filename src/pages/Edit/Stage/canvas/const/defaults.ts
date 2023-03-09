// import { WorkareaObject } from "typings";

import { FILTERTYPES } from '@/const';
import { IBaseFilter } from 'fabric/fabric-impl';

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
    GROUP = 'group',
    SVG = 'svg',
    VIDEO = 'video',
    CIRCLE = 'circle',
    POLYGON = 'polygon',
    RECT = 'rect',
    TRIANGLE = 'triangle',
    LINE = 'line',
}

/**
 * @description canvas画布默认配置
 */
export const canvasOption = {
    preserveObjectStacking: true, // 选中对象元素时保证层级不变动
    selection: true, // 是否能被选中
    defaultCursor: 'default', // 默认鼠标样式
    backgroundColor: '#1c1c26', // canvas背景色
    controlsAboveOverlay: true, //控制器显示最上层clipPath不会切掉边角控制器
    stopContextMenu: true, // 禁止默认右键菜单
};

/**
 * @description 键盘事件
 */
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
    width: 0,
    height: 0,
    lockScalingX: true,
    lockScalingY: true,
    scaleX: 1,
    scaleY: 1,
    absolutePositioned: true,
    fill: '#FFF',
    // backgroundColor: '#FFF',
    transparentCorners: false,
    hasBorders: false,
    hasControls: false,
    selectable: false,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: 'default',
    name: 'title',
    id: 'workarea', // 这个id很重要，查询画布唯一id不能与其他元素id相同
    type: FabricObjectType.RECT,
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
    locked: false,
};

export const guidelineOption = {
    enabled: true,
};

export const activeSelectionOption = {
    hasControls: true,
};

/**
 * @description 永久化属性
 */
export const propertiesToInclude = [
    'id',
    'name',
    'width',
    'height',
    'locked',
    'upperCase',
    'file',
    'src',
    'fontUrl',
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

export const defaultFilters: IFilter[] = [
    {
        type: FILTERTYPES.brightness,
        brightness: 0,
    },
    {
        type: FILTERTYPES.contrast,
        contrast: 0,
    },
    {
        type: FILTERTYPES.saturation,
        saturation: 0,
    },
];
