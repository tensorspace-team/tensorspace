/**
 * @author syt123450 / https://github.com/syt123450
 */

import { LineGroupGeometry } from "../../elements/LineGroupGeometry";

function BasicLineGroupController() {

	this.lineGroup = undefined;

}

BasicLineGroupController.prototype = {

	createBasicLineElement: function() {

		let lineMat = new THREE.LineBasicMaterial( {

			color: 0xffffff,
			opacity: this.minOpacity,
			transparent:true,
			vertexColors: THREE.VertexColors

		} );

		let lineGeom = new THREE.Geometry();
		lineGeom.dynamic = true;
		this.lineGroup = new THREE.Line( lineGeom, lineMat );

	},

	getLineGroupParameters: function( selectedElement ) {

		this.scene.updateMatrixWorld();

		let lineColors = [];
		let lineVertices = [];

		let relatedElements = this.getRelativeElements( selectedElement );

		let startPosition = selectedElement.getWorldPosition().sub( this.neuralGroup.getWorldPosition() );

		for ( let i = 0; i < relatedElements.length; i++ ) {

			lineColors.push( new THREE.Color( this.color ) );
			lineColors.push( new THREE.Color( this.color ) );

			lineVertices.push( relatedElements[ i ].getWorldPosition().sub( this.neuralGroup.getWorldPosition() ) );
			lineVertices.push( startPosition );

		}

		return {

			lineColors: lineColors,
			lineVertices: lineVertices

		}

	},

	initLineGroup: function( selectedElement ) {

		let lineGroupParameters = this.getLineGroupParameters( selectedElement );

		let lineGroupGeometryHandler = new LineGroupGeometry(

			lineGroupParameters.lineVertices,
			lineGroupParameters.lineColors,
			this.minOpacity

		);

		this.lineGroup.geometry = lineGroupGeometryHandler.getElement();
		this.lineGroup.material.needsUpdate = true;

		this.neuralGroup.add( this.lineGroup );

	},

	disposeLineGroup: function() {

		this.lineGroup.geometry.dispose();
		this.neuralGroup.remove( this.lineGroup );

	},

	/**
	 * getRelativeElements() get relative element in last layer for relative lines based on given hovered element.
	 *
	 * Override this function to define relative element from previous layer
	 *
	 * Use bridge design patten:
	 * 1. "getRelativeElements" send request to previous layer for relative elements;
	 * 2. Previous layer's "provideRelativeElements" receives request, return relative elements.
	 *
	 * @param { THREE.Object } selectedElement
	 * @return { THREE.Object[] } relativeElements
	 */

	getRelativeElements: function( selectedElement ) {

		let relativeElements = [];

		return [];

	}

};

export { BasicLineGroupController };