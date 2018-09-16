import { BasicMaterialOpacity } from "../../utils/Constant";
import {LineGroupGeometry} from "../../elements/LineGroupGeometry";

function BasicLineGroupController() {

	this.lineGroup = undefined;

	this.createBasicLineElement();

}

BasicLineGroupController.prototype = {

	createBasicLineElement: function() {

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

	},

	// override this function to define relative element from previous layer
	getRelativeElements: function(selectedElement) {

		let relativeElements = [];

		if (selectedElement.elementType === "") {

		}

		return [];

	}

};

export { BasicLineGroupController };