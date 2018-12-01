/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MergedLayer1d } from "../../layer/abstract/MergedLayer1d";
import { MergedLayer2d } from "../../layer/abstract/MergedLayer2d";
import { MergedLayer3d } from "../../layer/abstract/MergedLayer3d";

let  MergedLayerFactory = ( function() {

	function createMergedLayer( operatorType, layerList, userConfig ) {

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

			console.error( "Do not support layer " + operatorType + " operation more than 4 dimension." );

		}

	}

	return {

		createMergedLayer: createMergedLayer

	}

} )();

export { MergedLayerFactory };