import { VariableLengthObject } from "../elements/VariableLengthObject";

function LayerOpen() {

}

LayerOpen.prototype = {

	openMapLayer: function(layer) {

		let init = {
			ratio: 0
		};
		let end = {
			ratio: 1
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
			console.log("start open layer");
		}).onComplete(function() {
			console.log("end open layer");
			layer.isOpen = true;

		});

		fmTween.start();

	},

	openQueueLayer: function(layer) {

		let init = {
			scale: 1
		};

		let end = {
			scale: layer.units
		};

		let variableLengthObject = (new VariableLengthObject(1, 1, 1)).getElement();

		let fmTween = new TWEEN.Tween(init)
			.to(end, 2000);

		fmTween.onUpdate(function () {

			variableLengthObject.scale.x = init.scale;

		}).onStart(function () {
			console.log("start open queue layer");
			layer.disposeLayerPlaceHolder();
			layer.neuralGroup.add(variableLengthObject);
		}).onComplete(function() {
			console.log("end open queue layer");

			layer.neuralGroup.remove(variableLengthObject);
			layer.initLayerElements();
			layer.isOpen = true;
		});

		fmTween.start();

	}

};

let LayerOpenFactory = new LayerOpen();

export { LayerOpenFactory };