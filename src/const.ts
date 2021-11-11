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
    name: '我的海报',
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

export const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_2919693_ng6xieno0np.js', // icon-home icon-haibaozujian icon-pinpai icon-moban icon-shezhi
  ],
});
