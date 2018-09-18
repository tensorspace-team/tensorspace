/**
 * @author syt123450 / https://github.com/syt123450
 */

function Maximum3d(mergedElements) {

	this.mergedElements = mergedElements;
	this.layerIndex = undefined;

}

Maximum3d.prototype = {

	setLayerIndex: function(layerIndex) {
		this.layerIndex = layerIndex;
	},

	validate: function() {

		let inputShape = this.mergedElements[0].outputShape;

		for (let i = 0; i < this.mergedElements.length; i++) {

			let outputShape = this.mergedElements[i].outputShape;

			for (let j = 0; j < inputShape.length; j++) {

				if (outputShape[j] !== inputShape[j]) {
					return false;
				}

			}

		}

		return true;

	},

	getShape: function() {

		return this.mergedElements[0].outputShape;

	},

	getRelativeElements: function(selectedElement) {

		let curveElements = [];
		let straightElements = [];

		if (selectedElement.elementType === "aggregationElement") {

			let request = {
				all: true
			};

			for (let i = 0; i < this.mergedElements.length; i++) {
				let relativeResult = this.mergedElements[i].provideRelativeElements(request);
				let relativeElements = relativeResult.elementList;
				if (this.mergedElements[i].layerIndex === this.layerIndex - 1) {

					for (let j = 0; j < relativeElements.length; j++) {
						straightElements.push(relativeElements[j]);
					}

				} else {

					if (relativeResult.isOpen) {
						for (let j = 0; j < relativeElements.length; j++) {
							straightElements.push(relativeElements[j]);
						}
					} else {
						for (let j = 0; j < relativeElements.length; j++) {
							curveElements.push(relativeElements[j]);
						}
					}

				}
			}

		} else if (selectedElement.elementType === "featureMap") {

			let fmIndex = selectedElement.fmIndex;
			let request = {
				index: fmIndex
			};

			for (let i = 0; i < this.mergedElements.length; i++) {
				let relativeResult = this.mergedElements[i].provideRelativeElements(request);
				let relativeElements = relativeResult.elementList;

				if (this.mergedElements[i].layerIndex === this.layerIndex - 1) {

					for (let j = 0; j < relativeElements.length; j++) {
						straightElements.push(relativeElements[j]);
					}

				} else {

					if (relativeResult.isOpen) {
						for (let j = 0; j < relativeElements.length; j++) {
							straightElements.push(relativeElements[j]);
						}
					} else {
						for (let j = 0; j < relativeElements.length; j++) {
							curveElements.push(relativeElements[j]);
						}
					}

				}

			}

		}

		return {
			straight: straightElements,
			curve: curveElements
		};


	}

};

export { Maximum3d };