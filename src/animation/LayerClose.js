import { VariableLengthObject } from "../elements/VariableLengthObject";

function LayerClose() {

}

LayerClose.prototype = {

	closeMapLayer: function(layer) {

		let init = {
			ratio: 1
		};
		let end = {
			ratio: 0
		};

		let fmTween = new TWEEN.Tween(init)
			.to(end, 2000);

		fmTween.onUpdate(function () {

			layer.fmCenters = [];

			for (let i = 0; i < layer.fmList.length; i++) {

				let tempPos = {
					x: init.ratio * (layer.openFmCenters[i].x - layer.closeFmCenters[i].x),
					y: init.ratio * (layer.openFmCenters[i].y - layer.closeFmCenters[i].y),
					z: init.ratio * (layer.openFmCenters[i].z - layer.closeFmCenters[i].z)
				};

				layer.fmList[i].updatePos(tempPos);

				layer.fmCenters.push(tempPos);

			}

		}).onStart(function () {
			console.log("start close layer");
			layer.disposeCloseButton();
		}).onComplete(function() {
			console.log("end close layer");
			layer.disposeLayerElements();
			layer.initLayerPlaceHolder();
			layer.isOpen = false;
		});

		fmTween.start();

	},

	closeQueueLayer: function(layer) {

		let init = {
			scale: 1
		};

		let end = {
			scale: 1 / layer.units
		};

		let variableLengthObject = (new VariableLengthObject(layer.units, 1, 1, layer.color)).getElement();

		let fmTween = new TWEEN.Tween(init)
			.to(end, 2000);

		fmTween.onUpdate(function () {

			variableLengthObject.scale.x = init.scale;

		}).onStart(function () {
			console.log("start close queue layer");
			layer.disposeLayerElements();
			layer.neuralGroup.add(variableLengthObject);
			layer.disposeCloseButton();
		}).onComplete(function() {
			console.log("end close queue layer");

			layer.neuralGroup.remove(variableLengthObject);
			layer.initLayerPlaceHolder();
			layer.isOpen = false;
		});

		fmTween.start();

	}

};

let LayerCloseFactory = new LayerClose();

export { LayerCloseFactory }