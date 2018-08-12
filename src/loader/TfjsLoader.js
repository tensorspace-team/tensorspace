import Loader from './Loader';

function TfjsLoader( model ) {

	Loader.call(this, model);
	this.url = undefined;
	this.type = "TfjsLoader"

}

TfjsLoader.prototype = Object.assign(Object.create(Loader.prototype), {

	preLoad: function(url, config) {
		this.url = url;

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


	// 异步加载模型
	load: async function() {

		const loadedModel = await tf.loadModel(this.url);
		this.model.resource = loadedModel;
		this.model.isFit = true;

	}

});

export default TfjsLoader;