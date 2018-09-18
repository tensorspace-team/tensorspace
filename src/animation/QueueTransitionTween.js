/**
 * @author syt123450 / https://github.com/syt123450
 */

import { VariableLengthObject } from "../elements/VariableLengthObject";

let QueueTransitionFactory = (function() {

	let animationTime = 2000;

	function openLayer(layer) {

		let init = {
			scale: 1
		};

		let end = {
			scale: layer.width
		};

		let variableLengthObject = (new VariableLengthObject(layer.actualWidth / layer.width, layer.actualWidth / layer.width, layer.actualWidth / layer.width, layer.color)).getElement();

		let fmTween = new TWEEN.Tween(init)
			.to(end, animationTime);

		fmTween.onUpdate(function () {

			variableLengthObject.scale.x = init.scale;

		}).onStart(function () {
			console.log("start open queue layer");
			layer.disposeAggregationElement();
			layer.neuralGroup.add(variableLengthObject);
			layer.isTransition = true;
		}).onComplete(function() {
			console.log("end open queue layer");
			layer.neuralGroup.remove(variableLengthObject);
			layer.initQueueElement();
			layer.initCloseButton();
			layer.isTransition = false;
			layer.isOpen = true;
		});

		fmTween.start();

	}

	function closeLayer(layer) {

		let init = {
			scale: 1
		};

		let end = {
			scale: 1 / layer.width
		};

		let variableLengthObject = (new VariableLengthObject(layer.actualWidth, layer.actualWidth / layer.width, layer.actualWidth / layer.width, layer.color)).getElement();

		let fmTween = new TWEEN.Tween(init)
			.to(end, animationTime);

		fmTween.onUpdate(function () {

			variableLengthObject.scale.x = init.scale;

		}).onStart(function () {
			layer.disposeQueueElement();
			layer.neuralGroup.add(variableLengthObject);
			layer.disposeCloseButton();
			layer.isTransition = true;
		}).onComplete(function() {
			layer.neuralGroup.remove(variableLengthObject);
			layer.initAggregationElement();
			layer.isTransition = false;
			layer.isOpen = false;
		});

		fmTween.start();

	}

	return {

		openLayer: openLayer,

		closeLayer: closeLayer

	}

})();

export { QueueTransitionFactory };