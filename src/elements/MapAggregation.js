import { MinAlpha } from "../utils/Constant";
import { FrameColor } from "../utils/Constant";
import { colorUtils } from "../utils/ColorUtils";
import { RenderPreprocessor } from "../utils/RenderPreprocessor";

function MapAggregation(width, height, actualWidth, actualHeight, depth, color) {

	this.width = width;
	this.height = height;
	this.actualWidth = actualWidth;
	this.actualHeight = actualHeight;
	this.depth = depth;

	this.color = color;

	this.cube = undefined;
	this.aggregationElement = undefined;

	this.dataArray = undefined;
	this.dataTexture = undefined;

	this.init();

}

MapAggregation.prototype = {

	init: function() {

		let amount = this.width * this.height;
		let data = new Uint8Array(amount);
		this.dataArray = data;
		let dataTex = new THREE.DataTexture(data, this.width, this.height, THREE.LuminanceFormat, THREE.UnsignedByteType);
		this.dataTexture = dataTex;

		dataTex.magFilter = THREE.NearestFilter;
		dataTex.needsUpdate = true;

		let material = new THREE.MeshBasicMaterial({ color: this.color, alphaMap: dataTex, transparent: true });

		let geometry = new THREE.BoxGeometry(this.actualWidth, this.depth, this.actualHeight);
		let basicMaterial = new THREE.MeshBasicMaterial({
			color: this.color, opacity: MinAlpha, transparent: true
		});

		let materials = [
			basicMaterial,
			basicMaterial,
			material,
			material,
			basicMaterial,
			basicMaterial
		];

		let cube = new THREE.Mesh(geometry, materials);

		cube.position.set(0, 0, 0);
		cube.elementType = "aggregationElement";
		cube.clickable = true;
		cube.hoverable = true;

		this.cube = cube;

		let edgesGeometry = new THREE.EdgesGeometry(geometry);
		let edgesLine = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({
			color: FrameColor
		}));

		let aggregationGroup = new THREE.Object3D();
		aggregationGroup.add(cube);
		aggregationGroup.add(edgesLine);

		this.aggregationElement = aggregationGroup;

		this.clear();
	},

	getElement: function() {
		return this.aggregationElement;
	},

	setLayerIndex: function(layerIndex) {
		this.cube.layerIndex = layerIndex;
	},

	clear: function() {

		let zeroValue = new Int8Array(this.width * this.height);
		let colors = colorUtils.getAdjustValues(zeroValue);

		this.updateVis(colors);

	},

	updateVis: function(colors) {

		let renderColor = RenderPreprocessor.preProcessFmColor(colors, this.width, this.height);

		for (let i = 0; i < renderColor.length; i++) {
			this.dataArray[i] = renderColor[i] * 255;
		}

		this.dataTexture.needsUpdate = true;

	}

};

export { MapAggregation };