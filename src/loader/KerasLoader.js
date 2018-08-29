import { Loader } from './Loader';

function KerasLoader(model) {

	Loader.call(this, model);

	this.type = "KerasLoader";

}

KerasLoader.prototype = Object.assign(Object.create(KerasLoader.prototype), {

});

export { KerasLoader };