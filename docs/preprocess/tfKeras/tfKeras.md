## Preprocessing a tf.keras Model

In this chapter, we will introduce how to preprocess a tf.keras model to adapt the multiple intermediate layer outputs for applying TensorSpace.

If you are new and have no idea about how to train a ML model with tf.keras, we highly recommand you to go through this [guide](https://www.tensorflow.org/guide/keras) from TensorFlow first.

To preprocess a tf.keras model, make sure you satisfy the followings:
* [1. Train/Load model](#loadModel)
* [2. Insert multiple intermediate outputs](#addOutputs)
* [3. Save encapsulated model](#saveModel)
* [4. Convert to TensorFlow.js model](#convertModel)

The following instruction preprocesses a LeNet with MNIST dataset as an example.

### <div id="loadModel">1 Train/Load Model</div>
#### 1.1 Train a new model
Let's train a simple LeNet model to recognize MNIST handwritten digit, if you don't have your model trained yet.

It is almost the same as the [tutorial](https://www.tensorflow.org/guide/keras) from TensorFlow.

**Note:** 
* We add a **"name"** property for each layers that we want to apply for TensorSapce API later.
```python
def create_sequential_model():
    single_output_model = tf.keras.models.Sequential([
            tf.keras.layers.InputLayer(input_shape=(28, 28)),
            tf.keras.layers.Reshape((28, 28, 1), input_shape=(28, 28,)),
            tf.keras.layers.Convolution2D(
                filters=6, kernel_size=5, strides=1, input_shape=(28, 28, 1), name="conv_1"
            ),
            tf.keras.layers.MaxPool2D(
                pool_size=(2, 2), strides=(2, 2), name="maxpool_1"
            ),
            tf.keras.layers.Convolution2D(
                filters=16, kernel_size=5, strides=1, name="conv_2"
            ),
            tf.keras.layers.MaxPool2D(
                pool_size=(2, 2), strides=(2, 2), name="maxpool_2"
            ),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(120, activation=tf.nn.relu, name="dense_1"),
            tf.keras.layers.Dense(84, activation=tf.nn.relu, name="dense_2"),
            tf.keras.layers.Dense(10, activation=tf.nn.softmax, name="softmax")
        ])
    return single_output_model
```

After construction, we can compile and train the model with MNIST data:
```python
mnist = tf.keras.datasets.mnist
(x_train, y_train),(x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

model.fit(x_train, y_train, epochs=5)
```

#### 1.2 Load from an existed model
For an existed model, we can load the model as:
```python
model = tf.keras.models.load_model(
    "PATH_TO_MODEL/model.h5",
    custom_objects=None,
    compile=True
)
```
Or if the model and weights are stored separately, we can load as:
```python
json_path = "PATH_TO_JSON/model.json"
weight_path = "PATH_TO_WEIGHT/weights.hdf5"
structure = open(json_path, "r")
model = tf.keras.models.model_from_json(
    structure
)
model.load_weights(weight_path)
```

After training/loading properly, we can give it a try by:
```python
input_sample = np.ndarray(shape=(28,28), buffer=np.random.rand(28,28))
input_sample = np.expand_dims(input_sample, axis=0)
print(model.predict(input_sample))
```
Then we have a single array with 10 probabilities.

<img src="https://github.com/zchholmes/tsp_image/blob/master/tf_keras/tf_keras_predict_1.png" alt="predict output 1" width="705" >

**Note:** 
* The output is random in the example above.

### <div id="addOutputs">2 Insert multiple intermediate outputs</div>
If the output from the previous step is correct, we can find the output is actually a single array(softmax result) predicted by the model. The array represents the probability of each digits that the input image could be.

One important purpose of TensorSpace is to show the internal relations among different layers, so we need to find the way to catch the outputs from intermediate layers during the prediction.

First, we can use summary() command to check the general structure. We can also loop all the layers to find out all layer names.
```
model.summary()
for l in model.layers:
     print(l.name)
```
<img src="https://github.com/zchholmes/tsp_image/blob/master/tf_keras/tf_keras_summary.png" alt="summary" width="705" >
	
If the layers are given proper names (add "name" property), we can find them from the summary.

**Note:** 
* If the model is loaded from an existed model, the name of each layer should be relevant to the layer class in most cases.

Now, let's put our desired layer names in a list and encapsulate the model with the original input and the new outputs:
```python
output_layer_names = [
    "conv_1", "maxpool_1", "conv_2", "maxpool_2", 
    "dense_1", "dense_2", "softmax"
]
def generate_encapsulate_model_with_output_layer_names(model, output_layer_names):
    display_model = tf.keras.models.Model(
        inputs=model.input,
        outputs=list(map(lambda oln: model.get_layer(oln).output, output_layer_names))
    )
    return display_model
```

Or if we want them all, just use:
```python
def generate_encapsulate_model(model):
    display_model = tf.keras.models.Model(
        inputs=model.input,
        # ignore 1st layer (input), since some old models do not have 1st layer as tf.layer
        outputs=list(map(lambda layer: layer.output, model.layers[1:]))
    )
    return display_model
```
**Note:** 
* Do not include the input or input_layer, the model constructed from Model() could use an input tensor instead of an inputLayer, which causes errors.
* Double check the layers you included.

Then we have our model with multiple intermediate outputs:
```python
enc_model = generate_encapsulate_model_with_output_layer_names(model, output_layer_names)
# OR
# enc_model = generate_encapsulate_model(model)
```

Now, we can try to predict by the new model:
```python
print(enc_model.predict(input_sample))
```
<img src="https://github.com/zchholmes/tsp_image/blob/master/tf_keras/tf_keras_predict_2.png" alt="predict output 2" width="705" >

And we can see the last output is the same as the one from the prediction of the original model.

<img src="https://github.com/zchholmes/tsp_image/blob/master/tf_keras/tf_keras_predict_3.png" alt="predict output 3" width="705" >

You can see the output now is a list which contains all outputs from selected layers.

### <div id="saveModel">3 Save encapsulated model</div>

Next, let's dump out the encapsulated model.

**Note:** 
* It is required to compile encapsulated model first, though the configurations used for compile will not affect the model. 
* Since we use the model for visualization, we do not use the model for further training. 
* If you want to continue with the encapsulated model, feel free to put proper configurations. Here, we just use "adam" and "sparse_categorical_crossentropy" as an example.
```Python
enc_model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
tf.keras.models.save_model(
    gen_dis_model,
    "/PATH_TO_NEW_MODEL/enc_model.h5",
    overwrite=True
)
```

### <div id="convertModel">4 Convert to TensorFlow.js model</div>
Last, let's convert our multiple output model into a TensorFlow.js compatable model by [tfjs-converter](https://github.com/tensorflow/tfjs-converter).

The tfjs-converter should be used by the following script:
```shell
tensorflowjs_converter \
    --input_format=keras \
    ../models/enc_tf_keras_model.h5 \
    ../models/json_models/tf_keras
```
<img src="https://github.com/zchholmes/tsp_image/blob/master/tf_keras/tf_keras_models.png" alt="models" width="705" >

**Note:**
* There are two types of file generated:
    * One "model.json" file which describe the structure of our model (defined multiple outputs)
    * Some weight files which contains trained weights. The number of weight files is dependent on the size and structure of the given model.
* By default, the structure file has the name "model.json" which you **can** modify later.
* The weight files are named like "group1-shard1of1" which are used and written within the "model.json" file. Hence we **DO NOT** suggest to modify the name of weight files, unless really necessary. If you really want to modify them, please modify the content in the .json (i.e. "model.json") as well.
* For more detailed information about tfjs-converter, you can visit [here](https://github.com/tensorflow/tfjs-converter).

If everything looks good, you shall be ready for the next step - "2. Apply TensorSpace API from the model structure".

For your reference, you can find the source files of the examples from [here](https://github.com/syt123450/tensorspace/tree/master/documentation/preprocess/tfKeras), which includes:
* [tf_keras_model.py](https://github.com/syt123450/tensorspace/blob/master/documentation/preprocess/tfKeras/tf_keras_model.py)
* [convert_tf_keras.sh](https://github.com/syt123450/tensorspace/blob/master/documentation/preprocess/tfKeras/convert_tf_keras.sh)
* [All model files](https://github.com/syt123450/tensorspace/tree/master/documentation/preprocess/tfKeras/models)
