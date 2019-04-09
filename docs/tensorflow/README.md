<p align="center">
<img width=400 src="./img/tensorflow.png">
</p>
<h1 align=center>TensorFlow</h1>
<p align=center><b>Visualize pre-trained TensorFlow model using TensorSpace and TensorSpace-Converter</b></p>

## Introduction

In the following chapter, we will introduce the usage and workflow of visualizing TensorFlow model using TensorSpace and TensorSpace-Converter. In this tutorial, we will convert TensorFlow models with TensorSpace-Converter and visualize the converted models with TensorSpace.

This example uses LeNet trained with MNIST dataset. We provide [pre-trained TensorFlow LeNet models](https://github.com/tensorspace-team/tensorspace-converter/tree/master/examples/tensorflow/rawModel) for this example.

## Sample files

The sample files that are used in this tutorial are listed below:

* pre-trained [TensorFlow models](https://github.com/tensorspace-team/tensorspace-converter/tree/master/examples/tensorflow/rawModel)
    * [tf.keras model](https://github.com/tensorspace-team/tensorspace-converter/tree/master/examples/tensorflow/rawModel/keras)
    * [tf.keras model (separated)](https://github.com/tensorspace-team/tensorspace-converter/tree/master/examples/tensorflow/rawModel/keras_separated)
    * [frozen model](https://github.com/tensorspace-team/tensorspace-converter/tree/master/examples/tensorflow/rawModel/frozen)
    * [saved model](https://github.com/tensorspace-team/tensorspace-converter/tree/master/examples/tensorflow/rawModel/saved)
* [TensorSpace-Converter preprocess scripts](https://github.com/tensorspace-team/tensorspace-converter/blob/master/examples/tensorflow/script)
* [TensorSpace visualization code](https://github.com/tensorspace-team/tensorspace-converter/blob/master/examples/tensorflow/index.html)

## Preprocess

First we will use TensorSpace-Converter to preprocess pre-trained different formats of TensorFlow models.

### tf.keras model

* For a `tf.keras` model, topology and weights can be saved in a HDF5 file `xxx.h5`. Use the following convert script:

```shell
$ tensorspacejs_converter \
      --input_model_from="tensorflow" \
      --input_model_format="tf_keras" \
      --output_layer_names="conv_1,maxpool_1,conv_2,maxpool_2,dense_1,dense_2,softmax" \
      ./rawModel/keras/tf_keras_model.h5 \
      ./convertedModel/layerModel
```

**Note:**

* Set `input_model_from` to be `tensorflow`.
* Set `input_model_format` to be `tf_keras`.
* Set `.h5` file's path to positional argument `input_path`.
* Get out the `tf.keras layer names` of model, and set to `output_layer_names` like `Fig. 1`.
* TensorSpace-Converter will generate preprocessed model into `convertedModel/layerModel` folder, for tutorial propose, we have already generated a model which can be found in [this folder](https://github.com/tensorspace-team/tensorspace-converter/tree/master/examples/tensorflow/convertedModel/layerModel).

### tf.keras (separated)

* For a `tf.keras` model, topology and weights can be saved in separate files, topology file `xxx.json` and weights file `xxx.h5`. Use the following convert script:

```shell
$ tensorspacejs_converter \
      --input_model_from="tensorflow" \
      --input_model_format="tf_keras_separated" \
      --output_layer_names="Conv2D_1,MaxPooling2D_1,Conv2D_2,MaxPooling2D_2,Dense_1,Dense_2,Softmax" \
      ./rawModel/keras_separated/topology.json,./rawModel/keras_separated/weights.h5 \
      ./convertedModel/layerModel
```

**Note:**

* Set `input_model_from` to be `tensorflow`.
* Set `input_model_format` to be `tf_keras_separated`.
* In this case, the model have two input files, merge two file's paths and separate them with comma (`.json` first, `.h5` last), and then set the combined path to positional argument `input_path`.
* Get out the `tf.keras layer names` of model, and set to `output_layer_names` like `Fig. 1`.
* TensorSpace-Converter will generate preprocessed model into `convertedModel/layerModel` folder, for tutorial propose, we have already generated a model which can be found in [this folder](https://github.com/tensorspace-team/tensorspace-converter/tree/master/examples/tensorflow/convertedModel/layerModel).

### frozen model

* For a TensorFlow frozen model. Use the following convert script:

```shell
$ tensorspacejs_converter \
      --input_model_from="tensorflow" \
      --input_model_format="tf_frozen" \
      --output_layer_names="MyConv2D_1,MyMaxPooling2D_1,MyConv2D_2,MyMaxPooling2D_2,MyDense_1,MyDense_2,MySoftMax" \
      ./rawModel/frozen/frozen_model.pb \
      ./convertedModel/graphModel
```

**Note:**

* Set `input_model_from` to be `tensorflow`.
* Set `input_model_format` to be `tf_frozen`.
* Set `.pb` file's path to positional argument `input_path`.
* Get out the `TensorFlow node names`, and set to `output_layer_names` like `Fig. 2`.
* TensorSpace-Converter will generate preprocessed model into `convertedModel/graphModel` folder, for tutorial propose, we have already generated a model which can be found in [this folder](https://github.com/tensorspace-team/tensorspace-converter/tree/master/examples/tensorflow/convertedModel/graphModel).


### saved model

* For a TensorFlow saved model. Use the following convert script:

```shell
$ tensorspacejs_converter \
      --input_model_from="tensorflow" \
      --input_model_format="tf_saved" \
      --output_layer_names="MyConv2D_1,MyMaxPooling2D_1,MyConv2D_2,MyMaxPooling2D_2,MyDense_1,MyDense_2,MySoftMax" \
      ./rawModel/saved \
      ./convertedModel/graphModel
```

**Note:**

* Set `input_model_from` to be `tensorflow`.
* Set `input_model_format` to be `tf_saved`.
* Set saved model's folder path to positional argument `input_path`.
* Get out the `TensorFlow node names` of model, and set to `output_layer_names` like `Fig. 2`.
* TensorSpace-Converter will generate preprocessed model into `convertedModel/graphModel` folder, for tutorial propose, we have already generated a model which can be found in [this folder](https://github.com/tensorspace-team/tensorspace-converter/tree/master/examples/tensorflow/convertedModel/graphModel).


<p align="center">
<img src="./img/output_layer_names.png" alt="layernames" width="100%" >
<br/>
<b>Fig. 1</b> - Set tf.keras layer names to output_layer_names
</p>

<p align="center">
<img src="./img/output_node_names.png" alt="layernames" width="100%" >
<br/>
<b>Fig. 2</b> - Set TensorFlow node names to output_layer_names
</p>

After converting, we shall have the following preprocessed model:
<p align="center">
<img src="./img/tensorflow_created_model.png" alt="models" width="400" >
<br/>
<b>Fig. 3</b> - Preprocessed TensorFlow model
</p>

**Note:**

* There are two types of files created:
  * One `model.json` file,  describe the structure of our model (defined multiple outputs).
  * Some weight files which contains trained weights. The number of weight files is dependent on the size and structure of the given model.

## Load and Visualize

Then Apply TensorSpace API to construct visualization model.
```javascript
let model = new TSP.models.Sequential( modelContainer );

model.add( new TSP.layers.GreyscaleInput() );
model.add( new TSP.layers.Conv2d() );
model.add( new TSP.layers.Pooling2d() );
model.add( new TSP.layers.Conv2d() );
model.add( new TSP.layers.Pooling2d() );
model.add( new TSP.layers.Dense() );
model.add( new TSP.layers.Dense() );
model.add( new TSP.layers.Output1d( {
    outputs: [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ]
} ) );
```

For different kinds of TensorFlow models, configure TensorSpace Loader API in different ways.

For layer model (tf.keras models) generated by TensorSpace-Converter:
```javascript
model.load( {
    type: "tensorflow",
    url: "./convertedModel/layerModel/model.json"
} );
```

For graph model (frozen model or saved model) generated by TensorSpace-Converter, it is required to configure `outputsName`, the same as the node names configured to `output_layer_names` in preprocessing:
```javascript
model.load( {
    type: "tensorflow",
    url: "./convertedModel/graphModel/model.json",
    outputsName: ["MyConv2D_1", "MyMaxPooling2D_1", "MyConv2D_2", "MyMaxPooling2D_2", "MyDense_1", "MyDense_2", "MySoftMax"]
} );
```

Then initialize the TensorSpace visualization model
```javascript
model.init();
```

## Result

If everything goes well, open the `index.html` file in browser, the model will display in the browser:
<p align="center">
<img src="./img/data5.jpg" alt="prediction" width="100%" >
<br/>
<b>Fig. 4</b> - TensorSpace LeNet with prediction data "5"
</p>