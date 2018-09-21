/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge3d } from "./StableMerge3d";

function Add3d( mergedElements ) {

	StableMerge3d.call( this, mergedElements );

	this.strategyType = "add3d";

}

Add3d.prototype = Object.assign( Object.create( StableMerge3d.prototype ) );

export { Add3d };