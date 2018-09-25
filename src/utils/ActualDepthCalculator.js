import { MaxDepthInLayer } from "./Constant";

let ActualDepthCalculator = (function() {

	function calculateDepths( model ) {

		let depthList = [];
		let maxDepthValue = 0;
		let actualDepthList = [];

		for ( let i = 0; i < model.layers.length; i ++ ) {

			let layerDepth = model.layers[ i ].depth;

			if ( layerDepth !== undefined ) {

				maxDepthValue = maxDepthValue > layerDepth ? maxDepthValue : layerDepth;
				depthList.push( layerDepth );

			} else {

				depthList.push( 1 );

			}

		}

		for ( let i = 0; i < model.layers.length; i ++ ) {

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