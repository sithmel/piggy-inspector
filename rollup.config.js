import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/index.js',
  format: 'iife',
  plugins: [ resolve(), commonjs() ],
  dest: 'docs/bundle.js'
};
