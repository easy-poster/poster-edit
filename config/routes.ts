import { defineConfig } from 'umi';

export default defineConfig([
  { path: '/login', component: '@/pages/Login' },
  {
    path: '/edit',
    component: '@/pages/Edit/_layouts',
    wrappers: ['@/wrappers/auth'],
    routes: [
      { path: '/edit/:id', exact: true, component: '@/pages/Edit' },
      { component: '@/pages/Edit/404' },
    ],
  },
  {
    path: '/',
    component: '@/layouts/index',
    wrappers: ['@/wrappers/auth'],
    routes: [
      { path: '/', component: '@/pages/Home' },
      { path: '/home', exact: true, rediract: '/' },
      { path: '/user', exact: true, component: '@/pages/User' },
      { path: '/brand', exact: true, component: '@/pages/Brand' },
      { path: '/template', exact: true, component: '@/pages/Template' },
      { path: '/search', exact: true, component: '@/pages/Search' },
      { path: '/setting', exact: true, component: '@/pages/Setting' },
      { component: '@/pages/404' },
    ],
  },
  { component: '@/pages/404' },
]);
