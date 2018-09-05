import { Loader } from './Loader';

function TfLoader(model, config) {

	Loader.call(this, model);

	this.modelUrl = config.modelUrl;
	this.weightUrl = config.weightUrl;
	this.output = config.output;

	this.type = "tensorflowLoader";

}

TfLoader.prototype = Object.assign(Object.create(Loader.prototype), {

	preLoad: function() {

		// undefined 还是null？
		if (this.output !== undefined && this.output !== null) {

			// 根据name来设置output的序列
			let outputConfig = this.output;

			this.model.initLayerOutputIndexFromName(outputConfig);

		} else {

			// 逐次设置output序列

			this.model.initLayerOutputIndex();

		}

		if (this.model.isInitialized) {

			// 执行异步加载模型
			this.load().then(function() {
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

export { TfLoader };