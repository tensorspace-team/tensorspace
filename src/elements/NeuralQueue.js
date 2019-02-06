/**
 * @author syt123450 / https://github.com/syt123450
 */

import { SideFaceRatio } from "../utils/Constant";
import { ColorUtils } from "../utils/ColorUtils";
import { TextFont } from "../assets/fonts/TextFont";
import { TextHelper } from "../utils/TextHelper";
import { RenderPreprocessor } from "../utils/RenderPreprocessor";

function NeuralQueue( length, unitLength, color, minOpacity, overview ) {

	this.queueLength = length;
	this.unitLength = unitLength;
	this.actualWidth = this.unitLength * this.queueLength;
	this.color = color;
	this.minOpacity = minOpacity;
	this.overview = overview;

	this.sideOpacity = SideFaceRatio * this.minOpacity;

	this.dataArray = undefined;
	this.backDataArray = undefined;
	this.dataTexture = undefined;
	this.backDataTexture = undefined;
	this.queue = undefined;

	this.queueGroup = undefined;

	this.font = TextFont;
	this.textSize = TextHelper.calcQueueTextSize( this.unitLength );
	this.textRotation = this.overview ? - Math.PI / 2 : 0;

	this.lengthText = undefined;

	this.init();

}

NeuralQueue.prototype = {

	init: function() {

		let data = new Uint8Array( this.queueLength );
		this.dataArray = data;
		let backData = new Uint8Array( this.queueLength );
		this.backDataArray = backData;

		for ( let i = 0; i < this.queueLength; i++ ) {

			data[ i ] = 255 * this.minOpacity;

		}

		let dataTex = new THREE.DataTexture( data, this.queueLength, 1, THREE.LuminanceFormat, THREE.UnsignedByteType );
		this.dataTexture = dataTex;

		dataTex.magFilter = THREE.NearestFilter;
		dataTex.needsUpdate = true;

		let backDataTex = new THREE.DataTexture( backData, this.queueLength, 1, THREE.LuminanceFormat, THREE.UnsignedByteType );
		this.backDataTexture = backDataTex;

		backDataTex.magFilter = THREE.NearestFilter;
		backDataTex.needsUpdate = true;

		let boxGeometry = new THREE.BoxBufferGeometry( this.actualWidth, this.unitLength, this.unitLength );

		let material = new THREE.MeshBasicMaterial( {

			color: this.color,
			alphaMap: dataTex,
			transparent: true

		} );

		let backMaterial = new THREE.MeshBasicMaterial( {

			color: this.color,
			alphaMap: backDataTex,
			transparent: true

		} );

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
			material,
			backMaterial

		];

		let cube = new THREE.Mesh( boxGeometry, materials );

		cube.position.set( 0, 0, 0 );
		cube.elementType = "featureLine";
		cube.hoverable = true;
		cube.draggable = true;

		this.queue = cube;

		let queueGroup = new THREE.Object3D();
		queueGroup.add( this.queue );
		this.queueGroup = queueGroup;

	},

	getElement: function() {

		return this.queueGroup;

	},

	updateVis: function( colors ) {

		let backColors = RenderPreprocessor.preProcessQueueBackColor( colors );

		for ( let i = 0; i < colors.length; i++ ) {

			this.dataArray[ i ] = 255 * colors[ i ];
			this.backDataArray[ i ] = 255 * backColors[ i ];

		}

		this.dataTexture.needsUpdate = true;
		this.backDataTexture.needsUpdate = true;

	},

	clear: function() {

		let zeroData = new Uint8Array( this.queueLength );
		let colors = ColorUtils.getAdjustValues( zeroData, this.minOpacity );

		this.updateVis( colors );

	},

	setLayerIndex: function( layerIndex ) {

		this.queue.layerIndex = layerIndex;

	},

	showText: function() {

		let lengthTextContent = this.queueLength.toString();

		let geometry = new THREE.TextGeometry( lengthTextContent, {

			font: this.font,
			size: this.textSize,
			height: Math.min( this.unitLength, 1 ),
			curveSegments: 8

		} );

		let material = new THREE.MeshBasicMaterial( { color: this.color } );

		let text = new THREE.Mesh( geometry, material );

		text.rotateX( this.textRotation );

		let textPos = TextHelper.calcQueueTextPos(

			lengthTextContent.length,
			this.textSize,
			this.unitLength,
			{

				x: this.queue.position.x,
				y: this.queue.position.y,
				z: this.queue.position.z

			}

		);

		text.position.set(

			textPos.x,
			textPos.y,
			textPos.z

		);

		this.lengthText = text;

		this.queueGroup.add( this.lengthText );
		this.isTextShown = true;

	},

	hideText: function() {

		this.queueGroup.remove( this.lengthText );
		this.lengthText = undefined;
		this.isTextShown = false;

	}

};

export { NeuralQueue };