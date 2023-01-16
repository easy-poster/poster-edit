import { createFromIconfontCN } from '@ant-design/icons';

export type ItemTypeProps = 'IMAGE' | 'TEXT' | 'AUDIO' | 'LOGO';

// 画布最大最小值
export const MAX_SIZE = 400;
export const MIN_SIZE = 25;

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
    {
        name: '品牌',
        id: 2,
        icon: 'icon-pinpai',
        route: '/brand',
    },
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
export const MENU_EDIT = [
    {
        name: '上传',
        id: 1,
        icon: 'icon-icon_tianjia',
        actIcon: 'icon-tianjiatianchong',
        route: '/',
    },
    // {
    //   name: '图片',
    //   id: 2,
    //   icon: 'icon-haibaozujian',
    //   route: '/myproject',
    // },
    // {
    //   name: '图形',
    //   id: 3,
    //   icon: 'icon-sucaiku-1',
    //   route: '/brand',
    // },
    {
        name: '文字',
        id: 4,
        icon: 'icon-wenzi',
        route: '/template',
    },
    // {
    //   name: '背景',
    //   id: 5,
    //   icon: 'icon-background',
    //   route: '/template',
    // },
    // {
    //   name: '品牌',
    //   id: 6,
    //   icon: 'icon-pinpai',
    //   route: '/template',
    // },
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

export const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/c/font_2919693_4pddohngwzk.js', // icon-home icon-haibaozujian icon-pinpai icon-moban icon-shezhi
    ],
});
