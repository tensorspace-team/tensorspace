/**
 * @author syt123450 / https://github.com/syt123450
 */

let LevelStackGenerator = ( function() {

	function createStack( layerStack, inputs, outputs ) {

		let relationMatrix = initEmptyRelationMatrix( layerStack.length );

		buildRelationMatrix( relationMatrix, layerStack );

		let layerLevelLookup = initLayerLevelMap( layerStack );

		buildLookupMap(  layerLevelLookup, relationMatrix, layerStack, inputs, outputs  );

		alignOutputs( layerLevelLookup, layerStack, outputs );

		let levelMap = createLevelMap( layerLevelLookup );

		return {

			levelMap : levelMap,
			layerLookupMap: layerLevelLookup

		}

	}

	function initEmptyRelationMatrix( layerNum ) {

		let matrix = new Array( layerNum );

		for ( let i = 0; i < layerNum; i ++ ) {

			matrix[ i ] = new Array( layerNum );

		}

		for ( let i = 0; i < layerNum; i ++ ) {

			for ( let j = 0; j < layerNum; j ++ ) {

				matrix[ i ][ j ] = false;

			}

		}

		return matrix;

	}

	function buildRelationMatrix( relationMatrix, layerStack ) {

		for ( let i = 0; i < layerStack.length; i ++ ) {

			let layer = layerStack[ i ];
			let layerIndex = layerStack.indexOf( layer );

			if ( layer.isMerged ) {

				for ( let j = 0; j < layer.mergedElements.length; j ++ ) {

					let mergedElements = layer.mergedElements[ j ];

					let elementIndexInLayers = layerStack.indexOf( mergedElements );

					relationMatrix[ elementIndexInLayers ][ layerIndex ] = true;

				}

			} else {

				let lastLayer = layer.lastLayer;

				if ( lastLayer !== undefined ) {

					let lastLayerIndex = layerStack.indexOf( lastLayer );

					relationMatrix[ lastLayerIndex ][ layerIndex ] =  true;

				}

			}

		}

	}

	function initLayerLevelMap( layerStack ) {

		let indexMap = [];

		for ( let i = 0; i < layerStack.length; i ++ ) {

			indexMap.push( -1 );

		}

		return indexMap;

	}

	function buildLookupMap( layerLevelLookup, relationMatrix, layerStack, inputs, outputs ) {

		for ( let i = 0; i < inputs.length; i ++ ) {

			let input = inputs[ i ];

			let inputIndex = layerStack.indexOf( input );

			layerLevelLookup[ inputIndex ] = 0;

		}

		let searchLayers = inputs;
		let layerLevel = 0;

		while( !allOutputsLayer( outputs, searchLayers ) ) {

			let newSearchLayers = [];

			for ( let i = 0; i < searchLayers.length; i ++ ) {

				let layer = searchLayers[ i ];
				let layerIndex = layerStack.indexOf( layer );

				for ( let j = 0; j < layerStack.length; j ++ ) {

					if ( relationMatrix[ layerIndex ][ j ] ) {

						layerLevelLookup[ j ] = layerLevel + 1;
						newSearchLayers.push( layerStack[ j ] );

					}

				}

			}

			layerLevel ++;
			searchLayers = newSearchLayers;

		}

	}

	function alignOutputs( layerLevelLookup, layerStack, outputs ) {

		let modelDepth = 0;

		for ( let i = 0; i < layerLevelLookup.length; i ++ ) {

			modelDepth = Math.max( modelDepth, layerLevelLookup[ i ] );

		}

		for ( let i = 0; i < layerStack.length; i ++ ) {

			let layer = layerStack[ i ];

			if ( outputs.includes( layer ) ) {

				layerLevelLookup[ i ] = modelDepth;

			}

		}

	}

	function allOutputsLayer( outputs, searchLayers ) {

		for ( let i = 0; i < searchLayers.length; i ++ ) {

			if ( !outputs.includes( searchLayers[ i ] ) ) {

				return false;

			}

		}

		return true;

	}

	function createLevelMap( layerLevelLookup ) {

		let modelDepth = 0;

		for ( let i = 0; i < layerLevelLookup.length; i ++ ) {

			modelDepth = Math.max( modelDepth, layerLevelLookup[ i ] );

		}

		let levelMap = [];

		for ( let i = 0; i <= modelDepth; i ++ ) {

			levelMap.push( [] );

		}

		for ( let i = 0; i < layerLevelLookup.length; i ++ ) {

			levelMap[ layerLevelLookup[ i ] ].push( i );

		}

		return levelMap;

	}

	return {

		createStack: createStack

	}

} )();

export { LevelStackGenerator };