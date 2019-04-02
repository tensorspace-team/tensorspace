/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeProxy } from './proxy/MergeProxy';

/**
 * Exported as a Factory method for TensorSpace user to use.
 * Performs element-wise multiply on an array of layers, return an "multiplyLayer" which is a TensorSpace layer object.
 * The "multiplyLayer" will have the same "outputShape" as layers in "layerList".
 * All layers in "layerList" must have the same layer dimension.
 *
 * This method can be used to perform multiply operation on 3d layers.
 * In this case, the returned "multiplyLayer" is a 3 dimension Layer.
 * For example:
 * ```javascript
 * let conv2d1 = new TSP.layers.Conv2d( { ...config } );
 * let conv2d2 = new TSP.layers.Conv2d( { ...config } );
 * let multiplyLayer = TSP.layers.Multiply( [ conv2d1, conv2d2 ], { ...config } );
 * // print "3" in console
 * console.log( multiplyLayer.outputShape.length );
 * ```
 *
 * This method can be used to perform multiply operation on 2d layers.
 * In this case, the returned "multiplyLayer" is a 2 dimension Layer.
 * For example:
 * ```javascript
 * let conv1d1 = new TSP.layers.Conv1d( { ...config } );
 * let conv1d2 = new TSP.layers.Conv1d( { ...config } );
 * let multiplyLayer = TSP.layers.Multiply( [ conv1d1, conv1d2 ], { ...config } );
 * // print "2" in console
 * console.log( multiplyLayer.outputShape.length );
 * ```
 *
 * This method can be used to perform multiply operation on 1d layers.
 * In this case, the returned "multiplyLayer" is an 1 dimension Layer.
 * For example:
 * ```javascript
 * let dense1 = new TSP.layers.Dense( { ...config } );
 * let dense2 = new TSP.layers.Dense( { ...config } );
 * let multiplyLayer = TSP.layers.Multiply( [ dense1, dense2 ], { ...config } );
 * // print "1" in console
 * console.log( multiplyLayer.outputShape.length );
 * ```
 *
 * @param layerList, array of TensorSpace layers. (layerList.length > 0)
 * @param config, user's config for multiply function
 * @constructor
 */

function Multiply( layerList, config ) {

	let operatorType = "multiply";
	
	// Create a merged Layer proxy, the actual layer in proxy based on input layer list and config for multiply operation.

	let multiplyLayer = new MergeProxy( operatorType, layerList, config );

	return multiplyLayer;

}

export { Multiply };