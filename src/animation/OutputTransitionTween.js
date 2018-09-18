/**
 * @author syt123450 / https://github.com/syt123450
 */

let OutputTransitionFactory = (function() {

	let animationTime = 2000;

	function openLayer(layer) {

		let init = {
			ratio: 0
		};

		let end = {
			ratio: 1
		};

		let openTween = new TWEEN.Tween(init)
			.to(end, animationTime);

		openTween.onUpdate(function() {

			for (let i = 0; i < layer.segregationHandlers.length; i++) {

				let pos = {
					x: init.ratio * (layer.openResultPos[i].x - layer.closeResultPos[i].x),
					y: init.ratio * (layer.openResultPos[i].y - layer.closeResultPos[i].y),
					z: init.ratio * (layer.openResultPos[i].z - layer.closeResultPos[i].z)
				};

				layer.segregationHandlers[i].updatePos(pos);


			}

		}).onStart(function() {
			console.log("start open output layer");
			layer.disposeAggregationElement();
			layer.initSegregationElements(layer.closeResultPos);
			layer.isOpen = true;
		}).onComplete(function() {
			console.log("finish open output layer");
			layer.initCloseButton();
		});

		openTween.start();

	}

	function closeLayer(layer) {

		let init = {
			ratio: 1
		};

		let end = {
			ratio: 0
		};

		let closeTween = new TWEEN.Tween(init)
			.to(end, animationTime);

		closeTween.onUpdate(function() {

			for (let i = 0; i < layer.segregationHandlers.length; i++) {

				let pos = {
					x: init.ratio * (layer.openResultPos[i].x - layer.closeResultPos[i].x),
					y: init.ratio * (layer.openResultPos[i].y - layer.closeResultPos[i].y),
					z: init.ratio * (layer.openResultPos[i].z - layer.closeResultPos[i].z)
				};

				layer.segregationHandlers[i].updatePos(pos);

			}

		}).onStart(function() {
			console.log("start close output layer");
			layer.disposeCloseButton();
		}).onComplete(function() {
			console.log("end close output layer");
			layer.disposeSegregationElements();
			layer.initAggregationElement();
			layer.isOpen = false;
		});

		closeTween.start();

	}

	return {

		openLayer: openLayer,

		closeLayer: closeLayer

	}

})();

export { OutputTransitionFactory }