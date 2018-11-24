/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge3d } from "./StableMerge3d";

function Subtract3d( mergedElements ) {

	StableMerge3d.call( this, mergedElements );

	this.strategyType = "Subtract3d";

}

Subtract3d.prototype = Object.assign( Object.create( StableMerge3d.prototype ) );

export { Subtract3d };