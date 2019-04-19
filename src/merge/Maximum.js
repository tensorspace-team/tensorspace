/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeProxy } from './proxy/MergeProxy';

/**
 * Exported as a Factory method for TensorSpace user to use.
 * Performs element-wise maximum on an array of layers, return an "maximumLayer" which is a TensorSpace layer object.
 * The "maximumLayer" will have the same "outputShape" as layers in "layerList".
 * All layers in "layerList" must have the same layer dimension.
 *
 * This method can be used to perform maximum operation on 3d layers.
 * In this case, the returned "maximumLayer" is a 3 dimension Layer.
 * For example:
 * ```javascript
 * let conv2d1 = new TSP.layers.Conv2d( { ...config } );
 * let conv2d2 = new TSP.layers.Conv2d( { ...config } );
 * let maximumLayer = TSP.layers.Maximum( [ conv2d1, conv2d2 ], { ...config } );
 * // print "3" in console
 * console.log( maximumLayer.outputShape.length );
 * ```
 *
 * This method can be used to perform maximum operation on 2d layers.
 * In this case, the returned "maximumLayer" is a 2 dimension Layer.
 * For example:
 * ```javascript
 * let conv1d1 = new TSP.layers.Conv1d( { ...config } );
 * let conv1d2 = new TSP.layers.Conv1d( { ...config } );
 * let maximumLayer = TSP.layers.Maximum( [ conv1d1, conv1d2 ], { ...config } );
 * // print "2" in console
 * console.log( maximumLayer.outputShape.length );
 * ```
 *
 * This method can be used to perform maximum operation on 1d layers.
 * In this case, the returned "maximumLayer" is an 1 dimension Layer.
 * For example:
 * ```javascript
 * let dense1 = new TSP.layers.Dense( { ...config } );
 * let dense2 = new TSP.layers.Dense( { ...config } );
 * let maximumLayer = TSP.layers.Maximum( [ dense1, dense2 ], { ...config } );
 * // print "1" in console
 * console.log( maximumLayer.outputShape.length );
 * ```
 *
 * @param layerList, array of TensorSpace layers. (layerList.length > 0)
 * @param config, user's config for maximum function
 * @constructor
 */

function Maximum( layerList, config ) {

	let operatorType = "maximum";
	
	// Create a merged Layer proxy, the actual layer in proxy based on input layer list and config for maximum operation.

	let maximumLayer = new MergeProxy( operatorType, layerList, config );

	return maximumLayer;

}

export { Maximum };