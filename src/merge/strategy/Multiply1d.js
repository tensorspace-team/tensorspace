/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge1d } from "../abstract/StableMerge1d";

/**
 * Multiply1d, can be initialized by StrategyFactory directly.
 * MergeStrategy for MergedLayer when apply Multiply operation to 1d TensorSpace layers.
 *
 * For example:
 * ```javascript
 * let dense1 = new TSP.layers.Dense({ ...config });
 * let dense2 = new TSP.layers.Dense({ ...config });
 * let multiplyLayer = TSP.layers.Multiply([ dense1, dense2 ], { ...config });
 * ```
 * In this example, the merged layer "multiplyLayer" apply merge strategy "Multiply1d".
 *
 * @param mergedElements, array of TensorSpace layers. (layerList.length > 0)
 * @constructor
 */

function Multiply1d( mergedElements ) {

	// Multiply1d inherits from abstract strategy "StableMerge1d".
	
	StableMerge1d.call( this, mergedElements );

	this.strategyType = "Multiply1d";

}

Multiply1d.prototype = Object.assign( Object.create( StableMerge1d.prototype ) );

export { Multiply1d };