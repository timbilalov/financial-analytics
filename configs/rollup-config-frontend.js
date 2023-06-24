// import svelte from 'rollup-plugin-svelte';
import svelte from 'rollup-plugin-svelte-hot';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';
import path from 'path';
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only'
import hmr from 'rollup-plugin-hot'

// const svelteHmr = require('rollup-plugin-svelte-hmr');

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
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            // server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
            server = require('child_process').spawn('npm', ['run', 'frontend:assets', '--', '--dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true,
            });

            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        },
    };
}

const isHot = true;

export const rollupConfigFrontend = [
	{
		input: 'src/frontend/main.ts',
		output: {
			dir: 'public/build',
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: 'public/build/bundle.js',
			// file: 'bundle.js',
		},
		plugins: [
			svelte({
				// hot: true,
				// hot: {
        // // Prevent preserving local component state
				// 	noPreserveState: false,
				// 	// Prevent doing a full reload on next HMR update after fatal error
				// 	noReload: false,
				// 	// Try to recover after runtime errors in component init
				// 	optimistic: false
				// },
				preprocess: autoPreprocess(),
				// enable run-time checks when not in production
				// dev: !production,
				// // we'll extract any component CSS out into
				// // a separate file - better for performance
				// css: css => {
				// 	css.write('bundle.css');
				// },

				hot: isHot && {
					// Optimistic will try to recover from runtime
					// errors during component init
					optimistic: true,
					// Turn on to disable preservation of local component
					// state -- i.e. non exported `let` variables
					noPreserveState: false,

					// See docs of rollup-plugin-svelte-hot for all available options:
					//
					// https://github.com/rixo/rollup-plugin-svelte-hot#usage
				},
			}),

			// svelte(),

			// svelteHmr({
			// 	// hot: !production,
			// 	hot: true,
			// }),

			css({ output: 'bundle.css' }),

			// TODO: Подумать, как тут лучше оставить.
			typescript({
				// sourceMap: !production,
				// inlineSources: !production,
				sourceMap: true,
				inlineSources: true,
				tsconfig: './src/frontend/tsconfig.json',
			}),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte'],
			}),

			alias({
				entries: {
					'@constants': path.resolve(projectRootDir, './src/frontend/constants'),
					'@utils': path.resolve(projectRootDir, './src/frontend/utils'),
					'@helpers': path.resolve(projectRootDir, './src/frontend/helpers.ts'),
					'@presentation': path.resolve(projectRootDir, './src/frontend/presentation'),
					'@data': path.resolve(projectRootDir, './src/frontend/data'),
					'@fetch': path.resolve(projectRootDir, './src/frontend/data/fetch'),
					'@parse': path.resolve(projectRootDir, './src/frontend/data/parse'),
					'@app': path.resolve(projectRootDir, './src/frontend/app'),
					'@components': path.resolve(projectRootDir, './src/frontend/app/components'),
					'@containers': path.resolve(projectRootDir, './src/frontend/app/containers'),
					'@store': path.resolve(projectRootDir, './src/frontend/store'),
					'@common': path.resolve(projectRootDir, './src/'),
				},
			}),

			commonjs(),

			// In dev mode, call `npm run start` once
			// the bundle has been generated
			// !production && serve(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			// !production && livereload('public'),

			// !production && livereload({
			// 	watch: "public/build",
			// 	// delay: 200
			// }),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(),

			hmr({
				public: 'public',
				inMemory: true,

				// Default host for the HMR server is localhost, change this option if
				// you want to serve over the network
				// host: '0.0.0.0',
				// You can also change the default HMR server port, if you fancy
				// port: '12345'

				// This is needed, otherwise Terser (in npm run build) chokes
				// on import.meta. With this option, the plugin will replace
				// import.meta.hot in your code with module.hot, and will do
				// nothing else.
				compatModuleHot: !isHot,
			}),
		],
		watch: {
			clearScreen: false,
		},
	},
	// Server bundle
	// {
	// 	input: "src/frontend/app/App.svelte",
	// 	output: {
	// 		exports: "default",
	// 		sourcemap: false,
	// 		format: "cjs",
	// 		name: "app",
	// 		file: "public/App.js",
	// 		external: [
	// 			'@containers/chart/Chart.svelte',
	// 		],
	// 	},
	// 	plugins: [
	// 		svelte({
	// 			// compilerOptions: {
	// 			// 	generate: "ssr"
	// 			// }
	// 			compilerOptions: {
	//
	// 				// By default, the client-side compiler is used. You
	// 				// can also use the server-side rendering compiler
	// 				generate: 'ssr',
	//
	// 				// // ensure that extra attributes are added to head
	// 				// // elements for hydration (used with generate: 'ssr')
	// 				// hydratable: true,
	// 				//
	// 				// // You can optionally set 'customElement' to 'true' to compile
	// 				// // your components to custom elements (aka web elements)
	// 				// customElement: false
	// 			}
	// 		}),
	// 		resolve(),
	// 		commonjs(),
	// 		production && terser()
	// 	]
	// },
];
