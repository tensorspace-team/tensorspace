/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeStrategy } from "./MergeStrategy";

function MergeStrategy1d( mergedElements ) {

	MergeStrategy.call( this, mergedElements );

}

MergeStrategy1d.prototype = Object.assign( Object.create( MergeStrategy.prototype ), {

	getOutputShape: function() {

		return [ 1 ];

	}

} );

export { MergeStrategy1d };