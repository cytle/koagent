import VuePlugin from 'rollup-plugin-vue'
import rollupTypescript from 'rollup-plugin-typescript';

export default {
  entry: 'routes.js',
  output: {
    format: 'esm',
    file: 'dist/pages.esm.js'
  },
  plugins: [
    VuePlugin(/* VuePluginOptions */),
    rollupTypescript({
      tsconfig: false,
      experimentalDecorators: true,
      module: 'es2015'
    }),
  ],
};
