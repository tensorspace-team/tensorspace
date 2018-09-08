import { Layer2d } from "./abstract/Layer2d";

function GlobalPooling1d(config) {

	Layer2d.call(this, config);

}

GlobalPooling1d.prototype = Object.assign(Object.create(Layer2d.prototype), {

});

export { GlobalPooling1d };