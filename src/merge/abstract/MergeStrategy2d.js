/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergeStrategy } from "./MergeStrategy";

function MergeStrategy2d( mergedElements ) {

	MergeStrategy.call( this, mergedElements );

}

MergeStrategy2d.prototype = Object.assign( Object.create( MergeStrategy.prototype ), {

	getOutputShape: function() {

		return [ 1, 1 ];

	}

} );

export { MergeStrategy2d };