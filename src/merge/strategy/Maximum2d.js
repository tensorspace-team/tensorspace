/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge2d } from "../abstract/StableMerge2d";

/**
 * Maximum2d, can be initialized by StrategyFactory directly.
 * MergeStrategy for MergedLayer when apply Maximum operation to 2d TensorSpace layers.
 *
 * For example:
 * ```javascript
 * let conv1d1 = new TSP.layers.Conv1d( { ...config } );
 * let conv1d2 = new TSP.layers.Conv1d( { ...config } );
 * let maximumLayer = TSP.layers.Maximum( [ conv1d1, conv1d2 ], { ...config } );
 * ```
 * In this example, the merged layer "maximumLayer" apply merge strategy "Maximum2d".
 *
 * @param mergedElements, array of TensorSpace layers. (layerList.length > 0)
 * @constructor
 */

function Maximum2d( mergedElements ) {

	// Maximum2d inherits from abstract strategy "StableMerge2d".
	
	StableMerge2d.call( this, mergedElements );

	this.strategyType = "Maximum2d";

}

Maximum2d.prototype = Object.assign( Object.create( StableMerge2d.prototype ) );

export { Maximum2d };