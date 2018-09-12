import {Layer2d} from "./Layer2d";

function BasicLayer2d(config) {

	Layer2d.call(this, config);

}

BasicLayer2d.prototype = Object.assign(Object.create(Layer2d.prototype), {

});

export { BasicLayer2d };