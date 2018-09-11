import {Layer2d} from "./abstract/Layer2d";

function Cropping1d(config) {

	Layer2d.call(this, config);

}

Cropping1d.prototype = Object.assign(Object.create(Layer2d.prototype), {

});

export { Cropping1d };