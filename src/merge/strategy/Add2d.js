/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge2d } from "./StableMerge2d";

function Add2d( mergedElements ) {

	StableMerge2d.call( this, mergedElements );

	this.strategyType = "Add2d";

}

Add2d.prototype = Object.assign( Object.create( StableMerge2d.prototype ) );

export { Add2d };