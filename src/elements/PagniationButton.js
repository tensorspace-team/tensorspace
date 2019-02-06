/**
 * @author syt123450 / https://github.com/syt123450
 */

import { TextureProvider } from "../utils/TextureProvider";

function PaginationButton( paginationType, size, unitLength, position, color, minOpacity ) {

	this.paginationType = paginationType;
	this.thickness = 2 * unitLength;
	this.size = size;
	this.unitLength = unitLength;
	this.minOpacity = minOpacity;

	this.position = {

		x: position.x,
		y: position.y,
		z: position.z

	};

	this.color = color;

	this.button = undefined;

	this.init();

}

PaginationButton.prototype = {

	init: function() {

		let texture = new THREE.TextureLoader().load( TextureProvider.getTexture( this.paginationType ) );

		let materialSide = new THREE.MeshBasicMaterial( {

			color: this.color,
			opacity: this.minOpacity,
			transparent: true

		} );

		let materialTop = new THREE.MeshBasicMaterial( {

			color: this.color,
			alphaMap: texture,
			transparent: true

		} );

		let materials = [];

		materials.push( materialSide );
		materials.push( materialTop );
		materials.push( materialTop );

		let cylinderRadius = this.size;

		let geometry = new THREE.CylinderBufferGeometry( cylinderRadius, cylinderRadius, this.thickness, 32 );
		let paginationButton = new THREE.Mesh( geometry, materials );

		paginationButton.position.set( this.position.x, this.position.y, this.position.z );
		paginationButton.clickable = true;
		paginationButton.draggable = true;
		paginationButton.elementType = "paginationButton";
		paginationButton.paginationType = this.paginationType;
		paginationButton.rotateY(  Math.PI / 2 );

		this.button = paginationButton;

	},

	getElement: function() {

		return this.button;

	},

	setLayerIndex: function( layerIndex ) {

		this.button.layerIndex = layerIndex;

	},

	updatePos: function( pos ) {

		this.position.x = pos.x;
		this.position.y = pos.y;
		this.position.z = pos.z;
		this.button.position.set( this.position.x, this.position.y, this.position.z );

	}

};

export { PaginationButton };