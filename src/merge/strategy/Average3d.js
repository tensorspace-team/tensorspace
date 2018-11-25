/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge3d } from "../abstract/StableMerge3d";

function Average3d( mergedElements ) {

	StableMerge3d.call( this, mergedElements );

	this.strategyType = "Average3d";

}

Average3d.prototype = Object.assign( Object.create( StableMerge3d.prototype ) );

export { Average3d };