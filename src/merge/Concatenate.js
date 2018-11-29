/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergedLayer1d } from "../layer/abstract/MergedLayer1d";
import { MergedLayer2d } from "../layer/abstract/MergedLayer2d";
import { MergedLayer3d } from "../layer/abstract/MergedLayer3d";

function Concatenate( layerList, config ) {

	let operatorType = "concatenate";

	validate( layerList );

	return createMergedLayer( layerList, config );

	function validate( layerList ) {

		let depth;

		if ( layerList.length > 0 ) {

			depth = layerList[ 0 ].layerDimension;

		} else {

			console.error( "Merge Layer missing elements." );

		}

		for ( let i = 0; i < layerList.length; i ++ ) {

			if ( layerList[ i ].layerDimension !== depth ) {

				console.error( "Can not add layer with different depth." );

			}

		}

	}

	function createMergedLayer( layerList, userConfig ) {

		if ( layerList[ 0 ].layerDimension === 1 ) {

			return new MergedLayer1d( {

				operator: operatorType,
				mergedElements: layerList,
				userConfig: userConfig

			} );

		} else if ( layerList[ 0 ].layerDimension === 2 ) {

			return new MergedLayer2d( {

				operator: operatorType,
				mergedElements: layerList,
				userConfig: userConfig

			} );

		} else if ( layerList[ 0 ].layerDimension === 3 ) {

			return new MergedLayer3d( {

				operator: operatorType,
				mergedElements: layerList,
				userConfig: userConfig

			} );

		} else {

			console.error( "Do not support layer concatenate operation more than 4 dimension." );

		}

	}

}

export { Concatenate };