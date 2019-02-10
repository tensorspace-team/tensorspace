/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as THREE from "three";
import { ColorUtils } from "../utils/ColorUtils";
import { TextFont } from "../assets/fonts/TextFont";
import { TextHelper } from "../utils/TextHelper";

function OutputUnit( unitLength, output, initPositions, color, minOpacity, overview ) {

	this.output = output;
	this.unitLength = unitLength;
	this.color = color;
	this.minOpacity = minOpacity;
	this.overview = overview;

	this.cubeSize = this.unitLength;
	this.textSize = TextHelper.calcOutputTextSize( this.unitLength );
	this.textRotation = this.overview ? - Math.PI / 2 : 0;

	this.initPosition = {

		x: initPositions.x,
		y: initPositions.y,
		z: initPositions.z

	};

	this.position = {

		x: initPositions.x,
		y: initPositions.y,
		z: initPositions.z

	};

	this.isTextShown = false;

	this.font = TextFont;
	
	this.material = undefined;
	
	this.outputText = undefined;
	this.outputNeural = undefined;
	this.outputGroup = undefined;
	
	this.init();

}

OutputUnit.prototype = {

	init: function() {

		let outputGroup = new THREE.Object3D();

		let boxGeometry = new THREE.BoxBufferGeometry( this.cubeSize, this.cubeSize, this.cubeSize );

		let material = new THREE.MeshBasicMaterial( {

			color: this.color,
			opacity: this.minOpacity,
			transparent: true

		} );
		
		this.material = material;

		let cube = new THREE.Mesh( boxGeometry, material );
		cube.elementType = "outputNeural";
		cube.hoverable = true;
		cube.clickable = true;
		cube.draggable = true;
		cube.emissiveable = true;
		
		cube.context = this;

		this.outputNeural = cube;

		outputGroup.add( cube );
		this.outputGroup = outputGroup;

		this.outputGroup.position.set(

			this.initPosition.x,
			this.initPosition.y,
			this.initPosition.z

		);

	},

	getElement: function() {

		return this.outputGroup;

	},

	updateVis: function( color ) {

		this.outputNeural.material.opacity = color;
		this.outputNeural.material.needsUpdate = true;

	},

	showText: function() {

		let geometry = new THREE.TextGeometry( this.output, {

			font: this.font,
			size: this.textSize,
			height: Math.min( this.unitLength / 3, 1 ),
			curveSegments: 8

		} );

		let material = new THREE.MeshBasicMaterial( { color: this.color } );

		let text = new THREE.Mesh( geometry, material );

		text.rotateX( this.textRotation );

		let textPos = TextHelper.calcOutputTextPos(

			this.output.length,
			this.textSize,
			this.cubeSize,
			{

				x: this.outputNeural.position.x,
				y: this.outputNeural.position.y,
				z: this.outputNeural.position.z

			}

		);

		text.position.set(

			textPos.x,
			textPos.y,
			textPos.z

		);

		this.outputText = text;

		this.outputGroup.add( text );
		this.isTextShown = true;

	},

	hideText: function() {

		this.outputGroup.remove( this.outputText );
		this.outputText = undefined;
		this.isTextShown = false;

	},

	clear: function() {

		let colors = ColorUtils.getAdjustValues( [ 0 ], this.minOpacity );

		this.updateVis( colors );

		if ( this.outputText !== undefined ) {

			this.hideText();

		}

	},

	setLayerIndex: function( layerIndex ) {

		this.outputNeural.layerIndex = layerIndex;

	},

	setOutputIndex: function( outputIndex ) {

		this.outputNeural.outputIndex = outputIndex;

	},

	isSelected: function() {

		return this.isTextShown;

	},

	updatePos: function( pos ) {

		this.position.x = pos.x;
		this.position.y = pos.y;
		this.position.z = pos.z;
		this.outputGroup.position.set( pos.x, pos.y, pos.z );

	},
	
	emissive: function() {
		
		this.material.opacity += 0.2;
		this.basicMaterial.needsUpdate = true;
		
	},
	
	darken: function() {
		
		this.material.opacity -= 0.2;
		this.material.needsUpdate = true;
		
	}

};

export { OutputUnit }