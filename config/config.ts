import { defineConfig } from '@umijs/max';
import routes from './routes';
import theme from './theme';

export default defineConfig({
    npmClient: 'pnpm',
    fastRefresh: true,
    dva: {},
    theme,
    routes,
    antd: {},
    access: {},
    model: {},
    initialState: {},
    request: {},
    layout: false,
});
