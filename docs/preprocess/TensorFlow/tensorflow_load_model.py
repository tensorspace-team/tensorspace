import tensorflow as tf
import numpy as np
from tensorflow.python.saved_model import tag_constants
from tensorflow.python.platform import gfile
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


def load_from_sm():
    with tf.Session(graph=tf.Graph()) as sess:
        tf.saved_model.loader.load(
            sess,
            [tag_constants.SERVING],
            '/PATH/TO/MODEL/DIR/saved_model',
        )

        graph = tf.get_default_graph()
        check_prediction(graph)



def load_from_fm():
    with tf.Session() as sess:
        model_filename ='/PATH/TO/PB/model.pb'
        with gfile.FastGFile(model_filename, 'rb') as f:
            graph_def = tf.GraphDef()
            graph_def.ParseFromString(f.read())
            g_in = tf.import_graph_def(graph_def)
            check_prediction(sess.graph)

            graph = tf.get_default_graph()
            check_prediction(graph)



def load_from_ckpt():
    with tf.Session(graph=tf.Graph()) as sess:
        dir_path = '/PATH/TO/DIR/tensorflow_model_ckpt/'
        ckpt_name = 'lenet.ckpt'
        saver = tf.train.import_meta_graph(dir_path + ckpt_name + '.meta')
        saver.restore(sess, tf.train.latest_checkpoint(dir_path))

        graph = tf.get_default_graph()
        check_prediction(graph)


def check_prediction(graph):
    # for n in tf.get_default_graph().as_graph_def().node:
    #     print(n.name)

    x = graph.get_tensor_by_name("MyInput:0")

    output_names = ["MyConv2D_1", "MyMaxPooling2D_1", "MyConv2D_2", "MyMaxPooling2D_2",
                    "MyDense_1", "MyDense_2", "MySoftMax"]

    outputs = list(map(lambda on: graph.get_tensor_by_name(on+":0"), output_names))

    print(sess.run(outputs, feed_dict={x:x_test}))
