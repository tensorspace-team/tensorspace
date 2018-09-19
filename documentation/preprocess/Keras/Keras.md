
## Preprocessing a Keras Model
 
In this chapter, we will introduce how to preprocess a Keras model to satisfy the requirement of multiple intermediate outputs for applying TensorSpace.

If you are new on training a ML model by Keras, we highly recommand you to read the [guide](https://keras.io/#getting-started-30-seconds-to-keras) from [Keras](https://keras.io/) first.

To preprocess a Keras model, we have the following steps:
* [1. Train/Load model](#loadModel)
* [2. Insert multiple intermediate outputs](#addOutputs)
* [3. Save encapsulated model](#saveModel)
* [4. Convert to TensorFlow.js model](#convertModel)
 
In the tutorial, we try to preprocess a Keras model of LeNet with MNIST dataset as an example.

### <div id="loadModel">1 Train/Load Model</div>
#### 1.1 Train a new model
If you don't have your model trained yet or not sure how to generate a proper model for TensorSpace from a scratch, let's train a model together~

**Note:**
 * We add the "name" property for each layers that we want to apply TensorSpace.
 * The [Guide](https://keras.io/#getting-started-30-seconds-to-keras) from Keras can help you learn how to use the Keras library for more details.
 
We can generate a LeNet model as the following:
````Python
def create_sequential_model():
    single_output_model = Sequential([
        InputLayer(input_shape=(28, 28)),
        Reshape((28,28,1),input_shape=(28,28,)),
        Conv2D(filters=6, kernel_size=5, strides=1, input_shape=(28, 28, 1), name="Conv2D_1"),
        MaxPooling2D(pool_size=(2, 2), strides=(2, 2), name="MaxPooling2D_1"),
        Conv2D(filters=16, kernel_size=5, strides=1, name="Conv2D_2"),
        MaxPooling2D(pool_size=(2, 2), strides=(2, 2), name="MaxPooling2D_2"),
        Flatten(),
        Dense(120, activation="relu", name="Dense_1"),
        Dense(84, activation="relu", name="Dense_2"),
        Dense(10, activation="softmax", name="Softmax")
    ])
    return single_output_model
````
 
After constructing the structure, we compile and train with the MNIST dataset.
````Python
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

model.fit(x_train, y_train, epochs=5, batch_size=32)
````
 
#### 1.2 Load an existed model 
If you have already had a model in hand, let's load the model:
````Python
model = load_model("/PATH/TO/Keras/model.h5")
````

Or if the model and weights are stored separately, we can load as:
````Python
json_path = "PATH_TO_JSON/model.json"
weight_path = "PATH_TO_WEIGHT/weights.hdf5"
structure = open(json_path, "r")
model = model_from_json(
    structure
    )
model.load_weights(weight_path)
````

After training/loading a model, we should have a "model" which contains the structure and weights of the network.
We can try to predict a result from a random generated input:
````Python
input_sample = np.ndarray(shape=(28,28), buffer=np.random.rand(28,28))
input_sample = np.expand_dims(input_sample, axis=0)
print(model.predict(input_sample))
````

And then we get the probabilities predicted by the model.
<img src="https://github.com/zchholmes/tsp_image/blob/master/Keras/Keras_predict_1.png" alt="predict output 1" width="705" >

### <div id="addOutputs">2 Insert multiple intermediate outputs</div>
We can observe that the output from predicting an input is a single array (softmax result). Each value of the array represents the probability of the corresponding digit that the input image could be.

Since TensorSpace presents the relations among different layers, which show the outputs from intermediate layers, we need to collect necessary output data for TensorSpace to "draw" on the visualization model.

First, we can use the "summary()" function to check the layer information. We can also loop all layer names.
````Python
model.summary()
for l in model.layers:
     print(l.name)
````
<img src="https://github.com/zchholmes/tsp_image/blob/master/Keras/Keras_summary.png" alt="summary and layers" width="705" >

**Note:**
 * If a "name" property is set for a layer, we can see the name from "summary()".
 * If a model is loaded from an existed model, the layer name is related to the class names in most cases.
 
Based on the summary, we can learn the general structure of a LeNet: 
````TBD
INSERT Image Like:
input -> (Conv2D + MaxPooling) x2 -> Dense x3
````

Let's pick up the layers we want to present by TensorSpace and encapsulate a new model with the desired outputs:
````Python
output_layer_names = [
    "Conv2D_1", "MaxPooling2D_1", "Conv2D_2", "MaxPooling2D_2", 
    "Dense_1", "Dense_2", "Softmax"
]
def generate_encapsulate_model_with_output_layer_names(model, output_layer_names):
    enc_model = Model(
        inputs=model.input,
        outputs=list(map(lambda oln: model.get_layer(oln).output, output_layer_names))
    )
    return enc_model
````

Or if we want them all, we can do like:
````Python
def generate_encapsulate_model(model):
    enc_model = Model(
        inputs=model.input,
        # ignore 1st layer (input), since some old models do not have 1st layer as Keras layer
        outputs=list(map(lambda layer: layer.output, model.layers[1:]))
    )
    return enc_model
````

**Note:**
 * Do not include the "input" or "input_layer", since if the model is constructed by using "Model()", it is possible to have the input as an tensor (np array) instead of an actual Keras layer.
 * Double check the layers you want, make sure you put them in a proper order.
 
Then we can generate our encapsulated model which contains multiple intermediate outputs:
````Python
enc_model = generate_encapsulate_model_with_output_layer_names(model, output_layer_names)
# OR
# enc_model = generate_encapsulate_model(model)
````

We can try to predict an input sample with the encapsulated model:
````Python
print(enc_model.predict(input_sample))
````

The output is a list which contains all output data of the layers we selected.
<img src="https://github.com/zchholmes/tsp_image/blob/master/Keras/Keras_predict_2.png" alt="predict output 2" width="705" >

The last output is the same as the one we predicted from the original model
<img src="https://github.com/zchholmes/tsp_image/blob/master/Keras/Keras_predict_3.png" alt="predict output 3" width="705" >

### <div id="saveModel">3 Save encapsulated model</div>
For further convertion, we have to save the encapsulate model.

**Note:**
 * For Keras, we don't need to compile the encapsulate model as long as we don't further train the model. So don't worry too much about the arisen warning about model compiling
 * If you want to continue with the encapsulated model, feel free to put proper configurations. Here, we just use "adam" and "sparse_categorical_crossentropy" as an example.
````Python
enc_model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
save_model(enc_model, "/PATH_TO_NEW_MODEL/enc_model.h5")
````

### <div id="convertModel">4 Convert to TensorFlow.js model</div>
The last step is to convert the Keras model which contains multiple intermediate outputs to a TensorFlow.js compatible model by [tfjs-converter](https://github.com/tensorflow/tfjs-converter)

The tfjs-converter can be used like:
````shell
tensorflowjs_converter \
    --input_format=keras \
    ../models/enc_keras_model.h5 \
    ../models/json_models/keras
````
<img src="https://github.com/zchholmes/tsp_image/blob/master/Keras/Keras_models.png" alt="tfjs models" width="705" >

**Note:**
* There are two types of file generated:
    * One "model.json" file which describe the structure of our model (defined multiple outputs)
    * Some weight files which contains trained weights. The number of weight files is dependent on the size and structure of the given model.
* By default, the structure file has the name "model.json" which you **can** modify later.
* The weight files are named like "group1-shard1of1" which are used and written within the "model.json" file. Hence we **DO NOT** suggest to modify the name of weight files, unless really necessary. If you really want to modify them, please modify the content in the .json (i.e. "model.json") as well.
* For more detailed information about tfjs-converter, you can visit [here](https://github.com/tensorflow/tfjs-converter).

If everything looks good, you shall be ready for the next step - "2. Apply TensorSpace API from the model structure".

For your reference, you can find the source files of the examples from [here](https://github.com/syt123450/tensorspace/tree/master/documentation/preprocess/Keras), which includes:
* [keras_model.py](https://github.com/syt123450/tensorspace/blob/master/documentation/preprocess/Keras/keras_model.py)
* [convert_keras.sh](https://github.com/syt123450/tensorspace/blob/master/documentation/preprocess/Keras/convert_keras.sh)
* [All model files](https://github.com/syt123450/tensorspace/tree/master/documentation/preprocess/Keras/models)
