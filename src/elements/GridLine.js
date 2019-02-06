/**
 * @author syt123450 / https://github.com/syt123450
 */

import { RenderPreprocessor } from "../utils/RenderPreprocessor";
import { ColorUtils } from "../utils/ColorUtils";
import { TextFont } from "../assets/fonts/TextFont";
import { TextHelper } from "../utils/TextHelper";

function GridLine( width, unitLength, initCenter, color, minOpacity ) {

	this.width = width;
	this.unitLength = unitLength;
	this.actualWidth = this.unitLength * this.width;

	this.center = {

		x: initCenter.x,
		y: initCenter.y,
		z: initCenter.z

	};

	this.color = color;
	this.minOpacity = minOpacity;

	this.font = TextFont;
	this.textSize = TextHelper.calcQueueTextSize( this.unitLength );

	this.dataArray = undefined;
	this.dataArrayBack = undefined;

	this.dataTexture = undefined;
	this.dataTextureBack = undefined;

	this.gridEntity = undefined;
	this.gridGroup = undefined;

	this.lengthText = undefined;

	this.init();

}

GridLine.prototype = {

	init: function() {

		let amount = this.width;
		let data = new Uint8Array( amount );
		this.dataArray = data;
		let dataTex = new THREE.DataTexture( data, this.width, 1, THREE.LuminanceFormat, THREE.UnsignedByteType );
		this.dataTexture = dataTex;

		dataTex.magFilter = THREE.NearestFilter;
		dataTex.needsUpdate = true;

		let material = new THREE.MeshBasicMaterial( {

			color: this.color,
			alphaMap: dataTex,
			transparent: true

		} );

		let dataBack = new Uint8Array( amount );
		this.dataArrayBack = dataBack;
		let dataTexBack = new THREE.DataTexture( dataBack, this.width, 1, THREE.LuminanceFormat, THREE.UnsignedByteType );
		this.dataTextureBack = dataTexBack;

		dataTexBack.magFilter = THREE.NearestFilter;
		dataTexBack.needsUpdate = true;

		let materialBack = new THREE.MeshBasicMaterial( {

			color: this.color,
			alphaMap: dataTexBack,
			transparent: true

		} );

		let geometry = new THREE.BoxBufferGeometry( this.actualWidth, this.unitLength, this.unitLength );

		let basicMaterial = new THREE.MeshBasicMaterial( {

			color: this.color,
			opacity: this.minOpacity,
			transparent: true

		} );

		let materials = [

			basicMaterial,
			basicMaterial,
			material,
			material,
			material,
			materialBack

		];

		let cube = new THREE.Mesh( geometry, materials );

		cube.position.set( 0, 0, 0 );
		cube.elementType = "gridLine";
		cube.hoverable = true;
		cube.draggable = true;

		this.gridEntity = cube;

		let aggregationGroup = new THREE.Object3D();
		aggregationGroup.add( cube );

		aggregationGroup.position.set( this.center.x, this.center.y, this.center.z );

		this.gridGroup = aggregationGroup;

		this.clear();

	},

	getElement: function() {

		return this.gridGroup;

	},

	setLayerIndex: function( layerIndex ) {

		this.gridEntity.layerIndex = layerIndex;

	},

	setGridIndex: function( gridIndex ) {

		this.gridEntity.gridIndex = gridIndex;

	},

	updateVis: function( colors ) {

		let backColors = RenderPreprocessor.preProcessQueueBackColor( colors );

		for ( let i = 0; i < colors.length; i++ ) {

			this.dataArray[ i ] = 255 * colors[ i ];
			this.dataArrayBack[ i ] = 255 * backColors[ i ];

		}

		this.dataTexture.needsUpdate = true;
		this.dataTextureBack.needsUpdate = true;

	},

	updatePos: function( pos ) {

		this.center.x = pos.x;
		this.center.y = pos.y;
		this.center.z = pos.z;

		this.gridGroup.position.set( this.center.x, this.center.y, this.center.z );

	},

	clear: function() {

		let zeroData = new Uint8Array( this.width );
		let colors = ColorUtils.getAdjustValues( zeroData, this.minOpacity );
		this.updateVis( colors );

	},

	showText: function() {

		let lengthTextContent = this.width.toString();

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

				x: this.gridEntity.position.x,
				y: this.gridEntity.position.y,
				z: this.gridEntity.position.z

			}

		);

		text.position.set(

			textPos.x,
			textPos.y,
			textPos.z

		);

		this.lengthText = text;

		this.gridGroup.add( this.lengthText );
		this.isTextShown = true;

	},

	hideText: function() {

		this.gridGroup.remove( this.lengthText );
		this.lengthText = undefined;
		this.isTextShown = false;

	}

};

export { GridLine };