/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge1d } from "../abstract/StableMerge1d";

/**
 * Maximum1d, can be initialized by StrategyFactory directly.
 * MergeStrategy for MergedLayer when apply Maximum operation to 1d TensorSpace layers.
 *
 * For example:
 * ```javascript
 * let dense1 = new TSP.layers.Dense({ ...config });
 * let dense2 = new TSP.layers.Dense({ ...config });
 * let maximumLayer = TSP.layers.Maximum([ dense1, dense2 ], { ...config });
 * ```
 * In this example, the merged layer "maximumLayer" apply merge strategy "Maximum1d".
 *
 * @param mergedElements, array of TensorSpace layers. (layerList.length > 0)
 * @constructor
 */

function Maximum1d( mergedElements ) {

	// Maximum1d inherits from abstract strategy "StableMerge1d".
	
	StableMerge1d.call( this, mergedElements );

	this.strategyType = "Maximum1d";

}

Maximum1d.prototype = Object.assign( Object.create( StableMerge1d.prototype ) );

export { Maximum1d };