import tensorflow as tf
import numpy as np
from keras.models import Sequential, Model, load_model
from keras.layers import Dense, Input, InputLayer, Conv2D, MaxPooling2D, Reshape, Flatten

mnist = tf.keras.datasets.mnist


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


def train_model():
    (x_train, y_train), (x_test, y_test) = mnist.load_data()
    x_train, x_test = x_train / 255.0, x_test / 255.0

    model = create_sequential_model()
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])

    model.fit(x_train, y_train, epochs=5, batch_size=32)
    return model


def save_model(model, name_path):
    model.save(name_path)


model = train_model()
save_model(model, "../models/keras_model.h5")
