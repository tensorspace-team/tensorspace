/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge1d } from "../abstract/StableMerge1d";

function Add1d( mergedElements ) {

	StableMerge1d.call( this, mergedElements );

	this.strategyType = "Add1d";

}

Add1d.prototype = Object.assign( Object.create( StableMerge1d.prototype ) );

export { Add1d };