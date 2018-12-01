/**
 * @author syt123450 / https://github.com/syt123450
 */

let MergeValidator = ( function() {

	function validate( layerList ) {

		let dimension;

		if ( layerList.length > 0 ) {

			dimension = layerList[ 0 ].layerDimension;

		} else {

			console.error( "Merge Layer missing elements." );

		}

		for ( let i = 0; i < layerList.length; i ++ ) {

			if ( layerList[ i ].layerDimension !== dimension ) {

				console.error( "Can not merge layers with different dimension." );

			}

		}

	}

	return {

		validate: validate

	}

} )();

export { MergeValidator };