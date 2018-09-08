import {Layer} from "./abstract/Layer";

function Pooling1d(config) {

	Layer.call(this, config);

}

Pooling1d.prototype = Object.assign(Object.create(Layer.prototype), {



});

export { Pooling1d };
