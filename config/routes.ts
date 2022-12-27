export default [
    {
        path: '/',
        component: '@/layouts/index',
        layout: false,
        routes: [
            { path: '/', component: '@/pages/Home' },
            { path: '/user', component: '@/pages/User' },
            { path: '/brand', component: '@/pages/Brand' },
            { path: '/template', component: '@/pages/Template' },
            { path: '/search', component: '@/pages/Search' },
            { path: '/setting', component: '@/pages/Setting' },
            { path: '/*', component: '@/pages/404' },
        ],
    },
    { path: '/login', component: '@/pages/Login', exact: true, layout: false },
    {
        path: '/edit',
        component: '@/pages/Edit/_layouts',
        exact: true,
        layout: false,
        routes: [{ path: '/edit/:id', component: '@/pages/Edit' }],
    },
    { path: '/*', component: '@/pages/404' },
];
