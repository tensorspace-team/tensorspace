/**
 * @author syt123450 / https://github.com/syt123450
 */

import { AbstractModel } from "./AbstractModel";
import { ModelConfiguration } from "../configure/ModelConfiguration";
import { ModelLayerInterval } from "../utils/Constant";
import { LayerStackGenerator } from "../utils/LayerStackGenerator";
import { LevelStackGenerator } from "../utils/LevelStackGenerator";
import { ActualDepthCalculator } from "../utils/ActualDepthCalculator";

// TODO functional model API

function Model( container, config ) {

	AbstractModel.call( this, container );

	this.configuration = new ModelConfiguration( config );

	this.inputs = config.inputs;
	this.outputs = config.outputs;

	this.layers = undefined;

	this.levelMap = undefined;

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

		this.layers = LayerStackGenerator.createStack( this.outputs );

		let levelMetric = LevelStackGenerator.createStack( this.layers, this.inputs, this.outputs );

		this.levelMap = levelMetric.levelMap;
		this.layerLookupMap = levelMetric.layerLookupMap;

		this.modelDepth = this.levelMap.length;

		this.createLayerCenters();

	},

	createLayerCenters: function() {

		let layerCenters = [];

		// stable interval now.

		let xInterval = 300;

		// console.log("---result---");

		for ( let i = 0; i < this.layers.length; i ++ ) {

			layerCenters.push({});

		}

		let yList = this.calculateLevelY( this.modelDepth );

		// console.log(yList);

		for ( let i = 0; i < this.levelMap.length; i ++ ) {

			let level = i;

			// console.log("level " + i);

			let layerIndexList = this.levelMap[ level ];
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