import path from 'path';

import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import alias from 'rollup-plugin-alias';

export default {
    input: 'src/index.js',
    output: {
        file: 'build/index.js',
        format: 'umd'
    },
    plugins: [
        babel(),
        builtins(),
        commonjs(),
        resolve({
            jsnext: true,
            main: true,
            browser: true
        }),
        alias({
            '@': path.resolve(__dirname, 'src')
        })
    ]
};
