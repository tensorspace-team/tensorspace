import SceneInitializer from '../scene/SceneInitializer';

function AbstractComposite( container ) {

	SceneInitializer.call(this, container);

}

AbstractComposite.prototype = Object.assign(Object.create( SceneInitializer.prototype ), {



});

export default AbstractComposite;