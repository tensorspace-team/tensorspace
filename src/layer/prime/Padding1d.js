import { Layer2d } from "./abstract/Layer2d";

function Padding1d(config) {

	Layer2d.call(this, config);

}

Padding1d.prototype = Object.assign(Object.create(Layer2d.prototype), {

});

export { Padding1d };