/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge1d } from "../abstract/StableMerge1d";

/**
 * Average1d, can be initialized by StrategyFactory directly.
 * MergeStrategy for MergedLayer when apply Average operation to 1d TensorSpace layers.
 *
 * For example:
 * ```javascript
 * let dense1 = new TSP.layers.Dense({ ...config });
 * let dense2 = new TSP.layers.Dense({ ...config });
 * let averageLayer = TSP.layers.Average([ dense1, dense2 ], { ...config });
 * ```
 * In this example, the merged layer "averageLayer" apply merge strategy "Average1d".
 *
 * @param mergedElements, array of TensorSpace layers. (layerList.length > 0)
 * @constructor
 */

function Average1d( mergedElements ) {

	// Average1d inherits from abstract strategy "StableMerge1d".
	
	StableMerge1d.call( this, mergedElements );

	this.strategyType = "Average1d";

}

Average1d.prototype = Object.assign( Object.create( StableMerge1d.prototype ) );

export { Average1d };