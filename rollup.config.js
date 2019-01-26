/**
 * @author syt123450 / https://github.com/syt123450
 * @author botime / https://github.com/botime
 */

import { terser } from "rollup-plugin-terser";

let terserOptions = {

    output: {

        ecma: 5,
        preamble: '// https://github.com/tensorspace-team/tensorspace/blob/master/LICENSE'

    }

};

export default [

    // Build regular version for development
    {

        input: 'src/tensorspace.js',
        output: [ {

            format: 'iife',
            file: 'build/tensorspace.js',
            name: "TSP",
            sourcemap: true

        } ]

    },

    // Build regular version for development
    {

        input: 'src/tensorspace.js',
        output: [ {

            format: 'esm',
            file: 'build/tensorspace.esm.js',
            name: "TSP",
            sourcemap: true

        } ]

    },

    // Build minified version for development
    {

        input: 'src/tensorspace.js',
        plugins: [ terser( terserOptions ) ],
        output: [ {

            format: 'iife',
            file: 'build/tensorspace.min.js',
            name: "TSP",
            sourcemap: true

        } ]

    }

]
