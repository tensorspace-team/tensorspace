import {Layer} from "./Layer";

function Layer2d(config) {

	Layer.call(this, config);

}

Layer2d.prototype = Object.assign(Object.create(Layer.prototype), {


});

export { Layer2d };