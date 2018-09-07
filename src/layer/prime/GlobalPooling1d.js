import {Layer} from "./Layer";

function GlobalPooling1d(config) {

	Layer.call(this, config);

}

GlobalPooling1d.prototype = Object.assign(Object.create(Layer.prototype), {

});

export { GlobalPooling1d };