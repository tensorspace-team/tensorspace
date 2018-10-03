import { AbstractModel } from "./AbstractModel";
import { ModelConfiguration } from "../configure/ModelConfiguration";
import { ModelLayerInterval } from "../utils/Constant";

// TODO functional model API

function Model( container, config ) {

	AbstractModel.call( this, container );

	this.configuration = new ModelConfiguration( config );

	this.inputs = config.inputs;
	this.outputs = config.outputs;

	this.layers = [];

	this.layersLevelMap = undefined;

	this.levelLookupMap = undefined;

	this.modelDepth = undefined;

	this.loadModelConfig( config );

	// Pass configuration to three.js scene.

	this.loadSceneConfig( this.configuration );

	// Create actual three.js scene.

	this.createScene();

}

Model.prototype = Object.assign( Object.create( AbstractModel.prototype ), {

	init: function() {

		this.createGraph();

		this.assembleLayers();

		this.updateCamera( this.layers.length );
		this.createModelElements();
		this.registerModelEvent();
		this.animate();

		this.isInitialized = true;


	},

	assembleLayers: function() {

		for ( let i = 0; i < this.levelLookupMap.length; i ++ ) {

			let layerIndexList = this.levelLookupMap[ i ];

			for ( let j = 0; j < layerIndexList.length; j ++ ) {

				let layerIndex = layerIndexList[ j ];

				let layer = this.layers[ layerIndex ];

				layer.setEnvironment( this.scene, this );
				layer.loadModelConfig( this.configuration );
				layer.assemble( layerIndex );

			}

		}

	},

	calculateActualDepth: function() {

		let depthList = [];

		for ( let i = 0; i < this.layers.length; i ++ ) {

			depthList.push(2);

		}

		return depthList;

	},

	createModelElements: function() {

		let centers = this.createLayerCenters();
		let depths = this.calculateActualDepth();

		for ( let i = 0; i < this.layers.length; i++ ) {

			this.layers[ i ].init( centers[ i ], depths[ i ] );

		}

	},

	onClick: function() {

	},

	onMouseMove: function() {

	},

	clear: function() {

	},

	reset: function() {

	},

	loadModelConfig: function() {

	},

	createGraph: function() {

		this.getAllLayers();
		this.calculateLayerLevel();
		this.alignOutputs();
		this.createLevelLookup();
		this.createLayerCenters();

	},

	// get all layers infer from outputs, store them into layers
	getAllLayers: function() {

		let layers = [];

		for ( let i = 0; i < this.outputs.length; i ++ ) {

			getRelativeLayers( this.outputs[ i ] );

		}

		this.layers = layers;

		function getRelativeLayers( layer ) {

			storeLayer( layer );

			if ( layer.isMerged ) {

				for ( let i = 0; i < layer.mergedElements.length; i ++ ) {

					getRelativeLayers( layer.mergedElements[ i ] );

				}

			} else {

				if ( layer.lastLayer !== undefined ) {

					getRelativeLayers( layer.lastLayer );

				}

			}

		}

		function storeLayer( layer ) {

			if ( !layers.includes( layer ) ) {

				layers.push( layer );

			}

		}

	},

	createRelationMatrix: function() {

		let layerNum = this.layers.length;

		let matrix = new Array( layerNum );

		for ( let i = 0; i < layerNum; i ++ ) {

			matrix[ i ] = new Array( layerNum );

		}

		for ( let i = 0; i < layerNum; i ++ ) {

			for ( let j = 0; j < layerNum; j ++ ) {

				matrix[ i ][ j ] = false;

			}

		}

		for ( let i = 0; i < this.layers.length; i ++ ) {

			let layer = this.layers[ i ];
			let layerIndex = this.layers.indexOf( layer );

			if ( layer.isMerged ) {

				for ( let j = 0; j < layer.mergedElements.length; j ++ ) {

					let mergedElements = layer.mergedElements[ j ];

					let elementIndexInLayers = this.layers.indexOf( mergedElements );

					matrix[ elementIndexInLayers ][ layerIndex ] = true;

				}

			} else {

				let lastLayer = layer.lastLayer;

				if ( lastLayer !== undefined ) {

					let lastLayerIndex = this.layers.indexOf( lastLayer );

					matrix[ lastLayerIndex ][ layerIndex ] =  true;

				}

			}

		}

		return matrix;

	},

	initLayerIndexMap: function() {

		let indexMap = [];

		for ( let i = 0; i < this.layers.length; i ++ ) {

			let unit = {

				index: i,
				position: -1

			};

			indexMap.push( unit );

		}

		// for ( let i = 0; i < indexMap.length; i++ ) {
		//
		// 	console.log( indexMap[i] );
		//
		// }

		return indexMap;

	},

	calculateLayerLevel: function() {

		let relationMatrix = this.createRelationMatrix();

		let indexMap = this.initLayerIndexMap();

		for ( let i = 0; i < this.inputs.length; i ++ ) {

			let input = this.inputs[ i ];

			let inputIndex = this.layers.indexOf( input );

			indexMap[ inputIndex ].position = 0;

		}

		let searchLayers = this.inputs;
		let layerLevel = 0;

		while( !allOutputs(this.outputs, searchLayers) ) {

			let newSearchLayers = [];

			for ( let i = 0; i < searchLayers.length; i ++ ) {

				let layer = searchLayers[ i ];
				let layerIndex = this.layers.indexOf( layer );

				for ( let j = 0; j < this.layers.length; j ++ ) {

					if ( relationMatrix[ layerIndex ][ j ] ) {

						indexMap[ j ].position = layerLevel + 1;
						newSearchLayers.push( this.layers[ j ] );

					}

				}

			}

			layerLevel ++;
			searchLayers = newSearchLayers;

		}

		this.layersLevelMap = indexMap;

		function allOutputs( outputs, searchLayers ) {

			for ( let i = 0; i < searchLayers.length; i ++ ) {

				if ( !outputs.includes( searchLayers[ i ] ) ) {

					return false;

				}

			}

			return true;

		}
	},

	alignOutputs: function() {

		let modelDepth = 0;

		for ( let i = 0; i < this.layersLevelMap.length; i ++ ) {

			modelDepth = Math.max( modelDepth, this.layersLevelMap[ i ].position );

		}

		this.modelDepth = modelDepth + 1;

		for ( let i = 0; i < this.layers.length; i ++ ) {

			let layer = this.layers[ i ];

			if ( this.outputs.includes( layer ) ) {

				this.layersLevelMap[ i ].position = modelDepth;

			}

		}

	},

	createLevelLookup: function() {

		let modelDepth = 0;

		for ( let i = 0; i < this.layersLevelMap.length; i ++ ) {

			modelDepth = Math.max( modelDepth, this.layersLevelMap[ i ].position );

		}

		let lookupMap = [];

		for ( let i = 0; i <= modelDepth; i++ ) {

			lookupMap.push( [] );

		}

		for ( let i = 0; i < this.layersLevelMap.length; i ++ ) {

			let levelUnit = this.layersLevelMap[ i ];

			lookupMap[ levelUnit.position ].push( levelUnit.index );

		}

		this.levelLookupMap = lookupMap;

	},

	createLayerCenters: function() {

		let layerCenters = [];

		// stable interval now.

		let xInterval = 300;

		// console.log("---result---");
		//
		// console.log( this.layers );
		// console.log( this.levelLookupMap );
		// console.log( layerCenters );

		for ( let i = 0; i < this.layers.length; i ++ ) {

			layerCenters.push({});

		}

		let yList = this.calculateLevelY( this.modelDepth );

		// console.log(yList);

		for ( let i = 0; i < this.levelLookupMap.length; i ++ ) {

			let level = i;

			// console.log("level " + i);

			let layerIndexList = this.levelLookupMap[ level ];
			let layerLength = layerIndexList.length;

			let initX = - xInterval * ( layerLength - 1 ) / 2;

			for ( let j = 0; j < layerLength; j ++ ) {

				let center = {

					x: initX + xInterval * j,
					y: yList[ level ],
					z: 0

				};

				layerCenters[ layerIndexList[ j ] ] = center;

			}

		}

		// console.log(layerCenters);

		return layerCenters;

	},

	calculateLevelY: function( depth ) {

		let yList = [];

		let initY = - ( depth - 1 ) / 2 * ModelLayerInterval;

		for ( let i = 0; i < depth; i ++ ) {

			let yPos = initY + ModelLayerInterval * i;
			yList.push( yPos );

		}

		return yList;

	}

} );

export { Model };