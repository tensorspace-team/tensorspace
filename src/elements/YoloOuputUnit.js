/**
 * @author syt123450 / https://github.com/syt123450
 */

function YoloOutputUnit( unitLength, initPosition, color, minOpacity ) {

	this.unitLength = unitLength;
	this.width = 2 * this.unitLength;

	this.position = {

		x: initPosition.x,
		y: initPosition.y,
		z: initPosition.z

	};

	this.color = color;
	this.minOpacity = minOpacity;

	this.outputNeural = undefined;
	this.outputGroup = undefined;

	this.init();

}

YoloOutputUnit.prototype = {

	init: function() {

		let outputGroup = new THREE.Object3D();

		let boxGeometry = new THREE.BoxBufferGeometry( this.width, this.width, this.width );

		let material = new THREE.MeshBasicMaterial( {

			color: this.color,
			opacity: this.minOpacity,
			transparent: true

		} );

		let cube = new THREE.Mesh( boxGeometry, material );
		cube.elementType = "outputNeural";
		cube.clickable = true;

		cube.position.set(

			this.position.x,
			this.position.y,
			this.position.z

		);

		this.outputNeural = cube;

		outputGroup.add( cube );
		this.outputGroup = outputGroup;

	},

	getElement: function() {

		return this.outputGroup;

	},

	setLayerIndex: function( layerIndex ) {

		this.outputNeural.layerIndex = layerIndex;

	},

	setOutputIndex: function( outputIndex ) {

		this.outputNeural.outputIndex = outputIndex;

	},

	updatePos: function( pos ) {

		this.position.x = pos.x;
		this.position.y = pos.y;
		this.position.z = pos.z;
		this.outputGroup.position.set( this.position.x, this.position.y, this.position.z );

	}

};

export { YoloOutputUnit };