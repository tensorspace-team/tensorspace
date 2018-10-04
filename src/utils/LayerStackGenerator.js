/**
 * @author syt123450 / https://github.com/syt123450
 */

let LayerStackGenerator = ( function() {

	function createStack( outputs ) {

		let layers = [];

		for ( let i = 0; i < outputs.length; i ++ ) {

			getRelativeLayers( layers, outputs[ i ] );

		}

		return layers;

	}

	function getRelativeLayers( layers, layer ) {

		storeLayer( layers, layer );

		if ( layer.isMerged ) {

			for ( let i = 0; i < layer.mergedElements.length; i ++ ) {

				getRelativeLayers( layers, layer.mergedElements[ i ] );

			}

		} else {

			if ( layer.lastLayer !== undefined ) {

				getRelativeLayers( layers, layer.lastLayer );

			}

		}

	}

	function storeLayer( layers, layer ) {

		if ( !layers.includes( layer ) ) {

			layers.push( layer );

		}

	}

	return {

		createStack: createStack

	}

} )();

export { LayerStackGenerator };