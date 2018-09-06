import { CloseButtonHelper } from "../../utils/CloseButtonHelper";
import { CloseButton } from "../../elements/CloseButton";
import { CloseButtonRatio } from "../../utils/Constant";
import { LineGroupGeometry } from "../../elements/LineGroupGeometry";
import { BasicMaterialOpacity } from "../../utils/Constant";

function Layer(config) {
	this.scene = undefined;
	this.layerIndex = undefined;
	this.center = undefined;
	this.nextLayer = undefined;
	this.lastLayer = undefined;

	// store all neural value as an array

	this.neuralValue = undefined;

	this.activation = undefined;
	this.neuralNum = undefined;
	this.outputShape = [];
	this.neuralGroup = undefined;

	// store the reference aggregationElement object
	this.aggregationElement = undefined;

	// output index to fit the layer
	this.resourceOutputIndex = undefined;

	// color for layer neural visualization
	this.color = undefined;

	// store the reference for layer aggregation
	this.aggregationHandler = undefined;

	// store all layer segregation references as a list
	this.segregationHandlers = [];

	// store the reference for close button
	this.closeButtonHandler = undefined;

	// center position is the left-most for layer, type: {x: value , y: value, z: value}
	this.leftMostCenter = undefined;

	// actual width and height in three.js scene
	this.actualWidth = undefined;
	this.actualHeight = undefined;

	// actual depth for layer aggregation
	this.actualDepth = undefined;

	// used to define close sphere size
	this.openHeight = undefined;

	// store hook between layers
	this.nextHookHandler = undefined;
	this.lastHookHandler = undefined;

	// store the line group system element
	let lineMat = new THREE.LineBasicMaterial( {
		color: 0xffffff,
		opacity: BasicMaterialOpacity,
		transparent:true,
		vertexColors: THREE.VertexColors
	} );
	let lineGeom = new THREE.Geometry();
	lineGeom.dynamic = true;
	this.lineGroup = new THREE.Line(lineGeom, lineMat);

	// handler for element showing text
	this.textElementHandler = undefined;

	// config for text and relation line
	this.textSystem = undefined;
	this.relationSystem = undefined;

	this.isopen = undefined;

	this.loadBasicLayerConfig(config);

}

Layer.prototype = {

	loadBasicLayerConfig: function(config) {

		if (config !== undefined) {

			if (config.initStatus !== undefined) {

				if (config.initStatus === "open") {
					this.isOpen = true;
				} else if (config.initStatus === "close") {
					this.isOpen = false;
				} else {
					console.error("\"initStatus\" property do not support for " + config.initStatus + ", use \"open\" or \"close\" instead.");
				}

			}

			if (config.color !== undefined) {
				this.color = config.color;
			}

			if (config.name !== undefined) {
				this.name = config.name;
			}

		}

	},

	setNextLayer: function(layer) {
		this.nextLayer = layer;
	},

	setLastLayer: function(layer) {
		this.lastLayer = layer;
	},

	setEnvironment: function(scene) {
		this.scene = scene;
	},

	initCloseButton: function() {

		let closeButtonPos = CloseButtonHelper.getPosInLayer(this.leftMostCenter, this.actualWidth);
		let closeButtonHandler = new CloseButton(this.openHeight * CloseButtonRatio, closeButtonPos, this.color);
		closeButtonHandler.setLayerIndex(this.layerIndex);

		this.closeButtonHandler = closeButtonHandler;
		this.neuralGroup.add(this.closeButtonHandler.getElement());

	},

	disposeCloseButton: function() {

		this.neuralGroup.remove(this.closeButtonHandler.getElement());
		this.closeButtonHandler = undefined;

	},

	getLineGroupParameters: function(selectedElement) {

		this.scene.updateMatrixWorld();

		let lineColors = [];
		let lineVertices = [];

		let relatedElements = this.getRelativeElements(selectedElement);

		let startPosition = selectedElement.getWorldPosition().sub(this.neuralGroup.getWorldPosition());

		for (let i = 0; i < relatedElements.length; i++) {

			lineColors.push(new THREE.Color(this.color));
			lineColors.push(new THREE.Color(this.color));

			lineVertices.push(relatedElements[i].getWorldPosition().sub(this.neuralGroup.getWorldPosition()));
			lineVertices.push(startPosition);

		}

		return {
			lineColors: lineColors,
			lineVertices: lineVertices
		}

	},

	clear: function() {

		if (this.neuralValue !== undefined) {
			if (this.isOpen) {
				for (let i = 0; i < this.segregationHandlers.length; i++) {
					this.segregationHandlers[i].clear();
				}
			} else {
				this.aggregationHandler.clear();
			}
			this.neuralValue = undefined;
		}

	},

	initLineGroup: function(selectedElement) {

		let lineGroupParameters = this.getLineGroupParameters(selectedElement);

		let lineGroupGeometryHandler = new LineGroupGeometry(
			lineGroupParameters.lineVertices,
			lineGroupParameters.lineColors
		);
		this.lineGroup.geometry = lineGroupGeometryHandler.getElement();
		this.lineGroup.material.needsUpdate = true;

		this.neuralGroup.add(this.lineGroup);

	},

	disposeLineGroup: function() {

		this.lineGroup.geometry.dispose();
		this.neuralGroup.remove(this.lineGroup);

	}

};


export { Layer };