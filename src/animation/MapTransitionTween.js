function MapTransitionTween() {

	this.animationTime = 2000;

}

MapTransitionTween.prototype = {

	openLayer: function(layer) {

		let init = {
			ratio: 0
		};
		let end = {
			ratio: 1
		};

		let fmTween = new TWEEN.Tween(init)
			.to(end, this.animationTime);

		fmTween.onUpdate(function () {

			for (let i = 0; i < layer.segregationHandlers.length; i++) {

				let tempPos = {
					x: init.ratio * (layer.openFmCenters[i].x - layer.closeFmCenters[i].x),
					y: init.ratio * (layer.openFmCenters[i].y - layer.closeFmCenters[i].y),
					z: init.ratio * (layer.openFmCenters[i].z - layer.closeFmCenters[i].z)
				};

				layer.segregationHandlers[i].updatePos(tempPos);

			}

		}).onStart(function () {
			layer.disposeAggregationElement();
			layer.initSegregationElements(layer.closeFmCenters);
			layer.isOpen = true;
		}).onComplete(function() {
			layer.initCloseButton();
		});

		fmTween.start();

	},

	closeLayer: function(layer) {

		let init = {
			ratio: 1
		};
		let end = {
			ratio: 0
		};

		let fmTween = new TWEEN.Tween(init)
			.to(end, this.animationTime);

		fmTween.onUpdate(function () {

			for (let i = 0; i < layer.segregationHandlers.length; i++) {

				let tempPos = {
					x: init.ratio * (layer.openFmCenters[i].x - layer.closeFmCenters[i].x),
					y: init.ratio * (layer.openFmCenters[i].y - layer.closeFmCenters[i].y),
					z: init.ratio * (layer.openFmCenters[i].z - layer.closeFmCenters[i].z)
				};

				layer.segregationHandlers[i].updatePos(tempPos);

			}

		}).onStart(function () {
			layer.disposeCloseButton();
		}).onComplete(function() {
			layer.disposeSegregationElements();
			layer.initAggregationElement();
			layer.isOpen = false;
		});

		fmTween.start();

	}

};

let MapTransitionFactory = new MapTransitionTween();

export { MapTransitionFactory };