import VuePlugin from 'rollup-plugin-vue'
import rollupTypescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
  input: 'routes.js',
  output: {
    format: 'esm',
    file: 'dist/pages.esm.js'
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      only: [/^(?!(vuex?|axios))/],
    }),
    commonjs(),
    json(),
    VuePlugin(/* VuePluginOptions */),
    rollupTypescript({
      tsconfig: false,
      experimentalDecorators: true,
      module: 'es2015'
    }),
  ],
};
