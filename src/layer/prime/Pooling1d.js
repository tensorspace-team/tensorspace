import { Layer2d } from "./abstract/Layer2d";

function Pooling1d(config) {

	Layer2d.call(this, config);

}

Pooling1d.prototype = Object.assign(Object.create(Layer2d.prototype), {



});

export { Pooling1d };
