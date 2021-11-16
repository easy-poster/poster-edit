import { createFromIconfontCN } from '@ant-design/icons';

// 展示页菜单
export const MENU_LAYOUT = [
  {
    name: '首页',
    id: 1,
    icon: 'icon-home',
    route: '/',
  },
  {
    name: '我的设计',
    id: 2,
    icon: 'icon-haibaozujian',
    route: '/myproject',
  },
  {
    name: '品牌',
    id: 3,
    icon: 'icon-pinpai',
    route: '/brand',
  },
  {
    name: '模板库',
    id: 4,
    icon: 'icon-zaixianmoban',
    route: '/template',
  },
];

// 编辑页菜单
export const MENU_EDIT = [
  {
    name: '上传',
    id: 1,
    icon: 'icon-icon_tianjia',
    actIcon: 'icon-tianjiatianchong',
    route: '/',
  },
  {
    name: '图片',
    id: 2,
    icon: 'icon-haibaozujian',
    route: '/myproject',
  },
  {
    name: '素材',
    id: 3,
    icon: 'icon-sucaiku-1',
    route: '/brand',
  },
  {
    name: '文字',
    id: 4,
    icon: 'icon-wenzi',
    route: '/template',
  },
  {
    name: '背景',
    id: 5,
    icon: 'icon-background',
    route: '/template',
  },
];

export const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_2919693_1lnlh2hn349.js', // icon-home icon-haibaozujian icon-pinpai icon-moban icon-shezhi
  ],
});
