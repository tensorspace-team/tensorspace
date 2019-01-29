/**
 * @author syt123450 / https://github.com/syt123450
 */

import * as THREE from "three";
import { FrameColor } from "../utils/Constant";
import { ColorUtils } from "../utils/ColorUtils";

function GridAggregation( width, unitLength, color, minOpacity ) {

	this.width = width;
	this.unitLength = unitLength;
	this.actualWidth = this.unitLength * this.width;
	this.color = color;
	this.minOpacity = minOpacity;

	this.aggregationEntity = undefined;
	this.gridGroup = undefined;

	this.init();

}

GridAggregation.prototype = {

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
			basicMaterial,
			basicMaterial

		];

		let cube = new THREE.Mesh( geometry, materials );

		cube.position.set( 0, 0, 0 );
		cube.elementType = "aggregationElement";
		cube.clickable = true;
		cube.hoverable = true;
		cube.draggable = true;

		this.aggregationEntity = cube;

		let edgesGeometry = new THREE.EdgesGeometry( geometry );
		let edgesLine = new THREE.LineSegments(

			edgesGeometry,
			new THREE.LineBasicMaterial( { color: FrameColor } )

		);

		let aggregationGroup = new THREE.Object3D();
		aggregationGroup.add( cube );
		aggregationGroup.add( edgesLine );

		this.gridGroup = aggregationGroup;

		this.clear();

	},

	getElement: function() {

		return this.gridGroup;

	},

	setLayerIndex: function( layerIndex ) {

		this.aggregationEntity.layerIndex = layerIndex;

	},

	updateVis: function( colors ) {

		for ( let i = 0; i < colors.length; i++ ) {

			this.dataArray[ i ] = 255 * colors[ i ];

		}

		this.dataTexture.needsUpdate = true;

	},

	clear: function() {

		let zeroValue = new Int8Array( this.width );
		let colors = ColorUtils.getAdjustValues( zeroValue, this.minOpacity );
		this.updateVis( colors );

	}

};

export { GridAggregation };