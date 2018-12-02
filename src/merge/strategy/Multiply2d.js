/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge2d } from "../abstract/StableMerge2d";

/**
 * Multiply2d, can be initialized by StrategyFactory directly.
 * MergeStrategy for MergedLayer when apply Multiply operation to 2d TensorSpace layers.
 *
 * For example:
 * ```javascript
 * let conv1d1 = new TSP.layers.Conv1d( { ...config } );
 * let conv1d2 = new TSP.layers.Conv1d( { ...config } );
 * let multiplyLayer = TSP.layers.Multiply( [ conv1d1, conv1d2 ], { ...config } );
 * ```
 * In this example, the merged layer "multiplyLayer" apply merge strategy "Multiply2d".
 *
 * @param mergedElements, array of TensorSpace layers. (layerList.length > 0)
 * @constructor
 */

function Multiply2d( mergedElements ) {

	// Multiply2d inherits from abstract strategy "StableMerge2d".
	
	StableMerge2d.call( this, mergedElements );

	this.strategyType = "Multiply2d";

}

Multiply2d.prototype = Object.assign( Object.create( StableMerge2d.prototype ) );

export { Multiply2d };