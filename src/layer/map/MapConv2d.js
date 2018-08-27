import MapLayer from './MapLayer';
import FeatureMap from '../../elements/FeatureMap';
import ColorUtils from '../../utils/ColorUtils';
import FmCenterGenerator from '../../utils/FmCenterGenerator';
import { LayerOpenFactory } from "../../animation/LayerOpen";
import { LayerCloseFactory } from "../../animation/LayerClose";

function MapConv2d(config) {

	MapLayer.call(this, config);

	console.log("construct map Conv2d");

	this.kernelSize = config.kernelSize;
	this.filters = config.filters;
	this.strides = config.strides;
	this.fmShape = undefined;
	this.width = undefined;
	this.height = undefined;
	this.depth = config.filters;

	this.fmCenters = [];
	this.openFmCenters = [];
	this.closeFmCenters = [];

	for (let i = 0; i < this.depth; i++) {
		let center = {
			x: 0,
			y: 0,
			z: 0
		};
		this.closeFmCenters.push(center);
	}

	this.layerType = "map conv2d";

	if (config.shape !== undefined) {

		this.isShapePredefined = true;
		this.fmShape = config.shape;
		this.width = this.fmShape[0];
		this.height = this.fmShape[1];
	} else {
		this.isShapePredefined = false;
	}

	this.isOpen = true;

}

MapConv2d.prototype = Object.assign(Object.create(MapLayer.prototype), {

	init: function(center, layerStatus) {

		this.center = center;
		this.openFmCenters = FmCenterGenerator.getFmCenters("line", this.filters, this.width, this.height);

		this.neuralGroup = new THREE.Group();
		this.neuralGroup.position.set(this.center.x, this.center.y, this.center.z);

		if (layerStatus) {
			this.isOpen = true;
			for (let i = 0; i < this.openFmCenters.length; i++) {
				this.fmCenters.push(this.openFmCenters[i]);
			}
			this.initLayerElements(this.openFmCenters);
		} else {
			this.isOpen = false;
			this.initLayerPlaceHolder();
		}

		this.scene.add(this.neuralGroup);

	},

	openLayer: function() {

		console.log("open layer");

		if (!this.isOpen) {

			this.disposeLayerPlaceHolder();
			this.initLayerElements(this.closeFmCenters);
			LayerOpenFactory.openMapLayer(this);

		}


	},

	closeLayer: function() {

		console.log("close layer");

		if (this.isOpen) {

			LayerCloseFactory.closeMapLayer(this);

		}

	},

	initLayerElements: function(centers) {

		for (let i = 0; i < this.filters; i++) {
			let featureMap = new FeatureMap(this.width, this.height, centers[i]);
			this.fmList.push(featureMap);
			this.neuralGroup.add(featureMap.getMapElement());
		}

	},

	disposeLayerElements: function() {

		let fmNum = this.fmList.length;
		for (let i = 0; i < fmNum; i++) {
			let featureMap = this.fmList[i];
			this.neuralGroup.remove(featureMap.getMapElement());
		}

		this.fmList = [];

	},

	initLayerPlaceHolder: function() {

		let geometry = new THREE.BoxGeometry(this.width, this.depth, this.height);
		let material = new THREE.MeshBasicMaterial({
			color: new THREE.Color( 1, 1, 1 )
		});

		let layerPlaceHolder = new THREE.Mesh(geometry, material);

		layerPlaceHolder.position.set(0, 0, 0);
		layerPlaceHolder.elementType = "placeholder";
		layerPlaceHolder.layerIndex = this.layerIndex;

		this.layerPlaceHolder = layerPlaceHolder;

		this.neuralGroup.add(layerPlaceHolder);

	},

	disposeLayerPlaceHolder: function() {

		this.neuralGroup.remove(this.layerPlaceHolder);
		this.layerPlaceHolder = undefined;

	},

	assemble: function(layerIndex) {

		console.log("Assemble conv2d, layer index: " + layerIndex);

		this.layerIndex = layerIndex;

		if (this.isShapePredefined) {

		} else {
			this.inputShape = this.lastLayer.outputShape;
			this.width = (this.inputShape[0] - this.kernelSize) / this.strides + 1;
			this.height = (this.inputShape[1] - this.kernelSize) / this.strides + 1;
			this.fmShape = [this.width, this.height];
		}

		this.outputShape = [this.width, this.height, this.filters];

	},

	updateValue: function(value) {

		if (this.isOpen) {

			this.neuralValue = value;

			let layerOutputValues = [];

			for (let j = 0; j < this.depth; j++) {

				let referredIndex = j;

				while (referredIndex < value.length) {

					layerOutputValues.push(value[referredIndex]);

					referredIndex += this.depth;
				}

			}

			let colors = ColorUtils.getAdjustValues(layerOutputValues);

			let featureMapSize = this.width * this.height;

			for (let i = 0; i < this.depth; i++) {

				let featureMap = this.fmList[i];
				featureMap.updateGrayScale(colors.slice(i * featureMapSize, (i + 1) * featureMapSize));

			}

		} else {

		}

	}

});

export default MapConv2d;