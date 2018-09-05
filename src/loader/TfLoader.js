import { Loader } from './Loader';

function TfLoader(model, config) {

	Loader.call(this, model);

	this.modelUrl = config.modelUrl;
	this.weightUrl = config.weightUrl;
	this.output = config.output;

	this.outputsName = undefined;

	if (config.outputsName !== undefined) {
		this.outputsName = config.outputsName;
	}

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

		if (this.outputsName !== undefined) {



		} else {
			const loadedModel = await tf.loadFrozenModel(this.modelUrl, this.weightUrl);
			this.model.resource = loadedModel;
			this.model.isFit = true;
		}

	},

	predict: function(data, inputShape) {

		let batchSize = [1];
		let predictTensorShape = batchSize.concat(inputShape);

		let predictTensor = tf.tensor(data, predictTensorShape);

		let predictResult;

		if (this.outputsName !== undefined) {
			predictResult = this.model.resource.execute(predictTensor, this.names);
		} else {
			predictResult = this.model.resource.predict(predictTensor);
		}

		return predictResult;

	}

});

export { TfLoader };