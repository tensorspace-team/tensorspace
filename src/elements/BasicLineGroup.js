/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * BasicLineGroupController, abstract layer, can not be initialized by TensorSpace user.
 * Line group component for abstract layer "Layer"
 *
 * @returns BasicLineGroup object
 */

function BasicLineGroup( layer, scene, neuralGroup, color, minOpacity ) {

	this.layer = layer;
	this.scene = scene;
	this.neuralGroup = neuralGroup;
	this.color = color;
	this.minOpacity = minOpacity;

	// actual relative lines element for layer

	this.lineGroup = undefined;

	this.init();

}

BasicLineGroup.prototype = {

	init: function() {

		let lineMat = new THREE.LineBasicMaterial( {

			opacity: this.minOpacity,
			transparent: true,
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

		let relatedElements = this.layer.getRelativeElements( selectedElement );

		let startPosition = selectedElement.getWorldPosition().sub( this.neuralGroup.getWorldPosition() );

		for ( let i = 0; i < relatedElements.length; i ++ ) {

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

	showLines: function( selectedElement ) {

		let lineGroupParameters = this.getLineGroupParameters( selectedElement );

		let geometry = new THREE.Geometry( {

			transparent:true,
			opacity: this.minOpacity

		} );

		geometry.colors = lineGroupParameters.lineColors;
		geometry.vertices = lineGroupParameters.lineVertices;
		geometry.colorsNeedUpdate = true;
		geometry.verticesNeedUpdate = true;

		this.lineGroup.geometry = geometry;
		this.lineGroup.material.needsUpdate = true;

		this.neuralGroup.add( this.lineGroup );

	},

	hideLines: function() {

		this.lineGroup.geometry.dispose();
		this.neuralGroup.remove( this.lineGroup );

	}

};

export { BasicLineGroup };