/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge3d } from "./StableMerge3d";

function Maximum3d( mergedElements ) {

	StableMerge3d.call( this, mergedElements );

	this.strategyType = "maximum3d";

}

Maximum3d.prototype = Object.assign( Object.create( StableMerge3d.prototype ) );

export { Maximum3d };