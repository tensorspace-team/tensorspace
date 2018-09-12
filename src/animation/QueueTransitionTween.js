import { VariableLengthObject } from "../elements/VariableLengthObject";

function QueueTransitionTween() {

	this.animationTime = 2000;

}

QueueTransitionTween.prototype = {

	openLayer: function(layer) {

		let init = {
			scale: 1
		};

		let end = {
			scale: layer.width
		};

		let variableLengthObject = (new VariableLengthObject(layer.actualWidth / layer.width, layer.actualWidth / layer.width, layer.actualWidth / layer.width, layer.color)).getElement();

		let fmTween = new TWEEN.Tween(init)
			.to(end, this.animationTime);

		fmTween.onUpdate(function () {

			variableLengthObject.scale.x = init.scale;

		}).onStart(function () {
			console.log("start open queue layer");
			layer.disposeAggregationElement();
			layer.neuralGroup.add(variableLengthObject);
		}).onComplete(function() {
			console.log("end open queue layer");

			layer.neuralGroup.remove(variableLengthObject);
			layer.initQueueElement();
			layer.initCloseButton();
			layer.isOpen = true;
		});

		fmTween.start();

	},

	closeLayer: function(layer) {

		let init = {
			scale: 1
		};

		let end = {
			scale: 1 / layer.width
		};

		let variableLengthObject = (new VariableLengthObject(layer.actualWidth, layer.actualWidth / layer.width, layer.actualWidth / layer.width, layer.color)).getElement();

		let fmTween = new TWEEN.Tween(init)
			.to(end, this.animationTime);

		fmTween.onUpdate(function () {

			variableLengthObject.scale.x = init.scale;

		}).onStart(function () {
			layer.disposeQueueElement();
			layer.neuralGroup.add(variableLengthObject);
			layer.disposeCloseButton();
		}).onComplete(function() {
			layer.neuralGroup.remove(variableLengthObject);
			layer.initAggregationElement();
			layer.isOpen = false;
		});

		fmTween.start();

	}

};

let QueueTransitionFactory = new QueueTransitionTween();

export { QueueTransitionFactory };