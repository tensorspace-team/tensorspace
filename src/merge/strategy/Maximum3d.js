/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge3d } from "../abstract/StableMerge3d";

/**
 * Maximum3d, can be initialized by StrategyFactory directly.
 * MergeStrategy for MergedLayer when apply Maximum operation to 3d TensorSpace layers.
 *
 * For example:
 * ```javascript
 * let conv2d1 = new TSP.layers.Conv2d( { ...config } );
 * let conv2d2 = new TSP.layers.Conv2d( { ...config } );
 * let maximumLayer = TSP.layers.Maximum( [ conv2d1, conv2d2 ], { ...config } );
 * ```
 * In this example, the merged layer "maximumLayer" apply merge strategy "Maximum3d".
 *
 * @param mergedElements, array of TensorSpace layers. (layerList.length > 0)
 * @constructor
 */

function Maximum3d( mergedElements ) {

	// Maximum3d inherits from abstract strategy "StableMerge3d".
	
	StableMerge3d.call( this, mergedElements );

	this.strategyType = "Maximum3d";

}

Maximum3d.prototype = Object.assign( Object.create( StableMerge3d.prototype ) );

export { Maximum3d };