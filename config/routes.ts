export default [
    {
        path: '/',
        component: '@/layouts/index',
        layout: false,
        routes: [
            { path: '/', component: '@/pages/Home' },
            { path: '/user', component: '@/pages/User' },
            {
                path: '/brand',
                component: '@/pages/Brand',
                routes: [
                    { path: '/brand', redirect: '/brand/kit' },
                    { path: '/brand/kit', component: '@/pages/Brand/Kit' },
                    { path: '/brand/:id', component: '@/pages/Brand/Detail' },
                ],
            },
            { path: '/template', component: '@/pages/Template' },
            { path: '/search', component: '@/pages/Search' },
            { path: '/trash', component: '@/pages/Trash' },
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
    {
        path: '/setting',
        component: '@/pages/Setting/_layouts',
        layout: false,
        routes: [
            { path: '/setting', redirect: '/setting/account' },
            { path: '/setting/account', component: '@/pages/Setting/Account' },
            { path: '/setting/Secure', component: '@/pages/Setting/Secure' },
            { path: '/setting/bill', component: '@/pages/Setting/Bill' },
        ],
    },
    { path: '/*', component: '@/pages/404' },
];
