import tensorflow as tf
import numpy as np
mnist = tf.keras.datasets.mnist

def create_sequential_model():
    single_output_model = tf.keras.models.Sequential([
            tf.keras.layers.InputLayer(input_shape=(28, 28)),
            tf.keras.layers.Reshape((28, 28, 1), input_shape=(28, 28,)),
            tf.keras.layers.Convolution2D(filters=6, kernel_size=5, strides=1, input_shape=(28, 28, 1), name="conv_1"),
            tf.keras.layers.MaxPool2D(pool_size=(2, 2), strides=(2, 2), name="maxpool_1"),
            tf.keras.layers.Convolution2D(filters=16, kernel_size=5, strides=1, name="conv_2"),
            tf.keras.layers.MaxPool2D(pool_size=(2, 2), strides=(2, 2), name="maxpool_2"),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(120, activation=tf.nn.relu, name="dense_1"),
            tf.keras.layers.Dense(84, activation=tf.nn.relu, name="dense_2"),
            tf.keras.layers.Dense(10, activation=tf.nn.softmax, name="softmax")
        ])

    return single_output_model


def create_model():
    input_tensor = tf.keras.layers.Input(shape=(28, 28))
    reshape_layer = tf.keras.layers.Reshape((28, 28, 1), input_shape=(28, 28,))(input_tensor)

    conv2D_layer_1 = tf.keras.layers.Convolution2D(filters=6, kernel_size=5, strides=1, input_shape=(28, 28, 1))(reshape_layer)
    maxpool2D_layer_1 = tf.keras.layers.MaxPool2D(pool_size=(2, 2), strides=(2, 2))(conv2D_layer_1)

    conv2D_layer_2 = tf.keras.layers.Convolution2D(filters=16, kernel_size=5, strides=1)(maxpool2D_layer_1)
    maxpool2D_layer_2 = tf.keras.layers.MaxPool2D(pool_size=(2, 2), strides=(2, 2))(conv2D_layer_2)

    flatten_layer = tf.keras.layers.Flatten()(maxpool2D_layer_2)
    dense_layer_1 = tf.keras.layers.Dense(120, activation=tf.nn.relu)(flatten_layer)
    dense_layer_2 = tf.keras.layers.Dense(84, activation=tf.nn.relu)(dense_layer_1)
    dense_layer_3 = tf.keras.layers.Dense(10, activation=tf.nn.softmax)(dense_layer_2)

    classic_model = tf.keras.models.Model(
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

    model.fit(x_train, y_train, epochs=5)
    # model.evaluate(x_test, y_test)
    return model

def save_model(model, name_path):
    tf.keras.models.save_model(
        model,
        name_path,
        overwrite=True,
        include_optimizer=True
    )

def load_model(name_path):
    # Load model from .h5 file
    model = tf.keras.models.load_model(
        name_path,
        custom_objects=None,
        compile=True
    )
    # Load model from json+weights
    # json_path = "./saved_models/gan/generator.json"
    # weight_path = "./saved_models/gan/generator_weights.hdf5"
    #
    # structure = open(json_path, "r")
    # model = tf.keras.models.model_from_json(
    #     structure
    # )
    # model.load_weights(weight_path)
    return model

def generate_encapsulate_model_with_output_layer_names(model, output_layer_names):
    display_model = tf.keras.models.Model(
        inputs=model.input,
        outputs=list(map(lambda oln: model.get_layer(oln).output, output_layer_names))
    )
    return display_model

def generate_encapsulate_model(model):
    display_model = tf.keras.models.Model(
        inputs=model.input,
        # ignore 1st layer (input), since some old models do not have 1st layer as tf.layer
        outputs=list(map(lambda layer: layer.output, model.layers[1:]))
    )
    return display_model


# model = train_model()
# save_model(model, "../models/tf_keras_model.h5")
model = load_model("../models/tf_keras_model.h5")
# model = load_model("../models/enc_tf_keras_model.h5")

# input_sample = np.ndarray(shape=(28,28), buffer=np.random.rand(28,28))
# input_sample = np.expand_dims(input_sample, axis=0)
# print(model.predict(input_sample))

# model.summary()
#
# for l in model.layers:
#     print(l.name)

output_layer_names = ["conv_1", "maxpool_1", "conv_2", "maxpool_2", "dense_1", "dense_2", "softmax"]

enc_model = generate_encapsulate_model_with_output_layer_names(model, output_layer_names)
# enc_model = generate_encapsulate_model(model)

# print(enc_model.predict(input_sample))

enc_model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
save_model(enc_model, "../models/enc_tf_keras_model.h5")
