/**
 * @author syt123450 / https://github.com/syt123450
 */

import { StableMerge1d } from "../abstract/StableMerge1d";

function Subtract1d( mergedElements ) {

	StableMerge1d.call( this, mergedElements );

	this.strategyType = "Subtract1d";

}

Subtract1d.prototype = Object.assign( Object.create( StableMerge1d.prototype ) );

export { Subtract1d };