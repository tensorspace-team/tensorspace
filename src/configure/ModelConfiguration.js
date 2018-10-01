/**
 * @author syt123450 / https://github.com/syt123450
 */

function ModelConfiguration(config ) {

	this.layerShape = "rect";
	this.aggregationStrategy = "average";
	this.layerInitStatus = true;
	this.relationSystem = true;
	this.textSystem = true;
	this.stats = false;
	this.animationTimeRatio = 1;
	this.minOpacity = 0.4;
	this.color = {

		background: 0x000000,
		input1d: 0xffffff,
		input2d: 0xffffff,
		input3d: 0xffffff,
		conv1d: 0xffff2E,
		conv2d: 0xF7FE2E,
		conv2dTranspose: 0xF7FE2E,
		cropping1d: 0xffffff,
		cropping2d: 0xffffff,
		pooling1d: 0x00ffff,
		pooling2d: 0x00ffff,
		dense: 0x00ff00,
		padding1d: 0x6eb6ff,
		padding2d: 0x6eb6ff,
		output1d: 0xffffff,
		output2d: 0xffffff,
		outputDetection: 0xffffff,
		yoloGrid: 0xffffff,
		flatten: 0xffffff,
		globalPooling1d: 0x6eb6ff,
		globalPooling2d: 0x6eb6ff,
		upSampling1d: 0x00e0ff,
		upSampling2d: 0x00e0ff,
		reshape: 0xffffff,
		activation1d: 0x7a08fa,
		activation2d: 0x7a08fa,
		activation3d: 0x7a08fa,
		basicLayer1d: 0xfffff,
		basicLayer2d: 0xfffff,
		basicLayer3d: 0xfffff,

		add: 0xe23e57,
		subtract: 0xe23e57,
		multiply: 0xe23e57,
		maximum: 0xe23e57,
		average: 0xe23e57,
		dot: 0xe23e57,
		concatenate: 0xe23e57

	};

	if ( config !== undefined ) {

		if ( config.layerShape !== undefined ) {

			this.layerShape = config.layerShape;

		}

		if ( config.aggregationStrategy !== undefined ) {

			if ( config.aggregationStrategy === "average" || config.aggregationStrategy === "max" ) {

				this.aggregationStrategy = config.aggregationStrategy;

			} else {

				console.error( "\"aggregationStrategy\" property do not support config for " + config.aggregationStrategy + " use \"average\" or \"max\" instead." );

			}

		}

		if ( config.relationSystem !== undefined ) {

			if ( config.relationSystem === "enable" ) {

				this.relationSystem = true;

			} else if ( config.relationSystem === "disable" ) {

				this.relationSystem = false;

			} else {

				console.error( "\"relationSystem\" property do not support config for " + config.relationSystem + " use \"enable\" or \"disable\" instead." );

			}

		}

		if ( config.textSystem !== undefined ) {

			if ( config.textSystem === "enable" ) {

				this.textSystem = true;

			} else if ( config.textSystem === "disable" ) {

				this.textSystem = false;

			} else {

				console.error( "\"textSystem\" property do not support config for " + config.textSystem + " use \"enable\" or \"disable\" instead." );

			}

		}

		if ( config.layerInitStatus !== undefined ) {

			if ( config.layerInitStatus === "close" ) {

				this.layerInitStatus = false;

			} else if ( config.layerInitStatus === "open" ) {

				this.layerInitStatus = true;

			} else {

				console.error( "LayerInitStatus " + config.layerInitStatus +" is not support." );

			}

		}

		if ( config.animationTimeRatio !== undefined ) {

			if ( config.animationTimeRatio > 0 ) {

				this.animationTimeRatio = config.animationTimeRatio;

			}

		}

		if ( config.minOpacity !== undefined ) {

			if ( config.minOpacity > 0 ) {

				this.minOpacity = config.minOpacity;

			}

		}

		if ( config.stats !== undefined ) {

			this.stats = config.stats;

		}

		if ( config.color !== undefined ) {

			if ( config.color.background !== undefined ) {

				this.color.background = config.color.background;

			}

			if ( config.color.input1d !== undefined ) {

				this.color.input1d = config.color.input1d;

			}

			if ( config.color.input2d !== undefined ) {

				this.color.input2d = config.color.input2d;

			}

			if ( config.color.input3d !== undefined ) {

				this.color.input3d = config.color.input3d;

			}

			if ( config.color.conv1d !== undefined ) {

				this.color.conv1d = config.color.conv1d;

			}

			if ( config.color.conv2d !== undefined ) {

				this.color.conv2d = config.color.conv2d;

			}

			if ( config.color.conv2dTranspose !== undefined ) {

				this.color.conv2dTranspose = config.color.conv2dTranspose;

			}

			if ( config.color.cropping1d !== undefined ) {

				this.color.cropping1d = config.color.cropping1d;

			}

			if ( config.color.cropping2d !== undefined ) {

				this.color.cropping2d = config.color.cropping2d;

			}

			if ( config.color.pooling1d !== undefined ) {

				this.color.pooling1d = config.color.pooling1d;

			}

			if ( config.color.pooling2d !== undefined ) {

				this.color.pooling2d = config.color.pooling2d;

			}

			if ( config.color.dense !== undefined ) {

				this.color.dense = config.color.dense;

			}

			if ( config.color.padding1d !== undefined ) {

				this.color.padding1d = config.color.padding1d;

			}

			if ( config.color.padding2d !== undefined ) {

				this.color.padding2d = config.color.padding2d;

			}

			if ( config.color.output1d !== undefined ) {

				this.color.output1d = config.color.output1d;

			}

			if ( config.color.output2d !== undefined ) {

				this.color.output2d = config.color.output2d;

			}

			if ( config.color.outputDetection !== undefined ) {

				this.color.outputDetection = config.color.outputDetection;

			}

			if ( config.color.yoloGrid !== undefined ) {

				this.color.yoloGrid = config.color.yoloGrid;

			}

			if ( config.color.flatten !== undefined ) {

				this.color.flatten = config.color.flatten;

			}

			if ( config.color.globalPooling1d !== undefined ) {

				this.color.globalPooling1d = config.color.globalPooling1d;

			}

			if ( config.color.globalPooling2d !== undefined ) {

				this.color.globalPooling2d = config.color.globalPooling2d;

			}

			if ( config.color.upSampling1d !== undefined ) {

				this.color.upSampling1d = config.color.upSampling1d;

			}

			if ( config.color.upSampling2d !== undefined ) {

				this.color.upSampling2d = config.color.upSampling2d;

			}

			if ( config.color.reshape !== undefined ) {

				this.color.reshape = config.color.reshape;

			}

			if ( config.color.activation1d !== undefined ) {

				this.color.activation1d = config.color.activation1d;

			}

			if ( config.color.activation2d !== undefined ) {

				this.color.activation2d = config.color.activation2d;

			}

			if ( config.color.activation3d !== undefined ) {

				this.color.activation3d = config.color.activation3d;

			}

			if ( config.color.basicLayer1d !== undefined ) {

				this.color.basicLayer1d = config.color.basicLayer1d;

			}

			if ( config.color.basicLayer2d !== undefined ) {

				this.color.basicLayer2d = config.color.basicLayer2d;

			}

			if ( config.color.basicLayer3d !== undefined ) {

				this.color.basicLayer3d = config.color.basicLayer3d;

			}

			if ( config.color.add !== undefined ) {

				this.color.add = config.color.add;

			}

			if ( config.color.subtract !== undefined ) {

				this.color.subtract = config.color.subtract;

			}

			if ( config.color.multiply !== undefined ) {

				this.color.multiply = config.color.multiply;

			}

			if ( config.color.maximum !== undefined ) {

				this.color.maximum = config.color.maximum;

			}

			if ( config.color.average !== undefined ) {

				this.color.average = config.color.average;

			}

			if ( config.color.dot !== undefined ) {

				this.color.dot = config.color.dot;

			}

			if ( config.color.concatenate !== undefined ) {

				this.color.concatenate = config.color.concatenate;

			}

		}

	}

	return this;

}

export { ModelConfiguration };