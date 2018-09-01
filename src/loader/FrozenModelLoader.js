import { Loader } from './Loader';

function FrozenModelLoader(model) {

	Loader.call(this, model);

	this.modelUrl = undefined;
	this.weightUrl = undefined;

	this.type = "FrozenModelLoader";

}

FrozenModelLoader.prototype = Object.assign(Object.create(Loader.prototype), {

	preload: function(modelUrl, weightUrl, config) {

		this.modelUrl = modelUrl;
		this.weightUrl = weightUrl;

		// undefined 还是null？
		if (config.output !== undefined && config.output !== null) {

			// 根据name来设置output的序列
			let outputConfig = config.output;

			this.model.initLayerOutputIndexFromName(outputConfig);

		} else {

			// 逐次设置output序列

			this.model.initLayerOutputIndex();

		}

		if (this.model.isInitialized) {

			// 执行异步加载模型
			this.load.then(function() {
				console.log("Have stored the resource into visualization model.");
			});

		}

		this.model.loader = this;
		this.model.hasLoader = true;

	},

	load: async function() {

		const loadedModel = await tf.loadFrozenModel(this.modelUrl, this.weightUrl);
		this.model.resource = loadedModel;
		this.model.isFit = true;

	}

});

export { FrozenModelLoader };