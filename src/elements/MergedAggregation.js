/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as THREE from "three";
import { FrameColor } from "../utils/Constant";
import { ColorUtils } from "../utils/ColorUtils";
import { RenderPreprocessor } from "../utils/RenderPreprocessor";
import { TextureProvider } from "../utils/TextureProvider";

function MergedAggregation( operator, width, height, unitLength, depth, color, minOpacity ) {

	this.operator = operator;
	this.width = width;
	this.height = height;
	this.unitLength = unitLength;
	this.actualWidth = this.unitLength * this.width;
	this.actualHeight = this.unitLength * this.height;
	this.depth = depth;
	this.color = color;
	this.minOpacity = minOpacity;

	this.cube = undefined;
	this.aggregationElement = undefined;

	this.dataArray = undefined;
	this.dataArrayCache = undefined;
	this.dataTexture = undefined;

	this.dataMaterial = undefined;
	this.clearMaterial = undefined;
	this.basicMaterial = undefined;

	this.init();

}

MergedAggregation.prototype = {

	init: function() {

		let amount = this.width * this.height;
		let data = new Uint8Array( amount );
		this.dataArray = data;
		let dataTex = new THREE.DataTexture( data, this.width, this.height, THREE.LuminanceFormat, THREE.UnsignedByteType );
		this.dataTexture = dataTex;

		dataTex.magFilter = THREE.NearestFilter;
		dataTex.needsUpdate = true;

		let material = new THREE.MeshBasicMaterial( {

			color: this.color,
			alphaMap: dataTex,
			transparent: true

		} );

		let geometry = new THREE.BoxBufferGeometry( this.actualWidth, this.depth, this.actualHeight );

		let basicMaterial = new THREE.MeshBasicMaterial( {

			color: this.color,
			opacity: this.minOpacity,
			transparent: true

		} );
		
		this.basicMaterial = basicMaterial;

		let materials = [

			basicMaterial,
			basicMaterial,
			material,
			material,
			basicMaterial,
			basicMaterial

		];

		this.dataMaterial = materials;

		let operatorTexture = new THREE.TextureLoader().load( TextureProvider.getTexture( this.operator ) );

		let operatorMaterial = new THREE.MeshBasicMaterial( {

			color: this.color,
			alphaMap: operatorTexture,
			transparent: true

		} );

		let clearMaterial = [

			basicMaterial,
			basicMaterial,
			operatorMaterial,
			operatorMaterial,
			basicMaterial,
			basicMaterial

		];

		this.clearMaterial = clearMaterial;

		let cube = new THREE.Mesh( geometry, materials );

		cube.position.set( 0, 0, 0 );
		cube.elementType = "aggregationElement";
		cube.clickable = true;
		cube.hoverable = true;
		cube.draggable = true;
		cube.emissiveable = true;
		
		cube.context = this;

		this.cube = cube;

		let edgesGeometry = new THREE.EdgesGeometry( geometry );
		let edgesLine = new THREE.LineSegments(

			edgesGeometry,
			new THREE.LineBasicMaterial( { color: FrameColor } )

		);

		let aggregationGroup = new THREE.Object3D();
		aggregationGroup.add( cube );
		aggregationGroup.add( edgesLine );

		this.aggregationElement = aggregationGroup;

		this.clear();

	},

	getElement: function() {

		return this.aggregationElement;

	},

	setLayerIndex: function( layerIndex ) {

		this.cube.layerIndex = layerIndex;

	},

	clear: function() {

		let zeroValue = new Int8Array( this.width * this.height );
		let colors = ColorUtils.getAdjustValues( zeroValue, this.minOpacity );
		this.updateVis( colors );
		this.cube.material = this.clearMaterial;

	},

	updateVis: function( colors ) {

		let renderColor = RenderPreprocessor.preProcessFmColor( colors, this.width, this.height );

		for ( let i = 0; i < renderColor.length; i++ ) {

			this.dataArray[ i ] = renderColor[ i ] * 255;

		}

		this.dataTexture.needsUpdate = true;
		this.cube.material = this.dataMaterial;

	},
	
	emissive: function() {
		
		let cacheData = new Uint8Array( this.dataArray.length );
		
		for ( let i = 0; i < this.dataArray.length; i ++ ) {
			
			cacheData[ i ] = this.dataArray[ i ];
			
		}
		
		this.dataArrayCache = cacheData;
		
		for ( let i = 0; i < this.dataArray.length; i ++ ) {
			
			this.dataArray[ i ] = Math.min( this.dataArray[ i ] + 30, 255 );
			
		}
		
		this.basicMaterial.opacity += 0.2;
		
		this.dataTexture.needsUpdate = true;
		this.basicMaterial.needsUpdate = true;
		
	},
	
	darken: function() {
		
		for ( let i = 0; i < this.dataArray.length; i ++ ) {
			
			this.dataArray[ i ] = this.dataArrayCache[ i ];
			
		}
		
		this.dataArrayCache = undefined;
		
		this.basicMaterial.opacity -= 0.2;
		
		this.dataTexture.needsUpdate = true;
		this.basicMaterial.needsUpdate = true;
		
	}

};

export { MergedAggregation };