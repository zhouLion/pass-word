// @ts-nocheck
import ts from 'rollup-plugin-typescript2'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';

export default {
  // 核心选项
  input: './src/index.ts',     // 必须
  plugins: [
    nodeResolve(),
    ts(),
    commonjs(),
  ],

  output: [
    {  // 必须 (如果要输出多个，可以是一个数组)
      // 核心选项
      // file: './umd/index.js',
      dir: './umd',
      format: 'umd',
      sourcemap: false,
      name: 'PasswordSchema'
    },
    {
      file: './umd/index.esm.js',
      format: 'esm',
    }
  ],
};
