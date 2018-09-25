import tensorflow as tf
import numpy as np
from tensorflow.python.saved_model import tag_constants
mnist = tf.keras.datasets.mnist

(x_train, y_train),(x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

# Reshape input size
x_train = x_train.reshape((-1, 28, 28, 1)).astype(np.float32)
x_test = x_test.reshape((-1, 28, 28, 1)).astype(np.float32)
print(type(x_train))
print(x_train.shape)
print(x_test.shape)

x_train = np.pad(x_train, ((0,0), (2,2), (2,2), (0,0)), 'constant')
x_test = np.pad(x_test, ((0,0), (2,2), (2,2), (0,0)), 'constant')
print(x_train.shape)
print(x_test.shape)

with tf.Session(graph=tf.Graph()) as sess:
    tf.saved_model.loader.load(
        sess,
        [tag_constants.SERVING],
        '../models/tensorflow_model',
    )
    # for n in tf.get_default_graph().as_graph_def().node:
    #     print(n.name)

    graph = tf.get_default_graph()

    x = graph.get_tensor_by_name("MyInput:0")
    # relu_2 = graph.get_tensor_by_name("Relu_2:0")
    # l = graph.get_tensor_by_name("add_4:0")

    output_names = ["MyConv2D_1", "MyMaxPooling2D_1", "MyConv2D_2", "MyMaxPooling2D_2",
                    "MyDense_1", "MyDense_2", "MySoftMax"]

    outputs = list(map(lambda on: graph.get_tensor_by_name(on+":0"), output_names))

    print(sess.run(outputs, feed_dict={x:x_test}))