/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeValidator } from "../utils/MergeValidator";
import { MergedLayerFactory } from "./factory/MergedLayerFactory";

/**
 * Exported as a Factory method for TensorSpace user to use.
 * Performs element-wise subtract on an array of layers, return an "subtractLayer" which is a TensorSpace layer object.
 * The "subtractLayer" will have the same "outputShape" as layers in "layerList".
 * All layers in "layerList" must have the same layer dimension.
 *
 * This method can be used to perform subtract operation on 3d layers.
 * In this case, the returned "subtractLayer" is a 3 dimension Layer.
 * For example:
 * ```javascript
 * let conv2d1 = new TSP.layers.Conv2d( { ...config } );
 * let conv2d2 = new TSP.layers.Conv2d( { ...config } );
 * let subtractLayer = TSP.layers.Subtract( [ conv2d1, conv2d2 ], { ...config } );
 * // print "3" in console
 * console.log( subtractLayer.outputShape.length );
 * ```
 *
 * This method can be used to perform subtract operation on 2d layers.
 * In this case, the returned "subtractLayer" is a 2 dimension Layer.
 * For example:
 * ```javascript
 * let conv1d1 = new TSP.layers.Conv1d( { ...config } );
 * let conv1d2 = new TSP.layers.Conv1d( { ...config } );
 * let subtractLayer = TSP.layers.Subtract( [ conv1d1, conv1d2 ], { ...config } );
 * // print "2" in console
 * console.log( subtractLayer.outputShape.length );
 * ```
 *
 * This method can be used to perform subtract operation on 1d layers.
 * In this case, the returned "subtractLayer" is an 1 dimension Layer.
 * For example:
 * ```javascript
 * let dense1 = new TSP.layers.Dense( { ...config } );
 * let dense2 = new TSP.layers.Dense( { ...config } );
 * let subtractLayer = TSP.layers.Subtract( [ dense1, dense2 ], { ...config } );
 * // print "1" in console
 * console.log( subtractLayer.outputShape.length );
 * ```
 *
 * @param layerList, array of TensorSpace layers. (layerList.length > 0)
 * @param config, user's config for subtract function
 * @constructor
 */

function Subtract( layerList, config ) {

	let operatorType = "subtract";

	// make sure the input elements have the same dimension.

	MergeValidator.validateDimension( layerList );

	// MergedLayerFactory create a merged Layer based on input layer list and config for subtract operation.

	let subtractLayer = MergedLayerFactory.createMergedLayer( operatorType, layerList, config );

	return subtractLayer;

}

export { Subtract };