import tensorflow as tf
import numpy as np
from keras.models import Sequential, Model
from keras.layers import Dense, Input, InputLayer, Conv2D, MaxPooling2D, Reshape, Flatten
from keras.models import load_model

mnist = tf.keras.datasets.mnist

(x_train, y_train),(x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

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

def create_model():
    input_tensor = Input(shape=(28, 28))
    reshape_layer = Reshape((28, 28, 1), input_shape=(28, 28,))(input_tensor)

    conv2D_layer_1 = Conv2D(filters=6, kernel_size=5, strides=1, input_shape=(28, 28, 1))(reshape_layer)
    maxpool2D_layer_1 = MaxPooling2D(pool_size=(2, 2), strides=(2, 2))(conv2D_layer_1)

    conv2D_layer_2 = Conv2D(filters=16, kernel_size=5, strides=1)(maxpool2D_layer_1)
    maxpool2D_layer_2 = MaxPooling2D(pool_size=(2, 2), strides=(2, 2))(conv2D_layer_2)

    flatten_layer = Flatten()(maxpool2D_layer_2)
    dense_layer_1 = Dense(120, activation="relu")(flatten_layer)
    dense_layer_2 = Dense(84, activation="relu")(dense_layer_1)
    dense_layer_3 = Dense(10, activation="softmax")(dense_layer_2)

    classic_model =Model(
        inputs=input_tensor,
        outputs=dense_layer_3
    )
    return classic_model

def train_model():
    (x_train, y_train), (x_test, y_test) = mnist.load_data()
    x_train, x_test = x_train / 255.0, x_test / 255.0

    model = create_sequential_model()
    # model = create_model()

    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])

    model.fit(x_train, y_train, epochs=5, batch_size=32)
    # model.evaluate(x_test, y_test)
    return model


def save_model(model, name_path):
    model.save(name_path)

def load_from_model(name_path):
    model = load_model(name_path)
    # Load model from json+weights
    # from keras.models import model_from_json
    # json_path = "./saved_models/gan/generator.json"
    # weight_path = "./saved_models/gan/generator_weights.hdf5"
    #
    # structure = open(json_path, "r")
    # model = model_from_json(
    #     structure
    # )
    # model.load_weights(weight_path)
    return model

def generate_encapsulate_model_with_output_layer_names(model, output_layer_names):
    enc_model = Model(
        inputs=model.input,
        outputs=list(map(lambda oln: model.get_layer(oln).output, output_layer_names))
    )
    return enc_model

def generate_encapsulate_model(model):
    enc_model = Model(
        inputs=model.input,
        # ignore 1st layer (input), since some old models do not have 1st layer as Keras layer
        outputs=list(map(lambda layer: layer.output, model.layers[1:]))
    )
    return enc_model


# model = train_model()
# save_model(model, "../models/keras_model.h5")
model = load_from_model("../models/keras_model.h5")
# model = load_from_model("../models/enc_keras_model.h5")

input_sample = np.ndarray(shape=(28,28), buffer=np.random.rand(28,28))
input_sample = np.expand_dims(input_sample, axis=0)
print(model.predict(input_sample))

# model.summary()
#
# for l in model.layers:
#     print(l.name)

output_layer_names = ["Conv2D_1", "MaxPooling2D_1", "Conv2D_2", "MaxPooling2D_2", "Dense_1", "Dense_2", "Softmax"]

# enc_model = generate_encapsulate_model_with_output_layer_names(model, output_layer_names)
# enc_model = generate_encapsulate_model(model)

# print(enc_model.predict(input_sample))

# enc_model.compile(optimizer='adam',
#               loss='sparse_categorical_crossentropy',
#               metrics=['accuracy'])
# save_model(enc_model, "../models/enc_keras_model.h5")
