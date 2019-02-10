/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as THREE from "three";
import { OutputUnit } from "./OutputUnit";
import { OutputNeuralPosGenerator } from "../utils/OutputNeuralPosGenerator";
import { ColorUtils } from "../utils/ColorUtils";

function OutputQueue( units, outputs, unitLength, color, minOpacity, initStatus, overview ) {

	this.units = units;
	this.outputs = outputs;
	this.unitLength = unitLength;
	this.color = color;
	this.minOpacity = minOpacity;
	this.initStatus = initStatus;
	this.overview = overview;

	this.outputLength = units;

	this.closeResultPos = [];
	this.openResultPos = [];

	for ( let i = 0; i < units; i ++ ) {

		this.closeResultPos.push( {

			x: 0,
			y: 0,
			z: 0

		} );

	}

	this.openResultPos = OutputNeuralPosGenerator.getLinePos( this.units, this.unitLength );

	this.leftBoundary = this.openResultPos[0];
	this.rightBoundary = this.openResultPos[ this.units - 1 ];

	this.outputUnitList = [];

	this.outputGroup = undefined;

	this.textNeuralIndex = undefined;

	this.init();

}

OutputQueue.prototype = {

	init: function() {

		let unitsInitPos;

		if ( this.initStatus === "close" ) {

			unitsInitPos = this.closeResultPos;

		} else {

			unitsInitPos = this.openResultPos;

		}

		for ( let i = 0; i < this.units; i ++ ) {

			let unitHandler = new OutputUnit(

				this.unitLength,
				this.outputs[ i ],
				unitsInitPos[ i ],
				this.color,
				this.minOpacity,
				this.overview

			);

			unitHandler.setOutputIndex( i );

			this.outputUnitList.push( unitHandler );

		}

		let outputGroup = new THREE.Object3D();
		this.outputGroup = outputGroup;

		for ( let i = 0; i < this.outputUnitList.length; i ++ ) {

			this.outputGroup.add( this.outputUnitList[ i ].getElement() );

		}

	},

	updateVis: function( colors ) {

		for ( let i = 0; i < colors.length; i ++ ) {

			this.outputUnitList[ i ].updateVis( [ colors[ i ] ] );

		}

	},

	setLayerIndex: function( layerIndex ) {

		for ( let i = 0; i < this.outputUnitList.length; i ++ ) {

			this.outputUnitList[ i ].setLayerIndex( layerIndex );

		}

	},

	getElement: function() {

		return this.outputGroup;

	},

	showText( selectedNeural ) {

		this.hideText();

		let selectedIndex = selectedNeural.outputIndex;

		this.outputUnitList[ selectedIndex ].showText();
		this.textNeuralIndex = selectedIndex;

	},

	showTextWithIndex: function( index ) {

		this.hideText();

		this.outputUnitList[ index ].showText();
		this.textNeuralIndex = index;

	},

	hideText: function() {

		if ( this.textNeuralIndex !== undefined ) {

			this.outputUnitList[ this.textNeuralIndex ].hideText();
			this.textNeuralIndex = undefined;

		}

	},

	clear: function() {

		let zeroValue = new Int8Array( this.units );

		let colors = ColorUtils.getAdjustValues( zeroValue, this.minOpacity );

		this.updateVis( colors );

		this.hideText();

	},

	updatePoses: function( posList ) {

		for ( let i = 0; i < posList.length; i ++ ) {

			this.outputUnitList[ i ].updatePos( posList[ i ] );

		}

	},
	
	emissive: function() {
		
		for ( let i = 0; i < this.outputUnitList.length; i ++ ) {
			
			this.outputUnitList[ i ].emissive();
			
		}
		
	},
	
	darken: function() {
		
		for ( let i = 0; i < this.outputUnitList.length; i ++ ) {
			
			this.outputUnitList[ i ].darken();
			
		}
		
	}

};

export { OutputQueue };