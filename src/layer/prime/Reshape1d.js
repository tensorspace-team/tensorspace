import {Layer2d} from "./abstract/Layer2d";

function Reshape1d(config) {

	Layer2d.call(this, config);

}

Reshape1d.prototype = Object.assign(Object.create(Layer2d.prototype), {

});

export { Reshape1d }