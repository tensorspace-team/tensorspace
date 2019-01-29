/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as THREE from "three";
import { SideFaceRatio } from "../utils/Constant";
import { TextFont } from "../assets/fonts/TextFont";
import { TextHelper } from "../utils/TextHelper";
import { ColorUtils } from "../utils/ColorUtils";

function OutputMap3d( width, height, unitLength, actualDepth, initCenter, color, minOpacity ) {

	this.width = width;
	this.height = height;
	this.depth = 3;
	this.unitLength = unitLength;
	this.actualWidth = this.unitLength * this.width;
	this.actualHeight = this.unitLength * this.height;
	this.actualDepth = actualDepth;

	this.minOpacity = minOpacity;
	this.sideOpacity = SideFaceRatio * this.minOpacity;

	this.fmCenter = {

		x: initCenter.x,
		y: initCenter.y,
		z: initCenter.z

	};

	this.color = color;

	this.neuralLength = 3 * width * height;

	this.dataArray = undefined;
	this.dataTexture = undefined;

	this.ctx = undefined;
	this.canvasTexture = undefined;

	this.outputMap = undefined;
	this.outputGroup = undefined;

	this.font = TextFont;
	this.textSize = TextHelper.calcFmTextSize( this.actualWidth );

	this.init();

}

OutputMap3d.prototype = {

	init: function() {

		let canvas = document.createElement( "canvas" );
		canvas.width = this.width;
		canvas.height = this.height;

		this.ctx = canvas.getContext( "2d" );

		let canvasTexture = new THREE.Texture( canvas );

		this.canvasTexture = canvasTexture;

		let material;

		// suppress three.js image is not power of two warning

		console.warn = function(){};

		material = new THREE.MeshBasicMaterial( { map: canvasTexture } );

		let boxGeometry = new THREE.BoxBufferGeometry( this.actualWidth, this.actualDepth, this.actualHeight );

		let basicMaterial = new THREE.MeshBasicMaterial( {

			color: this.color,
			transparent: true,
			opacity: this.sideOpacity

		} );

		let materials = [

			basicMaterial,
			basicMaterial,
			material,
			material,
			basicMaterial,
			basicMaterial

		];

		let cube = new THREE.Mesh( boxGeometry, materials );

		cube.elementType = "outputMap3d";
		cube.clickable = true;
		cube.hoverable = true;
		cube.draggable = true;

		this.outputMap = cube;

		let outputGroup = new THREE.Object3D();
		outputGroup.position.set( this.fmCenter.x, this.fmCenter.y, this.fmCenter.z );
		outputGroup.add( this.outputMap );

		this.outputGroup = outputGroup;

		this.clear();

	},

	getElement: function() {

		return this.outputGroup;

	},

	clear: function() {

		let zeroData = new Int8Array( 3 * this.width * this.height );
		let zeroColors = ColorUtils.getAdjustValues( zeroData, this.minOpacity );

		this.updateVis( zeroColors, [] );

		this.canvasTexture.needsUpdate = true;

	},

	setLayerIndex: function( layerIndex ) {

		this.outputMap.layerIndex = layerIndex;

	},

	showText: function() {

		let widthInString = this.width.toString();
		let heightInString = this.height.toString();

		let material = new THREE.MeshBasicMaterial( { color: this.color } );

		let widthGeometry = new THREE.TextGeometry( widthInString, {

			font: this.font,
			size: this.textSize,
			height: Math.min( this.unitLength, 1 ),
			curveSegments: 8

		} );

		let widthText = new THREE.Mesh( widthGeometry, material );

		let widthTextPos = TextHelper.calcFmWidthTextPos(

			widthInString.length,
			this.textSize,
			this.actualWidth,
			{

				x: this.outputMap.position.x,
				y: this.outputMap.position.y,
				z: this.outputMap.position.z

			}

		);

		widthText.position.set(

			widthTextPos.x,
			widthTextPos.y,
			widthTextPos.z

		);

		widthText.rotateX( - Math.PI / 2 );

		let heightGeometry = new THREE.TextGeometry( heightInString, {

			font: this.font,
			size: this.textSize,
			height: Math.min( this.unitLength, 1 ),
			curveSegments: 8

		} );

		let heightText = new THREE.Mesh( heightGeometry, material );

		let heightTextPos = TextHelper.calcFmHeightTextPos(

			heightInString.length,
			this.textSize,
			this.actualHeight,
			{

				x: this.outputMap.position.x,
				y: this.outputMap.position.y,
				z: this.outputMap.position.z

			}

		);

		heightText.position.set(

			heightTextPos.x,
			heightTextPos.y,
			heightTextPos.z

		);

		heightText.rotateX( - Math.PI / 2 );

		this.widthText = widthText;
		this.heightText = heightText;

		this.outputGroup.add( this.widthText );
		this.outputGroup.add( this.heightText );
		this.isTextShown = true;

	},

	hideText: function() {

		this.outputGroup.remove( this.widthText );
		this.outputGroup.remove( this.heightText );
		this.widthText = undefined;
		this.heightText = undefined;

		this.isTextShown = false;

	},

	updateVis: function( imageData, rectList ) {

		this.drawImage( imageData );
		this.drawRectangles( rectList );

		this.canvasTexture.needsUpdate = true;

	},

	drawRectangles: function( rectList ) {

		for ( let i = 0; i < rectList.length; i ++ ) {

			let rectParameter = rectList[ i ];

			this.drawRect(

				rectParameter.x,
				rectParameter.y,
				rectParameter.width,
				rectParameter.height

			);

		}

	},

	drawRect: function( x, y, width, height ) {

		this.ctx.rect( x, y, width, height );
		this.ctx.stroke();

	},

	drawImage: function( data ) {

		let imageData = this.ctx.getImageData( 0, 0, this.width, this.height );

		let imageDataValue = imageData.data;

		let count = 0;

		for ( let i = 0; i < imageDataValue.length; i ++ ) {

			if ( i % 4 !== 3 ) {

				imageDataValue[ i ] = 255 * data[ count ];
				count++;

			} else {

				imageDataValue[ i ]  = 255;

			}

		}

		this.ctx.putImageData( imageData, 0, 0 );

	},

	setPositionedLayer: function( layerType ) {
		this.outputMap.positionedLayer = layerType;
	}

};

export { OutputMap3d };