/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MaxDepthInLayer } from "./Constant";

let ActualDepthCalculator = (function() {

	function calculateDepths( layers ) {

		let depthList = [];
		let maxDepthValue = 0;
		let actualDepthList = [];

		for ( let i = 0; i < layers.length; i ++ ) {

			let layerDepth = layers[ i ].depth;

			if ( layerDepth !== undefined ) {

				maxDepthValue = maxDepthValue > layerDepth ? maxDepthValue : layerDepth;
				depthList.push( layerDepth );

			} else {

				depthList.push( 1 );

			}

		}

		for ( let i = 0; i < layers.length; i ++ ) {

			if ( depthList[ i ] / maxDepthValue * MaxDepthInLayer > 1 ) {

				actualDepthList.push( depthList[ i ] / maxDepthValue * MaxDepthInLayer );

			} else {

				actualDepthList.push( 1 );

			}

		}

		return actualDepthList;

	}

	return {

		calculateDepths: calculateDepths

	}

})();

export { ActualDepthCalculator };