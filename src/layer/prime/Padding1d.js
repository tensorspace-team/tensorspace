import {Layer} from "./abstract/Layer";

function Padding1d(config) {

	Layer.call(this, config);

}

Padding1d.prototype = Object.assign(Object.create(Layer.prototype), {

});

export { Padding1d };