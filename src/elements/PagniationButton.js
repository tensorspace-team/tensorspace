/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MinAlpha } from "../utils/Constant";
import { TextureProvider } from "../utils/TextureProvider";

function PaginationButton( paginationType, unitLength, position, color ) {

	this.paginationType = paginationType;
	this.thickness = 2 * unitLength;
	this.unitLength = unitLength;

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

		let basicMaterial = new THREE.MeshBasicMaterial( {

			color: this.color,
			opacity: MinAlpha,
			transparent: true

		} );

		let labelMaterial = new THREE.MeshBasicMaterial( {

			color: this.color,
			alphaMap: texture,
			transparent: true

		} );

		let materials = [

			basicMaterial,
			basicMaterial,
			labelMaterial,
			labelMaterial,
			basicMaterial,
			basicMaterial

		];

		let boxGeometry = new THREE.BoxBufferGeometry( 2 * this.unitLength, 2 * this.unitLength, 2 * this.unitLength );

		let paginationButton = new THREE.Mesh( boxGeometry, materials );

		paginationButton.position.set( this.position.x, this.position.y, this.position.z );
		paginationButton.clickable = true;
		paginationButton.elementType = "paginationButton";
		paginationButton.paginationType = this.paginationType;

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