function MapModelConfiguration(config) {

	this.layerShape = "line";
	this.layerInitStatus = true;
	this.color = {
		conv: 0xffffff,
		pooling: 0xffffff,
		dense: 0xffffff,
		padding: 0xffffff
	};

	if (config !== undefined) {

		if (config.layerShape !== undefined) {
			this.layerShape = config.layerShape;
		}

		if (config.layerInitStatus !== undefined) {
			this.layerInitStatus = config.layerInitStatus;
		}

		if (config.color !== undefined) {

			if (config.color.conv !== undefined) {
				this.color.conv = config.color.conv;
			}

			if (config.color.pooling !== undefined) {
				this.color.pooling = config.color.pooling;
			}

			if (config.color.dense !== undefined ) {
				this.color.dense = config.color.dense;
			}

			if (config.color.padding !== undefined) {
				this.color.padding = config.color.padding;
			}

		}

	}

	return this;

}

export { MapModelConfiguration };