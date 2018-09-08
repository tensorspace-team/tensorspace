import {Layer} from "./abstract/Layer";

function Conv1d(config) {

	Layer.call(this, config);

}

Conv1d.prototype = Object.assign(Object.create(Layer.prototype), {

});

export { Conv1d };