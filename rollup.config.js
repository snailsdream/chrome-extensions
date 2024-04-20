// rollup.config.js
import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import strip from '@rollup/plugin-strip';
import json from '@rollup/plugin-json';
export default defineConfig(
    [
        {
            input: {
                content:  'src/chrome/content/index.ts',
            },
            output: {
                dir: 'dist/js',
                format: 'iife',
            },
            plugins: [
                json(),
                nodeResolve(),
                typescript({
                    sourceMap: false
                }),
                commonjs(),
                strip({
                    labels: ['unittest']
                }),
                terser()
            ]
        },
        {
            input: {
                background:  'src/chrome/background/index.ts',
            },
            output: {
                dir: 'dist/js',
                format: 'es',
            },
            plugins: [
                json(),
                nodeResolve(),
                typescript({
                    sourceMap: false
                }),
                commonjs(),
                strip({
                    labels: ['unittest']
                }),
                terser()
            ]
        }
    ]
);