/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MinAlpha } from "../utils/Constant";
import { BasicMaterialOpacity } from "../utils/Constant";
import { ColorUtils } from "../utils/ColorUtils";
import { TextFont } from "../assets/fonts/TextFont";
import { TextHelper } from "../utils/TextHelper";
import { RenderPreprocessor } from "../utils/RenderPreprocessor";

function QueueSegment( segmentLength, segmentIndex, totalLength, unitLength, color ) {

	this.segmentLength = segmentLength;
	this.segmentIndex = segmentIndex;
	this.totalLength = totalLength;
	this.unitLength = unitLength;
	this.color = color;

	this.totalSegments = Math.ceil( this.totalLength / this.segmentLength );

	this.queueLength = this.calcQueueLength();
	this.actualWidth = this.queueLength * this.unitLength;

	this.startIndex = undefined;
	this.endIndex = undefined;

	this.setRange();

	this.dataArray = undefined;
	this.backDataArray = undefined;
	this.dataTexture = undefined;
	this.backDataTexture = undefined;
	this.queue = undefined;

	this.queueGroup = undefined;

	this.font = TextFont;
	this.textSize = TextHelper.calcQueueTextSize( this.unitLength );
	this.indexSize = 0.5 * this.textSize;

	this.lengthText = undefined;
	this.startText = undefined;
	this.endText = undefined;

	this.layerIndex = undefined;

	this.queueLengthNeedsUpdate = false;

	this.init();

}

QueueSegment.prototype = {

	init: function() {

		this.queue = this.createQueueElement();

		let queueGroup = new THREE.Object3D();
		queueGroup.add( this.queue );
		this.queueGroup = queueGroup;

	},

	createQueueElement: function() {

		let data = new Uint8Array( this.queueLength );
		this.dataArray = data;
		let backData = new Uint8Array( this.queueLength );
		this.backDataArray = backData;

		for ( let i = 0; i < this.queueLength; i++ ) {

			data[ i ] = 255 * MinAlpha;

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
			opacity: BasicMaterialOpacity

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

		return cube;

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
		let colors = ColorUtils.getAdjustValues( zeroData );

		this.updateVis( colors );

	},

	setLayerIndex: function( layerIndex ) {

		this.layerIndex = layerIndex;
		this.queue.layerIndex = layerIndex;

	},

	showText: function() {

		// create length text and add it to group

		let lengthTextContent = this.totalLength.toString();

		let geometry = new THREE.TextGeometry( lengthTextContent, {

			font: this.font,
			size: this.textSize,
			height: Math.min( this.unitLength, 1 ),
			curveSegments: 8

		} );

		let material = new THREE.MeshBasicMaterial( { color: this.color } );

		let text = new THREE.Mesh( geometry, material );

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

		// create start index and add it to group

		let startTextContent = this.startIndex.toString();

		let startGeometry = new THREE.TextGeometry( startTextContent, {

			font: this.font,
			size: this.indexSize,
			height: Math.min( this.unitLength, 1 ),
			curveSegments: 8

		} );

		let startMaterial = new THREE.MeshBasicMaterial( { color: this.color } );

		let startText = new THREE.Mesh( startGeometry, startMaterial );

		let startTextPos = TextHelper.calcSegmentStartIndexPos(

			this.actualWidth,
			startTextContent.length,
			this.indexSize,
			{

				x: this.queue.position.x,
				y: this.queue.position.y,
				z: this.queue.position.z

			}

		);

		startText.position.set(

			startTextPos.x,
			startTextPos.y,
			startTextPos.z

		);

		this.startText = startText;

		this.queueGroup.add( this.startText );

		// create end text and add it to group

		let endTextContent = this.endIndex.toString();

		let endGeometry = new THREE.TextGeometry( endTextContent, {

			font: this.font,
			size: this.indexSize,
			height: Math.min( this.unitLength, 1 ),
			curveSegments: 8

		} );

		let endMaterial = new THREE.MeshBasicMaterial( { color: this.color } );

		let endText = new THREE.Mesh( endGeometry, endMaterial );

		let endTextPos = TextHelper.calcSegmentEndIndexPos(

			this.actualWidth,
			endTextContent.length,
			this.indexSize,
			{

				x: this.queue.position.x,
				y: this.queue.position.y,
				z: this.queue.position.z

			}

		);

		endText.position.set(

			endTextPos.x,
			endTextPos.y,
			endTextPos.z

		);

		this.endText = endText;

		this.queueGroup.add( this.endText );

		this.isTextShown = true;

	},

	hideText: function() {

		this.queueGroup.remove( this.lengthText );
		this.lengthText = undefined;

		this.queueGroup.remove( this.startText );
		this.startText = undefined;

		this.queueGroup.remove( this.endText );
		this.endText = undefined;

		this.isTextShown = false;

	},

	updateSegmentIndex: function( segmentIndex ) {

		if (

			this.totalSegments * this.segmentLength !== this.totalLength &&
			(

				( this.segmentIndex !== this.totalSegments - 1 && segmentIndex === this.totalSegments - 1 ) ||
				( this.segmentIndex === this.totalSegments - 1 && segmentIndex !== this.totalSegments - 1 )

			)

		) {

			this.queueLengthNeedsUpdate = true;

		}

		this.segmentIndex = segmentIndex;

		this.setRange();

		if ( this.queueLengthNeedsUpdate ) {

			this.updateLength();

		}

	},

	setRange: function() {

		this.startIndex = this.segmentLength * this.segmentIndex + 1;
		this.endIndex = Math.min( this.totalLength, this.segmentLength * ( this.segmentIndex + 1 ) );

	},

	calcQueueLength: function() {

		return Math.min( this.totalLength, this.segmentLength * ( this.segmentIndex + 1 ) ) - this.segmentLength * this.segmentIndex;

	},

	updateLength: function() {

		this.queueLength = this.calcQueueLength();
		this.actualWidth = this.unitLength * this.queueLength;

		this.queueGroup.remove( this.queue );
		this.queue = this.createQueueElement();
		this.queue.layerIndex = this.layerIndex;
		this.queueGroup.add( this.queue );

		this.queueLengthNeedsUpdate = false;

	}

};

export { QueueSegment };