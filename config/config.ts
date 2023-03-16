import { defineConfig } from '@umijs/max';
import { resolve } from 'path';
import routes from './routes';
import theme from './theme';

const ENV = process.argv[3] || 'DEV';

const BASE = '/';

export default defineConfig({
    npmClient: 'pnpm',
    base: BASE,
    fastRefresh: true,
    define: {
        ENV,
    },
    dva: {
        immer: {},
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
});
