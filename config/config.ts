import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // mfsu: {},
  routes: routes,
  fastRefresh: {},
  dynamicImport: {},
  dynamicImportSyntax: {},
});
