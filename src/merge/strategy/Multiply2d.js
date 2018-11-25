/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge2d } from "../abstract/StableMerge2d";

function Multiply2d( mergedElements ) {

	StableMerge2d.call( this, mergedElements );

	this.strategyType = "Multiply2d";

}

Multiply2d.prototype = Object.assign( Object.create( StableMerge2d.prototype ) );

export { Multiply2d };