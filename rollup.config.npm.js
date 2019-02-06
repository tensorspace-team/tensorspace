/**
 * @author botime / https://github.com/botime
 */

import { terser } from 'rollup-plugin-terser';

let terserOptions = {

	output: {

		ecma: 5,
		preamble: '// https://github.com/tensorspace-team/tensorspace/blob/master/LICENSE'

	}

};

export default [

	// Build regular version for development
	{
		external: [ 'three', '@tweenjs/tween.js', '@tensorflow/tfjs', 'three-trackballcontrols', 'stats-js' ],
		input: 'src/tensorspace.js',
		output: [ {
			globals: {
				'three': 'THREE',
				'@tweenjs/tween.js': 'TWEEN',
				'@tensorflow/tfjs': 'tf',
				'tensorspace': 'TSP',
				'stats-js': 'Stats',
				'three-trackballcontrols': 'THREE.TrackballControls'
			},
			format: 'iife',
			file: 'dist/tensorspace.js',
			name: 'TSP',
			sourcemap: true

		}, {

			format: 'cjs',
			file: 'dist/tensorspace.cjs.js',
			name: 'TSP',
			sourcemap: true

		} ]

	},

	// // Build regular version for development
	// {
	//
	// 	input: 'src/tensorspace.dev.js',
	// 	output: [ {
	//
	// 		format: 'esm',
	// 		file: 'build/tensorspace.dev.esm.js',
	// 		name: "TSP",
	// 		sourcemap: true
	//
	// 	} ]
	//
	// },
	//
	//   // Build minified version for distribution
	//   {
	//
	//       input: 'src/tensorspace.js',
	//       plugins: [ terser( terserOptions ) ],
	//       output: [ {
	//
	//           format: 'iife',
	//           file: 'dist/tensorspace.min.js',
	//           name: "TSP",
	//           sourcemap: true,
	//
	//       } ]
	//
	//   }

];
