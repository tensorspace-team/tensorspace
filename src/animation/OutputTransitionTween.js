function OutputTransitionTween() {

	this.animationTime = 2000;

}

OutputTransitionTween.prototype = {

	openLayer: function(layer) {

		let init = {
			ratio: 0
		};

		let end = {
			ratio: 1
		};

		let openTween = new TWEEN.Tween(init)
			.to(end, this.animationTime);

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
		}).onComplete(function() {
			console.log("finish open output layer");
			layer.initCloseButton();
			layer.isOpen = true;

		});

		openTween.start();

	},

	closeLayer: function(layer) {

		let init = {
			ratio: 1
		};

		let end = {
			ratio: 0
		};

		let closeTween = new TWEEN.Tween(init)
			.to(end, this.animationTime);

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


};

let OutputTransitionFactory = new OutputTransitionTween();

export { OutputTransitionFactory }