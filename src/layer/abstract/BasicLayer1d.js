import {Layer1d} from "./Layer1d";

function BasicLayer1d(config) {

	Layer1d.call(this, config);

}

BasicLayer1d.prototype = Object.assign(Object.create(Layer1d.prototype), {

});

export { BasicLayer1d };
