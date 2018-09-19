/**
 * @author syt123450 / https://github.com/syt123450
 */

import { MinAlpha } from "../utils/Constant";
import { FrameColor } from "../utils/Constant";

function QueueAggregation( actualWidth, actualHeight, actualDepth, color ) {

	this.actualWidth = actualWidth;
	this.actualHeight = actualHeight;
	this.actualDepth = actualDepth;

	this.color = color;

	this.cube = undefined;
	this.aggregationElement = undefined;

	this.init();

}

QueueAggregation.prototype = {

	init: function() {

		let geometry = new THREE.BoxBufferGeometry( this.actualWidth, this.actualDepth, this.actualHeight );

		let material = new THREE.MeshBasicMaterial( {

			color: this.color,
			opacity: MinAlpha,
			transparent: true

		} );

		let cube = new THREE.Mesh( geometry, material );

		cube.position.set( 0, 0, 0 );
		cube.clickable = true;
		cube.hoverable = true;
		cube.elementType = "aggregationElement";

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
	},

	getElement: function() {

		return this.aggregationElement;

	},

	setLayerIndex: function( layerIndex ) {

		this.cube.layerIndex = layerIndex;

	}

};

export { QueueAggregation };