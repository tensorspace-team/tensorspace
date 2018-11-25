/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge3d } from "../abstract/StableMerge3d";

function Maximum3d( mergedElements ) {

	StableMerge3d.call( this, mergedElements );

	this.strategyType = "Maximum3d";

}

Maximum3d.prototype = Object.assign( Object.create( StableMerge3d.prototype ) );

export { Maximum3d };