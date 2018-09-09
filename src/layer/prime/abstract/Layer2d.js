import {Layer} from "./Layer";
import { QueueGroupTweenFactory } from "../../../animation/QueueGroupTransitionTween";

function Layer2d(config) {

	Layer.call(this, config);

	this.layerDimension = 2;

	this.queueHandlers = [];

}

Layer2d.prototype = Object.assign(Object.create(Layer.prototype), {

	openLayer: function() {

		if (!this.isOpen) {

			QueueGroupTweenFactory.openLayer(this);

			this.isOpen = true;

		}

	},

	closeLayer: function() {

		if (this.isOpen) {

			QueueGroupTweenFactory.closeLayer(this);

			this.isOpen = false;
		}

	},

	calcCloseButtonSize: function() {
		return 2 * this.unitLength;
	},

	calcCloseButtonPos: function() {
		return {
			x: - this.actualWidth / 2 - 30,
			y: 0,
			z: 0
		};
	}


});

export { Layer2d };