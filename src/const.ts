import { createFromIconfontCN } from '@ant-design/icons';

// 展示页菜单
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
  {
    name: '模板库',
    id: 3,
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
    name: '图形',
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
    '//at.alicdn.com/t/font_2919693_z5laxqknl3.js', // icon-home icon-haibaozujian icon-pinpai icon-moban icon-shezhi
  ],
});
