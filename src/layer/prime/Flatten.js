import {Layer} from "./abstract/Layer";

function Flatten(config) {

	Layer.call(this, config)

}

Flatten.prototype = Object.assign(Object.create(Layer.prototype), {

});

export { Flatten };