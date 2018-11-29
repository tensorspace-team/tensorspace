/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge1d } from "../abstract/StableMerge1d";

function Average1d( mergedElements ) {

	StableMerge1d.call( this, mergedElements );

	this.strategyType = "Average1d";

}

Average1d.prototype = Object.assign( Object.create( StableMerge1d.prototype ) );

export { Average1d };