import {Layer2d} from "./abstract/Layer2d";

function Cropping2d(config) {

	Layer2d.call(this, config);

}

Cropping2d.prototype = Object.assign(Object.create(Layer2d.prototype), {

});

export { Cropping2d };
