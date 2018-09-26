import tensorflow as tf
mnist = tf.keras.datasets.mnist

with tf.Session(graph=tf.Graph()) as sess:
    dir_path = './saved_models/0925-yolov2-tiny-ckpt/'
    ckpt_name = 'model.ckpt'
    saver = tf.train.import_meta_graph(dir_path + ckpt_name + '.meta')
    saver.restore(sess, tf.train.latest_checkpoint(dir_path))

    # for n in tf.get_default_graph().as_graph_def().node:
    #     print(n.name)

    graph = tf.get_default_graph()

    # Pick some input as input
    x = graph.get_tensor_by_name("input/Placeholder:0")
    # Pick some output as output
    add_8 = graph.get_tensor_by_name("add_8:0")

    tf.saved_model.simple_save(
        sess, './saved_models/0925-yolov2-tiny-saved-model/',
        {"input":x},
        {"output":add_8}
    )