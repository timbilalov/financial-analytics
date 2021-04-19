import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import alias from "@rollup/plugin-alias";
import path from 'path';
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;
const projectRootDir = path.resolve(__dirname);

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			preprocess: autoPreprocess(),
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
			}
		}),

		// TODO: Подумать, как тут лучше оставить.
		typescript({
			// sourceMap: !production,
			// inlineSources: !production,
			sourceMap: true,
			inlineSources: true,
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),

		alias({
			entries: {
				'@constants': path.resolve(projectRootDir, './src/constants'),
				'@utils': path.resolve(projectRootDir, './src/utils'),
				'@helpers': path.resolve(projectRootDir, './src/utils/helpers.js'),
				'@presentation': path.resolve(projectRootDir, './src/presentation'),
				'@data': path.resolve(projectRootDir, './src/data'),
				'@fetch': path.resolve(projectRootDir, './src/data/fetch'),
				'@parse': path.resolve(projectRootDir, './src/data/parse'),
				'@app': path.resolve(projectRootDir, './src/app'),
				'@components': path.resolve(projectRootDir, './src/app/components'),
				'@containers': path.resolve(projectRootDir, './src/app/containers'),
				'@store': path.resolve(projectRootDir, './src/store'),
			}
		}),

		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
