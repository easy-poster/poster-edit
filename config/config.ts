import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: routes,
  fastRefresh: {},
  mfsu: {},
  extraPostCSSPlugins: [
    require('postcss-import'),
    require('tailwindcss')({
      config: './tailwind.config.js',
    }),
    require('postcss-nested'),
  ],
});
