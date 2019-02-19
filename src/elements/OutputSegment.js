/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as THREE from "three";
import { OutputUnit } from "./OutputUnit";
import { OutputNeuralPosGenerator } from "../utils/OutputNeuralPosGenerator";
import { ColorUtils } from "../utils/ColorUtils";

function OutputSegment( outputs, segmentLength, segmentIndex, totalLength, unitLength, color, minOpacity, initStatus, overview ) {

	this.outputs = outputs;
	this.segmentLength = segmentLength;
	this.segmentIndex = segmentIndex;
	this.totalLength = totalLength;
	this.unitLength = unitLength;
	this.color = color;
	this.minOpacity = minOpacity;
	this.initStatus = initStatus;
	this.overview = overview;

	this.totalSegments = Math.ceil( this.totalLength / this.segmentLength );
	this.groupLength = this.calcGroupLength();

	this.outputLength = this.groupLength;

	this.startIndex = undefined;
	this.endIndex = undefined;

	this.setRange();

	this.unitList = [];

	this.outputGroup = undefined;
	this.groupLengthNeedsUpdate = false;

	this.closeResultPos = [];
	this.openResultPos = [];

	for (let i = 0; i < this.groupLength; i ++ ) {

		this.closeResultPos.push( {

			x: 0,
			y: 0,
			z: 0

		} );

	}

	this.openResultPos = OutputNeuralPosGenerator.getLinePos( this.groupLength, this.unitLength );

	this.leftBoundary = this.openResultPos[ 0 ];
	this.rightBoundary = this.openResultPos[ this.segmentLength - 1 ];

	this.textNeuralIndex = undefined;

	this.init();

}

OutputSegment.prototype = {

	init: function() {

		this.unitList = this.createListElements();

		let outputGroup = new THREE.Object3D();

		for (let i = 0; i < this.unitList.length; i ++ ) {

			outputGroup.add( this.unitList[ i ].getElement() );

		}

		this.outputGroup = outputGroup;

		this.initStatus = "open";

	},

	createListElements: function() {

		let unitList = [];

		let unitsInitPos;

		if ( this.initStatus === "close" ) {

			unitsInitPos = this.closeResultPos;

		} else {

			unitsInitPos = this.openResultPos;

		}


		for ( let i = 0; i < this.groupLength; i ++ ) {

			let unitHandler = new OutputUnit(

				this.unitLength,
				this.outputs[ this.segmentLength * this.segmentIndex + i ],
				unitsInitPos[ i ],
				this.color,
				this.minOpacity,
				this.overview

			);

			unitHandler.setOutputIndex( i );

			unitList.push( unitHandler );

		}

		return unitList;

	},

	getElement: function() {

		return this.outputGroup;

	},

	updateVis: function( colors ) {

		for ( let i = 0; i < colors.length; i ++ ) {

			this.unitList[ i ].updateVis( colors[ i ] );

		}

	},

	clear: function() {

		let zeroData = new Int8Array( this.groupLength );
		let colors = ColorUtils.getAdjustValues( zeroData, this.minOpacity );

		this.updateVis( colors );

		this.hideText();

	},

	setLayerIndex: function( layerIndex ) {

		this.layerIndex = layerIndex;

		for ( let i = 0; i < this.unitList.length; i ++ ) {

			this.unitList[ i ].setLayerIndex( layerIndex );

		}

	},

	showText: function( selectedNeural ) {

		this.hideText();

		let selectedIndex = selectedNeural.outputIndex;

		this.unitList[ selectedIndex ].showText();
		this.textNeuralIndex = selectedIndex;

	},

	showTextWithIndex: function( index ) {

		if ( index >= this.segmentLength * this.segmentIndex &&
			index < Math.min( this.totalLength, this.segmentLength * ( this.segmentIndex + 1 ) ) ) {

			let selectedIndex = index - this.segmentLength * this.segmentIndex;

			this.unitList[ selectedIndex ].showText();
			this.textNeuralIndex = selectedIndex;

		}

	},

	hideText: function() {

		if ( this.textNeuralIndex !== undefined ) {

			this.unitList[ this.textNeuralIndex ].hideText();
			this.textNeuralIndex = undefined;

		}

	},

	updateSegmentIndex: function( segmentIndex ) {

		this.hideText();

		if (

			this.totalSegments * this.segmentLength !== this.totalLength &&
			(

				( this.segmentIndex !== this.totalSegments - 1 && segmentIndex === this.totalSegments - 1 ) ||
				( this.segmentIndex === this.totalSegments - 1 && segmentIndex !== this.totalSegments - 1 )

			)

		) {

			this.groupLengthNeedsUpdate = true;
			this.isLengthChanged = true;

		} else {

			this.isLengthChanged = false;

		}

		this.segmentIndex = segmentIndex;

		this.setRange();

		if ( this.groupLengthNeedsUpdate ) {

			this.updateLength();

		}

	},

	setRange: function() {

		this.startIndex = this.segmentLength * this.segmentIndex + 1;
		this.endIndex = Math.min( this.totalLength, this.segmentLength * ( this.segmentIndex + 1 ) );

	},

	calcGroupLength: function() {

		return Math.min( this.totalLength, this.segmentLength * ( this.segmentIndex + 1 ) ) - this.segmentLength * this.segmentIndex;

	},

	updateLength: function() {

		this.groupLength = this.calcGroupLength();
		this.outputLength = this.groupLength;

		for ( let i = 0; i < this.unitList.length; i ++ ) {

			this.outputGroup.remove( this.unitList[ i ].getElement() );

		}

		this.openResultPos = OutputNeuralPosGenerator.getLinePos( this.groupLength, this.unitLength );

		this.leftBoundary = this.openResultPos[ 0 ];
		this.rightBoundary = this.openResultPos[ this.openResultPos.length - 1 ];

		this.unitList = this.createListElements();

		this.setLayerIndex( this.layerIndex );

		for ( let i = 0; i < this.unitList.length; i ++ ) {

			this.outputGroup.add( this.unitList[ i ].getElement() );

		}

		this.groupLengthNeedsUpdate = false;

	},

	updatePoses: function( posList ) {

		for ( let i = 0; i < posList.length; i ++ ) {

			this.unitList[ i ].updatePos( posList[ i ] );

		}

	}

};

export { OutputSegment };