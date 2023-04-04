import { defineConfig } from '@umijs/max';
import { resolve } from 'path';
import routes from './routes';
import theme from './theme';

const ENV = process.argv[3] || 'DEV';

const BASE = '/';

export default defineConfig({
    title: 'epsoter图片编辑器',
    metas: [
        { name: 'keywords', content: 'eposter 海报编辑器' },
        { name: 'description', content: 'eposter 是一个本地的海报编辑器' },
    ],
    favicons: ['./color.ico'],
    npmClient: 'pnpm',
    base: BASE,
    fastRefresh: true,
    define: {
        ENV,
    },
    dva: {
        immer: {},
    },
    targets: {
        chrome: 80,
        firefox: 45,
        safari: 10,
        edge: 13,
    },
    theme,
    routes,
    antd: {},
    model: {},
    access: {},
    initialState: {},
    layout: false,
    alias: {
        assets: resolve(__dirname, '../src/assets'),
    },
    analytics: {
        baidu: 'a0c3309375cc83c6e3dd1e376d1b1496',
    },
});
