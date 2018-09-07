import {Layer} from "./Layer";

function UpSampling1d(config) {

	Layer.call(this, config);

}

UpSampling1d.prototype = Object.assign(Object.create(Layer.prototype), {

});

export { UpSampling1d };