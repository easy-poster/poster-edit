import { defineConfig } from '@umijs/max';

export default defineConfig({
    targets: {
        chrome: 80,
        firefox: 45,
        safari: 10,
    },
    jsMinifier: 'terser',
    cssMinifier: 'cssnano',
    extraBabelPlugins: ['transform-remove-console'],
});
