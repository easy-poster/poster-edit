export default [
    {
        path: '/',
        component: '@/layouts/index',
        layout: false,
        routes: [{ path: '/', component: '@/pages/Home' }],
    },
    {
        path: '/edit',
        component: '@/pages/Edit/_layouts',
        exact: true,
        layout: false,
        routes: [{ path: '/edit/:id', component: '@/pages/Edit' }],
    },
    { path: '/*', component: '@/pages/404' },
];
