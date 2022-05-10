import { defineConfig } from 'umi';
import routes from './routes';
import theme from './theme';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dva: {
    immer: true,
    hmr: true,
    lazyLoad: true,
  },
  theme,
  // mfsu: {},
  routes: routes,
  fastRefresh: {},
  dynamicImport: {},
  dynamicImportSyntax: {},
});
