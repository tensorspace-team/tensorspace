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
			console.log("start open layer");
		}).onComplete(function() {
			console.log("end open layer");
			layer.initCloseButton();
			layer.isOpen = true;

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
			.to(end, 2000);

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
			console.log("start close layer");
			layer.disposeCloseButton();
		}).onComplete(function() {
			console.log("end close layer");
			layer.disposeSegregationElements();
			layer.initAggregationElement();
			layer.isOpen = false;
		});

		fmTween.start();

	}

};

let MapTransitionFactory = new MapTransitionTween();

export { MapTransitionFactory };