/**
 * Created by ss on 2018/6/25.
 */

 /**
  * Created by ss on 2018/01/06.
  */
 import { terser } from "rollup-plugin-terser";

 let terserOptions = {
     output: {
         ecma: 5,
         preamble: '// https://github.com/tensorspace-team/tensorspace/blob/master/LICENSE',
     },
 }

 export default [
     // Build regular version for development
     {
         input: 'src/tensorspace.js',
         output: [
             {
                 format: 'iife',
                 file: 'build/tensorspace.js',
                 name: "TSP",
                 sourcemap: true,
             }
         ],
     },
     // Build minified version for development
     {
         input: 'src/tensorspace.js',
         plugins: [terser(terserOptions)],
         output: [
             {
                 format: 'iife',
                 file: 'build/tensorspace.min.js',
                 name: "TSP",
                 sourcemap: true,
             }
         ],
     },
 ]
