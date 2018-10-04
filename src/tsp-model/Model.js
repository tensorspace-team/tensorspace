/**
 * @author syt123450 / https://github.com/syt123450
 */

import { AbstractModel } from "./AbstractModel";
import { ModelConfiguration } from "../configure/ModelConfiguration";
import { LayerStackGenerator } from "../utils/LayerStackGenerator";
import { LevelStackGenerator } from "../utils/LevelStackGenerator";
import { ActualDepthCalculator } from "../utils/ActualDepthCalculator";
import { LayerLocator } from "../utils/LayerLocator";
import { InLevelAligner } from "../utils/InLevelAligner";

// TODO functional model API

function Model( container, config ) {

	AbstractModel.call( this, container );

	this.configuration = new ModelConfiguration( config );

	this.inputs = config.inputs;
	this.outputs = config.outputs;

	this.layers = undefined;

	this.levelMap = undefined;

	this.modelDepth = undefined;

	this.levelCenters = undefined;

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

		for ( let i = 0; i < this.levelMap.length; i ++ ) {

			let layerIndexList = this.levelMap[ i ];

			for ( let j = 0; j < layerIndexList.length; j ++ ) {

				let layerIndex = layerIndexList[ j ];

				let layer = this.layers[ layerIndex ];

				layer.setEnvironment( this.scene, this );
				layer.loadModelConfig( this.configuration );
				layer.assemble( layerIndex );

			}

		}

	},

	createModelElements: function() {

		let centers = this.createLayerCenters();

		let depths = ActualDepthCalculator.calculateDepths( this.layers );

		for ( let i = 0; i < this.layers.length; i ++ ) {

			this.layers[ i ].init( centers[ i ], depths[ i ] );

		}

	},

	onClick: function( event ) {

		let model = this;

		// Use Raycaster to capture clicked element.

		model.raycaster.setFromCamera( model.mouse, model.camera );
		let intersects = model.raycaster.intersectObjects( model.scene.children, true );

		for ( let i = 0; i < intersects.length; i ++ ) {

			if ( intersects !== null && intersects.length > 0 && intersects[ i ].object.type === "Mesh" ) {

				let selectedElement = intersects[ i ].object;

				if ( selectedElement.clickable === true ) {

					// Let the layer to handle actual click event.

					let selectedLayer = this.layers[ selectedElement.layerIndex ];

					selectedLayer.handleClick( selectedElement );

					break;

				}

			}

		}

	},

	onMouseMove: function( event ) {

		// calculate mouse position..

		this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		let model = this;

		if ( model.hoveredLayer !== undefined ) {

			model.hoveredLayer.handleHoverOut();
			model.hoveredLayer = undefined;

		}

		// Use Raycaster to capture hovered element.

		model.raycaster.setFromCamera( model.mouse, model.camera );
		let intersects = model.raycaster.intersectObjects( model.scene.children, true );

		for ( let i = 0; i < intersects.length; i ++ ) {

			if ( intersects !== null && intersects.length > 0 && intersects[ i ].object.type === "Mesh" ) {

				let selectedElement = intersects[ i ].object;

				if ( selectedElement.hoverable === true ) {

					let selectedLayer = this.layers[ selectedElement.layerIndex ];

					// Let the layer to handle actual hover event.

					selectedLayer.handleHoverIn( selectedElement );

					this.hoveredLayer = selectedLayer;

					break;

				}

			}

		}

	},

	clear: function() {

	},

	reset: function() {

	},

	loadModelConfig: function() {

	},

	createGraph: function() {

		this.layers = LayerStackGenerator.createStack( this.outputs );

		let levelMetric = LevelStackGenerator.createStack( this.layers, this.inputs, this.outputs );

		this.levelMap = levelMetric.levelMap;
		this.layerLookupMap = levelMetric.layerLookupMap;

		this.modelDepth = this.levelMap.length;

		this.levelCenters = LayerLocator.calculateLevelCenters( this.modelDepth );

		this.createLayerCenters();

	},

	createLayerCenters: function() {

		let layerCenters = [];

		for ( let i = 0; i < this.layers.length; i ++ ) {

			layerCenters.push({});

		}

		for ( let i = 0; i < this.levelMap.length; i ++ ) {

			let levelLayers = [];

			for ( let j = 0; j < this.levelMap[ i ].length; j ++ ) {

				levelLayers.push( this.layers[ this.levelMap[ i ][ j ] ] );

			}

			let xTranslateList = InLevelAligner.getXTranslate( levelLayers );

			for ( let j = 0; j < this.levelMap[ i ].length; j ++ ) {

				layerCenters[ this.levelMap[ i ][ j ] ] = {

					x: this.levelCenters[i].x + xTranslateList[ j ],
					y: this.levelCenters[i].y,
					z: this.levelCenters[i].z

				};

			}

		}

		// console.log(layerCenters);

		return layerCenters;

	},

	arrangeLayerInLevel: function() {



	}

} );

export { Model };