const IMAGE_SIZE = 784;
const NUM_CLASSES = 10;
const NUM_DATASET_ELEMENTS = 65000;

const TRAIN_TEST_RATIO = 5 / 6;

const NUM_TRAIN_ELEMENTS = Math.floor( TRAIN_TEST_RATIO * NUM_DATASET_ELEMENTS );
const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS;

const MNIST_IMAGES_SPRITE_PATH =
	'./data/mnist_images.png';
const MNIST_LABELS_PATH =
	'./data/mnist_labels_uint8';

class MnistData {

	constructor() {

		this.shuffledTrainIndex = 0;
		this.shuffledTestIndex = 0;

	}

	async load() {

		const img = new Image();
		const canvas = document.createElement( 'canvas' );
		const ctx = canvas.getContext( '2d' );
		const imgRequest = new Promise( ( resolve, reject ) => {

			img.crossOrigin = '';
			img.onload = () => {

				img.width = img.naturalWidth;
				img.height = img.naturalHeight;

				const datasetBytesBuffer =
					new ArrayBuffer( NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4 );

				const chunkSize = 5000;
				canvas.width = img.width;
				canvas.height = chunkSize;

				for ( let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i ++ ) {

					const datasetBytesView = new Float32Array(

						datasetBytesBuffer, i * IMAGE_SIZE * chunkSize * 4,
						IMAGE_SIZE * chunkSize

					);

					ctx.drawImage(

						img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width,
						chunkSize
					);

					const imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height );

					for ( let j = 0; j < imageData.data.length / 4; j ++ ) {

						datasetBytesView[ j ] = imageData.data[ j * 4 ] / 255;

					}

				}

				resolve(datasetBytesBuffer);

			};

			img.src = MNIST_IMAGES_SPRITE_PATH;

		} );

		const labelsRequest = fetch( MNIST_LABELS_PATH );
		const [ imgResponse, labelsResponse ] =
			await Promise.all( [ imgRequest, labelsRequest ] );

		const datasetImages = new Float32Array( imgResponse );
		const datasetLabels = new Uint8Array( await labelsResponse.arrayBuffer() );

		this.createDataset(datasetImages, datasetLabels);

	}

	createDataset(datasetImages, datasetLabels) {

		let imageIndex = 0;
		let labelIndex = 0;

		let dataItems = [];

		for (let i = 0; i < NUM_DATASET_ELEMENTS; i ++) {
			const imageArray = datasetImages.slice(imageIndex, imageIndex + IMAGE_SIZE);
			const labelArray = datasetLabels.slice(labelIndex, labelIndex + NUM_CLASSES);

			imageIndex += IMAGE_SIZE;
			labelIndex += NUM_CLASSES;

			dataItems.push([imageArray, labelArray]);
		}

		let dataset = tf.data.array(dataItems).map(([arrayImage, label])=> {
			return [tf.tensor(arrayImage, [28, 28, 1]), tf.tensor(label)];
		}).shuffle(10);

		this.trainDataset = dataset.take(NUM_TRAIN_ELEMENTS);
		this.testDataset = dataset.skip(NUM_TRAIN_ELEMENTS).take(NUM_TEST_ELEMENTS);

	}

}