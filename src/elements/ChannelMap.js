/**
 * @author syt123450 / https://github.com/syt123450
 */

import { BasicMaterialOpacity } from "../utils/Constant";
import { MinAlpha } from "../utils/Constant";
import { TextHelper } from "../utils/TextHelper";
import { TextFont } from "../assets/fonts/TextFont";
import { RenderPreprocessor } from "../utils/RenderPreprocessor";

function ChannelMap( width, height, actualWidth, actualHeight, actualDepth, center, color, type ) {

	this.width = width;
	this.height = height;
	this.actualWidth = actualWidth;
	this.actualHeight = actualHeight;
	this.actualDepth = actualDepth;
	this.unitLength = this.actualWidth / this.width;

	this.center = {

		x: center.x,
		y: center.y,
		z: center.z

	};
	this.color = color;
	this.type = type;

	this.dataArray = undefined;
	this.dataTexture = undefined;
	this.channelMap = undefined;
	this.channelGroup = undefined;

	this.font = TextFont;
	this.textSize = TextHelper.calcFmTextSize( actualWidth );

	this.widthText = undefined;
	this.heightText = undefined;

	this.init();

}

ChannelMap.prototype = {

	init: function() {

		let amount = 3 * this.width * this.height;
		let data = new Uint8Array( amount );
		this.dataArray = data;

		for ( let i = 0; i < amount; i++ ) {

			switch ( this.type ) {

				case 'R':

					if ( i % 3 === 0 ) {

						data[ i ] = 255 * MinAlpha;

					}

					break;

				case 'G':

					if ( i % 3 === 1 ) {

						data[ i ] = 255 * MinAlpha;

					}

					break;

				case 'B':

					if ( i % 3 === 2 ) {

						data[ i ] = 255 * MinAlpha;

					}

					break;

				default:

					console.log( "do not support such channel type." );

			}

		}

		let dataTex = new THREE.DataTexture( data, this.width, this.height, THREE.RGBFormat );
		this.dataTexture = dataTex;

		dataTex.magFilter = THREE.NearestFilter;
		dataTex.needsUpdate = true;

		let boxGeometry = new THREE.BoxBufferGeometry( this.actualWidth, this.unitLength, this.actualHeight );

		let material = new THREE.MeshBasicMaterial( {

			map: dataTex

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
			basicMaterial,
			basicMaterial

		];

		let cube = new THREE.Mesh( boxGeometry, materials );

		cube.hoverable = true;
		cube.elementType = "channelMap";

		this.channelMap = cube;

		let channelGroup = new THREE.Object3D();
		channelGroup.position.set( this.center.x, this.center.y, this.center.z );

		this.channelGroup = channelGroup;
		this.channelGroup.add( this.channelMap );

	},

	updateVis: function( colors ) {

		let renderColor = RenderPreprocessor.preProcessChannelColor( colors, this.width, this.height );

		for ( let i = 0; i < renderColor.length; i++ ) {

			switch ( this.type ) {

				case 'R':

					this.dataArray[ 3 * i ] = renderColor[ i ] * 255;
					break;

				case 'G':

					this.dataArray[ 3 * i + 1 ] = renderColor[ i ] * 255;
					break;

				case 'B':

					this.dataArray[ 3 * i + 2 ] = renderColor[ i ] * 255;
					break;

				default:

					console.error( "do not support such channel type." );

			}

		}

		this.dataTexture.needsUpdate = true;

	},

	getElement: function() {

		return this.channelGroup;

	},

	clear: function() {

		for ( let i = 0; i < this.dataArray.length; i++ ) {

			switch ( this.type ) {

				case 'R':

					if ( i % 3 === 0 ) {

						this.dataArray[ i ] = 255 * MinAlpha;
					}

					break;

				case 'G':

					if ( i % 3 === 1 ) {

						this.dataArray[ i ] = 255 * MinAlpha;

					}

					break;

				case 'B':

					if ( i % 3 === 2 ) {

						this.dataArray[ i ] = 255 * MinAlpha;

					}

					break;

				default:

					console.error( "do not support such channel type." );

			}

		}

		this.dataTexture.needsUpdate = true;

	},

	updatePos: function( pos ) {

		this.center.x = pos.x;
		this.center.y = pos.y;
		this.center.z = pos.z;
		this.channelGroup.position.set( pos.x, pos.y, pos.z );

	},

	setLayerIndex: function( layerIndex ) {

		this.channelMap.layerIndex = layerIndex;

	},

	setFmIndex: function( fmIndex ) {

		this.channelMap.fmIndex = fmIndex;

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

				x: this.channelMap.position.x,
				y: this.channelMap.position.y,
				z: this.channelMap.position.z

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
			height: Math.min(this.unitLength, 1),
			curveSegments: 8

		} );

		let heightText = new THREE.Mesh( heightGeometry, material );

		let heightTextPos = TextHelper.calcFmHeightTextPos(

			heightInString.length,
			this.textSize,
			this.actualHeight,
			{

				x: this.channelMap.position.x,
				y: this.channelMap.position.y,
				z: this.channelMap.position.z

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

		this.channelGroup.add( this.widthText );
		this.channelGroup.add( this.heightText );
		this.isTextShown = true;

	},

	hideText: function() {

		this.channelGroup.remove( this.widthText );
		this.channelGroup.remove( this.heightText );
		this.widthText = undefined;
		this.heightText = undefined;

		this.isTextShown = false;

	}

};

export { ChannelMap };