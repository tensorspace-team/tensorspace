/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge1d } from "../abstract/StableMerge1d";

/**
 * Add1d, can be initialized by StrategyFactory directly.
 * MergeStrategy for MergedLayer when apply Add operation to 1d TensorSpace layers.
 *
 * For example:
 * ```javascript
 * let dense1 = new TSP.layers.Dense({ ...config });
 * let dense2 = new TSP.layers.Dense({ ...config });
 * let addLayer = TSP.layers.Add([ dense1, dense2 ], { ...config });
 * ```
 * In this example, the merged layer "addLayer" apply merge strategy "Add1d".
 *
 * @param mergedElements, array of TensorSpace layers. (layerList.length > 0)
 * @constructor
 */

function Add1d( mergedElements ) {

	// Add1d inherits from abstract strategy "StableMerge1d".

	StableMerge1d.call( this, mergedElements );

	this.strategyType = "Add1d";

}

Add1d.prototype = Object.assign( Object.create( StableMerge1d.prototype ) );

export { Add1d };