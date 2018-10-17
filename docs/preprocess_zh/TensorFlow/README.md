<p align="center">
<img width=400 src="https://github.com/zchholmes/tsp_image/blob/master/Logos/tensorflow.png">
</p>

## TensorFlow 模型预处理

本篇将介绍如何预处理基于 TensorFlow 搭建的神经网络模型 (saved model, frozen model and checkpoint)，以此来适配 TensorSpace 所需要的拥有中间层输出的模型。

以下为本篇教程所使用的代码及模型文件：
* [tensorflow_create_model.py](https://github.com/syt123450/tensorspace/blob/master/docs/preprocess/TensorFlow/src_py/tensorflow_create_model.py)
* [tensorflow_load_model.py](https://github.com/syt123450/tensorspace/blob/master/docs/preprocess/TensorFlow/src_py/tensorflow_load_model.py)
* [tensorflow_conversion.py](https://github.com/syt123450/tensorspace/blob/master/docs/preprocess/TensorFlow/src_py/tensorflow_conversion.py)
* [convert_tensorflow_saved_model.sh](https://github.com/syt123450/tensorspace/blob/master/docs/preprocess/TensorFlow/src_sh/convert_tensorflow_saved_model.sh)
* [convert_tensorflow_frozen_model.sh](https://github.com/syt123450/tensorspace/blob/master/docs/preprocess/TensorFlow/src_sh/convert_tensorflow_frozen_model.sh)
* [模型](https://github.com/syt123450/tensorspace/tree/master/docs/preprocess/TensorFlow/models)

在教程中我们将使用：Python 3.6.5 的运行环境。以下为我们所需要使用的库：
```Python
import tensorflow as tf
import numpy as np
from tensorflow.contrib.layers import flatten
from sklearn.utils import shuffle
mnist = tf.keras.datasets.mnist
```
**注意:**
* `tensorflow` 与 `numpy` 是最重要的核心库。
* `tf.keras` 只用来提供训练所需要的数据集。
* `sklearn.utils` 只用来提供 `shuffle`。

此外，我们还需要安装 [tfjs-converter](https://github.com/tensorflow/tfjs-converter)(基于 TensorFlow.js 的转换工具):
```shell
$ pip install tensorflowjs
```

安装完成后，`tensorflowjs_converter`成为系统可用关键字，可用下列命令来调用

```shell
$ tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_node_names=$onn \
    --saved_model_tags=serve \
    ../models/tensorflow_model \
    ../models/json_models/tensorflow
```

预处理 TensorFlow 模型大致上分为以下几个步骤：

<p align="center" verticle-align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/TensorFlow/TensorFlow_general_process_zh.png" alt="general TF process" width="830" >
<br/>
<b>Fig. 1</b> - 预处理 TensorSpace 模型的步骤
</p>

* [1 训练/加载模型](#loadModel)
* [2 找出中间层 tensor 名称](#findNames)
* [3 转换为 TensorSpace 适配的模型](#convertModel)

与预处理 Keras 和 tf.keras 模型不同的是，我们不需要额外生成包含中间层输出的嵌入后模型。我们只需要提取我们所需要的中间层 tensor 名称（**tensor names**），然后进行模型格式转换。

**注意:**
* 在 TensorSpace 中，所收集的 tensor 名称将保存于 **"outputNames"** 之中。

### <div id="loadModel">1 训练/加载模型</div>
#### 1.1 训练模型
如果您目前还没有可以马上使用的TensorFlow模型，您可以按照本小节的方法构筑一个新的样例模型。

我们将使用 MNIST 数据集以及 LeNet 网络结构为例，使用 TensorFlow 来构建一个神经网络模型。（参考 [sujaybabruwad/LeNet-in-Tensorflow](https://github.com/zchholmes/tsp_image/blob/master/General/intro_preprocess_s_zh.png)）

首先，我们需要改变训练数据的形状：
```Python
# Raw input & normalization
(x_train, y_train),(x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

# Match dimensions
x_train = x_train.reshape((-1, 28, 28, 1)).astype(np.float32)
x_test = x_test.reshape((-1, 28, 28, 1)).astype(np.float32)

# Add padding to 32x32
x_train = np.pad(x_train, ((0,0), (2,2), (2,2), (0,0)), 'constant')
x_test = np.pad(x_test, ((0,0), (2,2), (2,2), (0,0)), 'constant')
```

接下来，我们根据 LeNet_v5 的网络结构来构筑基本模型：
<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/General/LeNet_Structure.png" alt="LeNet structure" width="175" >
<br/>
<b>图2</b> - LeNet 网络结构
</p>

我们的网络包括：2个 Conv2D + MaxPooling 的组合，紧接着3层 Dense：
```Python
def LeNet_5(x):
    # Convolutional Layer. Input = 32x32x1, Output = 28x28x1.
    conv1_w = tf.Variable(
        tf.truncated_normal(
            shape=[5, 5, 1, 6], mean=0, stddev=0.1))
    conv1_b = tf.Variable(tf.zeros(6))
    conv1 = tf.nn.conv2d(
        x, conv1_w, strides=[1, 1, 1, 1], padding='VALID') + conv1_b
    conv1 = tf.nn.relu(conv1, name="MyConv2D_1")

    # Pooling Layer. Input = 28x28x1. Output = 14x14x6.
    pool_1 = tf.nn.max_pool(
        conv1, ksize=[1, 2, 2, 1], 
        strides=[1, 2, 2, 1], padding='VALID', 
        name="MyMaxPooling2D_1")

    # Convolutional. Output = 10x10x16.
    conv2_w = tf.Variable(
        tf.truncated_normal(
            shape=[5, 5, 6, 16], mean=0, stddev=0.1))
    conv2_b = tf.Variable(tf.zeros(16))
    conv2 = tf.nn.conv2d(
        pool_1, conv2_w, strides=[1, 1, 1, 1], padding='VALID') + conv2_b
    conv2 = tf.nn.relu(conv2, name="MyConv2D_2")

    # Pooling. Input = 10x10x16. Output = 5x5x16.
    pool_2 = tf.nn.max_pool(
        conv2, ksize=[1, 2, 2, 1], 
        strides=[1, 2, 2, 1], padding='VALID', 
        name="MyMaxPooling2D_2")

    # Flatten. Input = 5x5x16. Output = 400.
    fc1 = flatten(pool_2)

    # Fully Connected. Input = 400. Output = 120.
    fc1_w = tf.Variable(
        tf.truncated_normal(
            shape=(400, 120), mean=0, stddev=0.1))
    fc1_b = tf.Variable(tf.zeros(120))
    fc1 = tf.matmul(fc1, fc1_w) + fc1_b

    # Activation.
    fc1 = tf.nn.relu(fc1, name="MyDense_1")

    # Fully Connected. Input = 120. Output = 84.
    fc2_w = tf.Variable(
        tf.truncated_normal(
            shape=(120, 84), mean=0, stddev=0.1))
    fc2_b = tf.Variable(tf.zeros(84))
    fc2 = tf.matmul(fc1, fc2_w) + fc2_b
    # Activation.
    fc2 = tf.nn.relu(fc2, name="MyDense_2")

    # Fully Connected. Input = 84. Output = 10.
    fc3_w = tf.Variable(
        tf.truncated_normal(
            shape=(84, 10), mean=0, stddev=0.1))
    fc3_b = tf.Variable(tf.zeros(10))
    logits = tf.matmul(fc2, fc3_w) + fc3_b
    return logits
```
**注意:**
* 我们建议为之后我们需要应用 TensorSpace 的 tensor 添加 **"name"** 属性。这将为我们之后寻找指定 tensor 、生成 **"outputNames"** 的过程提供极大的便利。
* 您可能注意到了：我们并没有将“正确的”名称添加到“正确的” tensor 内。例如：我们没有为 `tf.nn.conv2d` 标记名称为 **"MyConv2D_*"**。我们将 `tf.nn.relu` 标记为 **"MyConv2D_*"**。其中的理由是因为实际使用中，我们所希望得到的卷基层输出是来源于最终的激励函数，而并非之前真正实施卷积操作的卷基层。这将为我们提供更好的可视化效果。
* 我们只添加了两层 Dense。因为最后的一层 Softmax Dense 将用于之后的训练，所以我们会对其进行不同的处理。

在搭建完网络结构之后，我们就可以来训练我们的模型了：
```Python
x = tf.placeholder(tf.float32, shape=[None,32,32,1],name="MyInput")
y = tf.placeholder(tf.int32, (None), name="y")
one_hot_y = tf.one_hot(y, 10)

#Invoke LeNet function by passing features
logits = LeNet_5(x)

# All kinds different operations
#Softmax with cost function implementation
cross_entropy \
    = tf.nn.softmax_cross_entropy_with_logits_v2(labels=one_hot_y, logits=logits)
loss_operation = tf.reduce_mean(cross_entropy)

optimizer = tf.train.AdamOptimizer(learning_rate=0.001)
training_operation = optimizer.minimize(loss_operation)

correct_prediction = tf.equal(tf.argmax(logits, 1), tf.argmax(one_hot_y, 1))
accuracy_operation = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

# Declare an actual output without training label dependence
predict_outputs = tf.nn.softmax(logits, name="MySoftMax")

EPOCHS = 5
BATCH_SIZE = 128

# Evaluate function
def evaluate(X_data, y_data):
    num_examples = len(X_data)
    total_accuracy = 0
    sess = tf.get_default_session()
    for offset in range(0, num_examples, BATCH_SIZE):
        batch_x, batch_y \
            = X_data[offset:offset + BATCH_SIZE]\
            , y_data[offset:offset + BATCH_SIZE]
        accuracy = sess.run(accuracy_operation, feed_dict={x: batch_x, y: batch_y})
        total_accuracy += (accuracy * len(batch_x))
    return total_accuracy / num_examples

with tf.Session() as sess:
    sess.run(tf.global_variables_initializer())
    num_examples = len(x_train)

    print("Training... with dataset - ", num_examples)
    print()
    for i in range(EPOCHS):
        x_train, y_train = shuffle(x_train, y_train)
        for offset in range(0, num_examples, BATCH_SIZE):
            end = offset + BATCH_SIZE
            batch_x, batch_y = x_train[offset:end], y_train[offset:end]
            sess.run(training_operation, feed_dict={x: batch_x, y: batch_y})

        validation_accuracy = evaluate(x_test, y_test)
        print("EPOCH {} ...".format(i + 1))
        print("Validation Accuracy = {:.3f}".format(validation_accuracy))
        print()

    test_accuracy = evaluate(x_test, y_test)
    print("Test Accuracy = {:.3f}".format(test_accuracy))
```

**注意:**
* 我们需要在外部额外声明一个 Softmax tensor 并添加一个合适的名称（**"name"**），以用于提取预测的最终结果。

通过训练，我们可以看到一些对输出结果的分析：

<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/TensorFlow/TensorFlow_training_evaluations.png" alt="evaluations" width="705" >
<br/>
<b>图3</b> - 训练分析
</p>

#### 1.2 加载一个模型
若您已有合适的可供使用的模型，那我们可以尝试加载它。

我们可以加载 saved model， frozen model 或者 checkpoint:
```Python
with tf.Session(graph=tf.Graph()) as sess:
    tf.saved_model.loader.load(
        sess,
        [tag_constants.SERVING],
        '../models/tensorflow_model',
    )
```
```Python
with tf.Session() as sess:
    model_filename ='/PATH/TO/PB/model.pb'
    with gfile.FastGFile(model_filename, 'rb') as f:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(f.read())
        g_in = tf.import_graph_def(graph_def)
```
```Python
with tf.Session(graph=tf.Graph()) as sess:
    dir_path = '../DIR/SAVE/CKPT/'
    ckpt_name = 'lenet.ckpt'
    saver = tf.train.import_meta_graph(dir_path + ckpt_name + '.meta')
    saver.restore(sess, tf.train.latest_checkpoint(dir_path))
```

**注意:**
* 如果您需要加载 Checkpoint，您需要将所加载的模型保存为 SavedModel 或者 FrozenModel 。因为 tfjs-converter 目前并不支持对于 Checkpoint 的转换适配。
* 如果您需要转换 Checkpoint，您可以尝试一下操作：
```Python
with tf.Session(graph=tf.Graph()) as sess:
    dir_path = '../DIR/SAVE/CKPT/'
    ckpt_name = 'lenet.ckpt'
    saver = tf.train.import_meta_graph(dir_path + ckpt_name + '.meta')
    saver.restore(sess, tf.train.latest_checkpoint(dir_path))

    graph = tf.get_default_graph()

    # Pick input for SavedModel
    x = graph.get_tensor_by_name("input/Placeholder:0")
    # Pick output for SavedModel
    add_8 = graph.get_tensor_by_name("add_8:0")

    output_dir = '/OUTPUT/TO/DIR/'
    tf.saved_model.simple_save(
        sess, output_dir,
        {"input":x},
        {"output":add_8}
    )
```

### <div id="findNames">2 找出中间层 tensor 名称</div>
这是所有步骤中的重中之重。我们需要找出我们所希望可视化的中间层所对应的 tensor 名称（names）。

我们可以先尝试输出所有的 tensor 名称：
```Python
for n in tf.get_default_graph().as_graph_def().node:
    print(n.name)
```
哪怕模型并不是很大，我们也可能得到许多 tensor 名称。例如我们在前例中所创建的 LeNet 网络模型，我们就可以得到 400+ 的 tensor 名称：

<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/TensorFlow/TensorFlow_tensor_names_all.png" alt="all tensor names" width="705" >
<br/>
<b>图4</b> - Tensor 名称
</p>

**注意:**
* 我们并不需要关注所有的 tensor，因为大部分 tensor 是用来提供常数或者为训练模型所服务的。我们需要找出用于预测的关键 tensor。
* 若您之前构建神经网络时，合适地添加了 **"name"** 属性，您可以非常快速地找出（确认）它们。这正是我们所希望的。
* 若您加载了一个来自外部的模型，那么这可能需要对该模型的基本结构有所了解。
* 在绝大多数情况下，tensor 的名称（**"name"**）与其在 TensorFlow 中构造器紧密相关。

当我们找到所有我们需要的 tensor 名称后，我们可以将它们添加到一个列表中：
```Python
output_names = ["MyConv2D_1", "MyMaxPooling2D_1", "MyConv2D_2", "MyMaxPooling2D_2",
                "MyDense_1", "MyDense_2", "MySoftMax"]
```

我们可以快速测试一下我们的列表是否有效：
```Python
graph = tf.get_default_graph()
x = graph.get_tensor_by_name("MyInput:0")
outputs = list(map(lambda on: graph.get_tensor_by_name(on+":0"), output_names))
print(sess.run(outputs, feed_dict={x:x_test}))
```

<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/TensorFlow/TensorFlow_prediction_1.png" alt="predict output 1" width="705" >
<br/>
<b>图5</b> - 模型预处理后的多中间层输出
</p>

<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/TensorFlow/TensorFlow_prediction_2.png" alt="predict output 2" width="705" >
<br/>
<b>图6</b> - 最终输出与原始模型一致
</p>

**注意:**
* 您需要为每一个 tensor 对象添加 **":0"** 。 否则模型将返还 tensor 对象而不是其计算结果。
* 请妥善保存 **tensor 名称列表** 。我们将在之后使用 TensorSpace 时继续使用（作为 **outputNames** ）。

### <div id="convertModel">3 转换为 TensorSpace 适配的模型</div>
如果一切顺利，我们就可以使用一下脚本来进行模型转换以适配 TensorSpace：
```Bash
onn='MyConv2D_1,MyMaxPooling2D_1,MyConv2D_2,MyMaxPooling2D_2,MyDense_1,MyDense_2,MySoftMax'
tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_node_names=$onn \
    --saved_model_tags=serve \
    ../models/tensorflow_model \
    ../models/json_models/tensorflow
```

**注意:**
* 请确认 tfjs-converter 安装正确。
* 如果该网络保存为 Checkpoint，您需要先将其转换为 SavedModel 或者 FrozenModel。 tfjs-converter 暂时不支持 Checkpoint 格式。
* 请根据所保存的网络文件类型，选择合适的 `input_format`。
* 请添加所保存的 tensor 名称列表至 `onn`（请勿包含任何空格或者引号）。

<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/TensorFlow/TensorFlow_models.png" alt="models" width="530" >
<br/>
<b>图7</b> - 转换后所保存的最终模型文件
</p>

**注意:**
* 完成转换后，我们将得到三种类型的文件：
    * 一份 “tensorflowjs_model.pb”：包含网络结构等重要信息。
    * 一份 “weights_manifest.json”：包含所有权重文件的对应关系。
    * 一些权重文件：对应训练所得到的各 tensor 权重信息。权重文件的数量取决于网络的结构。
* 您可以访问 [这里](https://github.com/tensorflow/tfjs-converter) 来获取更多 tfjs-converter 的信息。

若至此一切顺利，我们可以移步下一部分——[加载 TensorSpace 适配模型]()(TBD)。
