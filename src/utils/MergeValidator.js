/**
 * @author syt123450 / https://github.com/syt123450
 */

let MergeValidator = ( function() {

	function validateDimension( layerList ) {

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

	function validateStableShape( layerList ) {

		let inputShape = layerList[ 0 ].outputShape;

		// make sure all input layers has the same shape (same in all dimension).

		for ( let i = 0; i < layerList.length; i ++ ) {

			let outputShape = layerList[ i ].outputShape;

			for ( let j = 0; j < inputShape.length; j ++ ) {

				if ( outputShape[ j ] !== inputShape[ j ] ) {

					return false;

				}

			}

		}

		return true;

	}

	return {

		validateDimension: validateDimension,

		validateStableShape: validateStableShape

	}

} )();

export { MergeValidator };