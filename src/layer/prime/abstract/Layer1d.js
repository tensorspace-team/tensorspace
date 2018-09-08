import {Layer} from "./Layer";

function Layer1d(config) {

	Layer.call(this, config);

}

Layer1d.prototype = Object.assign(Object.create(Layer.prototype), {

});

export { Layer1d };