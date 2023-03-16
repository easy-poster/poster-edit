import { createFromIconfontCN } from '@ant-design/icons';

export type ItemTypeProps = 'IMAGE' | 'TEXT' | 'AUDIO' | 'LOGO';

// 画布最大最小值
export const MAX_SIZE = 400;
export const MIN_SIZE = 25;

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

export const ItemType = {
    IMAGE: 'IMAGE',
    TEXT: 'TEXT',
    AUDIO: 'AUDIO',
    LOGO: 'LOGO',
};

export const TextDefData = {
    id: '',
    name: '',
    type: 'TEXT',
    styles: '',
    rotation: 0,
    alpha: 1,
    zIndex: 0,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
};

/**
 * @name 展示页菜单
 */
export const MENU_LAYOUT = [
    {
        name: '主页',
        id: 1,
        icon: 'icon-home',
        route: '/',
    },
    // {
    //     name: '品牌',
    //     id: 2,
    //     icon: 'icon-pinpai',
    //     route: '/brand',
    // },
    // {
    //     name: '模板库',
    //     id: 3,
    //     icon: 'icon-zaixianmoban',
    //     route: '/template',
    // },
];

/**
 * @name 编辑页菜单配置
 */
export enum ResourcePageType {
    UPLOADPAGE = 'UPLOADPAGE',
    IMAGEPAGE = 'IMAGEPAGE',
    TEXTPAGE = 'TEXTPAGE',
    GRAPHICALPAGE = 'GRAPHICALPAGE',
    BACKGROUND = 'BACKGROUND',
}
export const MENU_EDIT = [
    {
        name: '上传',
        type: ResourcePageType.UPLOADPAGE,
        icon: 'icon-icon_tianjia',
        actIcon: 'icon-tianjiatianchong',
    },
    // {
    //     name: '图片',
    //     type: ResourcePageType.IMAGEPAGE,
    //     icon: 'icon-haibaozujian',
    // },
    {
        name: '文字',
        type: ResourcePageType.TEXTPAGE,
        icon: 'icon-wenzi',
    },
    // {
    //     name: '图形',
    //     type: ResourcePageType.GRAPHICALPAGE,
    //     icon: 'icon-tuxingchakan',
    // },
    {
        name: '背景',
        type: ResourcePageType.BACKGROUND,
        icon: 'icon-background',
    },
];

export const SETTING_MENU_LAYOUT = [
    {
        name: '个人账户',
        id: 1,
        icon: 'icon-zhanghao',
        route: '/setting/account',
    },
    {
        name: '登录 & 安全',
        id: 2,
        icon: 'icon-anquan',
        route: '/setting/secure',
    },
    {
        name: '账单',
        id: 3,
        icon: 'icon-zhangdanguanli',
        route: '/setting/bill',
    },
];

/**
 * 滤镜 17个
 */
export enum FILTER_CUSTOMIZE {
    /** @name 亮度*/
    brightness = 'brightness',
    /** @name 对比度 */
    contrast = 'contrast',
    /** @name 饱和度 */
    saturation = 'saturation',
    /** @name 色温 */
    temperature = 'temperature',
}

export enum FILTERTYPES {
    grayscale = 'grayscale',
    invert = 'invert',
    sepia = 'sepia',
    noise = 'noise',
    pixelate = 'pixelate',
    sharpen = 'sharpen',
    emboss = 'emboss',
    'blend-color' = 'blend-color',
    // 'blend-image' = 'blend-image',
    // resize = 'resize',
    // tint = 'tint',
    // mask = 'mask',
    // multiply = 'multiply',
    // sepia2 = 'sepia2',
}

export const ALLFILTERS = { ...FILTERTYPES, ...FILTER_CUSTOMIZE };

/**
 * @description 默认使用颜色
 */
export const DEFCOLOR = [
    '#000000',

    '#545454',

    '#737373',

    '#a6a6a6',

    '#d9d9d9',

    '#ffffff',

    '#ff3131',

    '#ff5757',

    '#ff66c4',

    '#cb6ce6',

    '#8c52ff',

    '#5e17eb',

    '#0097b2',

    '#0cc0df',

    '#5ce1e6',

    '#38b6ff',

    '#5271ff',

    '#004aad',

    '#00bf63',

    '#7ed957',

    '#c1ff72',

    '#ffde59',

    '#ffbd59',

    '#ff914d',

    '#f35900',
];

export const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/c/font_2919693_56lyhjyaq0k.js', // icon-home icon-haibaozujian icon-pinpai icon-moban icon-shezhi
    ],
});
