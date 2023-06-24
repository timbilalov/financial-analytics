// import svelte from 'rollup-plugin-svelte';
// import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';
import path from 'path';
// import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

import express from "express"

const projectRootDir = path.resolve(__dirname);

export const rollupConfigApi = {
    // input: 'src/frontend/main.ts',
    input: `src/api/main.ts`,
    output: {
        sourcemap: true,
        // format: 'iife',
        // format: 'umd',
        format: 'cjs',
        name: 'app',
        file: 'public/api/app.js',
        // globals: {
        //     'express': 'express',
        //     // 'express': express,
        //     // 'react-dom': 'ReactDOM',
        //     // 'prop-types': 'PropTypes'
        // },
    },
    plugins: [
    	// svelte({
    	// 	preprocess: autoPreprocess(),
    	// 	// enable run-time checks when not in production
    	// 	dev: !production,
    	// 	// we'll extract any component CSS out into
    	// 	// a separate file - better for performance
    	// 	css: css => {
    	// 		css.write('bundle.css');
    	// 	},
    	// }),

    	// TODO: Подумать, как тут лучше оставить.
    	typescript({
    		// sourceMap: !production,
    		// inlineSources: !production,
    		sourceMap: true,
    		inlineSources: true,
            tsconfig: './src/api/tsconfig.json',
    	}),

    	// If you have external dependencies installed from
    	// npm, you'll most likely need these plugins. In
    	// some cases you'll need additional configuration -
    	// consult the documentation for details:
    	// https://github.com/rollup/plugins/tree/master/packages/commonjs
    	// resolve({
    	// 	browser: true,
    	// 	dedupe: ['svelte'],
    	// }),

    	alias({
    		entries: {
    			// '@constants': path.resolve(projectRootDir, './src/constants'),
    			// '@utils': path.resolve(projectRootDir, './src/utils'),
    			// '@helpers': path.resolve(projectRootDir, './src/helpers.ts'),
    			// '@presentation': path.resolve(projectRootDir, './src/presentation'),
    			// '@data': path.resolve(projectRootDir, './src/data'),
    			// '@fetch': path.resolve(projectRootDir, './src/data/fetch'),
    			// '@parse': path.resolve(projectRootDir, './src/data/parse'),
    			// '@app': path.resolve(projectRootDir, './src/app'),
    			// '@components': path.resolve(projectRootDir, './src/app/components'),
    			// '@containers': path.resolve(projectRootDir, './src/app/containers'),
    			// '@store': path.resolve(projectRootDir, './src/store'),

					'@common': path.resolve(projectRootDir, './src/'),
    		},
    	}),

    	// commonjs({
        //     // include: 'node_modules',
        //     include: 'node_modules/**',
        // }),

    	// // In dev mode, call `npm run start` once
    	// // the bundle has been generated
    	// !production && serve(),
    	//
    	// // Watch the `public` directory and refresh the
    	// // browser on changes when not in production
    	// !production && livereload('public'),
    	//
    	// // If we're building for production (npm run build
    	// // instead of npm run dev), minify
    	// production && terser(),
    ],
    watch: {
    	clearScreen: false,
    },
    external: ['express'],
};
