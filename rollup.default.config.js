/**
 * @author syt123450 / https://github.com/syt123450
 * @author botime / https://github.com/botime
 */

import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

const terserOptions = {

	output: {

		ecma: 5,
		preamble: '// https://github.com/tensorspace-team/tensorspace/blob/master/LICENSE'

	}

};

const defaultConfig = ( outputDir, createSourceMap = true ) => {

	let devExternal = [ 'three', '@tweenjs/tween.js', '@tensorflow/tfjs' ];
	let devInput = 'src/tensorspace.dev.js';

	let external = [ 'three', '@tweenjs/tween.js', '@tensorflow/tfjs', 'three-trackballcontrols', 'stats-js' ];
	let input = 'src/tensorspace.js';

	let globals = {
		'three': 'THREE',
		'@tweenjs/tween.js': 'TWEEN',
		'@tensorflow/tfjs': 'tf',
		'tensorspace': 'TSP',
		'stats-js': 'Stats',
		'three-trackballcontrols': 'THREE.TrackballControls'
	};
	let moduleName = 'TSP';

	let config = [

		{

			external: external,
			input: input,
			plugins: [ terser( terserOptions ) ],
			output: [ {
				// Build for browser, minified version
				globals: globals,
				format: 'iife',
				file: `${outputDir}/tensorspace.min.js`,
				name: moduleName,
				sourcemap: createSourceMap

			} ]

		},

		{

			external: external,
			input: input,
			output: [ {
				// Build for browser
				globals: globals,
				format: 'iife',
				file: `${outputDir}/tensorspace.js`,
				name: moduleName,
				sourcemap: createSourceMap

			}, {
				// Build for node.js
				format: 'cjs',
				file: `${outputDir}/tensorspace.cjs.js`,
				name: moduleName

			} ]

		},
		{

			external: devExternal,
			input: devInput,
			plugins: [
				
				nodeResolve({
					jsnext: true,
					main: true,
					browser: true,
				}),

				commonjs(),

			],
			output: {

				// Build for dev
				format: 'esm',
				file: `${outputDir}/tensorspace.dev.esm.js`,
				name: moduleName

			}

		}

	];

	return config;

};

export { defaultConfig };
