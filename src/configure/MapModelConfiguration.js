function MapModelConfiguration(config) {

	this.layerShape = "line";
	this.aggregationStrategy = "average";
	this.layerInitStatus = true;
	this.relationSystem = true;
	this.textSystem = true;
	this.color = {
		input: 0xffffff,
		input3d: 0xffffff,
		conv2d: 0xffffff,
		pooling2d: 0xffffff,
		dense: 0xffffff,
		padding2d: 0xffffff,
		output: 0xffffff
	};

	if (config !== undefined) {

		if (config.layerShape !== undefined) {
			this.layerShape = config.layerShape;
		}

		if (config.aggregationStrategy !== undefined) {
			if (config.aggregationStrategy === "average" || config.aggregationStrategy === "max") {
				this.aggregationStrategy = config.aggregationStrategy;
			} else {
				console.error("\"aggregationStrategy\" property do not support config for " + config.aggregationStrategy + " use \"average\" or \"max\" instead.");
			}

		}

		if (config.relationSystem !== undefined) {

			if (config.relationSystem === "enable") {
				this.relationSystem = true;
			} else if (config.relationSystem === "disable") {
				this.relationSystem = false;
			} else {
				console.error("\"relationSystem\" property do not support config for " + config.relationSystem + " use \"enable\" or \"disable\" instead.");
			}

		}

		if (config.textSystem !== undefined) {

			if (config.textSystem === "enable") {
				this.textSystem = true;
			} else if (config.textSystem === "disable") {
				this.textSystem = false;
			} else {
				console.error("\"textSystem\" property do not support config for " + config.textSystem + " use \"enable\" or \"disable\" instead.");
			}

		}

		if (config.layerInitStatus !== undefined) {

			if (config.layerInitStatus === "close") {
				this.layerInitStatus = false;
			} else if (config.layerInitStatus === "open") {
				this.layerInitStatus = true;
			} else {
				console.error("LayerInitStatus " + config.layerInitStatus +" is not support.");
			}

		}

		if (config.color !== undefined) {

			if (config.color.input !== undefined) {
				this.color.input = config.color.input;
			}

			if (config.color.conv2d !== undefined) {
				this.color.conv2d = config.color.conv2d;
			}

			if (config.color.pooling2d !== undefined) {
				this.color.pooling2d = config.color.pooling2d;
			}

			if (config.color.dense !== undefined ) {
				this.color.dense = config.color.dense;
			}

			if (config.color.padding2d !== undefined) {
				this.color.padding2d = config.color.padding2d;
			}

		}

	}

	return this;

}

export { MapModelConfiguration };