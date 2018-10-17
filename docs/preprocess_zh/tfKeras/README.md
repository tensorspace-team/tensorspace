## tf.keras 模型预处理

<p align="center">
<img width=400 src="https://github.com/zchholmes/tsp_image/blob/master/Logos/tensorflow.png">
</p>

本篇将介绍如何预处理基于 tf.keras 搭建的神经网络模型，以此来适配 TensorSpace 所需要的拥有中间层输出的模型。如果您之前已经了解过[Keras 模型预处理](https://github.com/syt123450/tensorspace/blob/master/docs/preprocess/Keras/README.md)，您将会发现两篇教程拥有许多相似之处。

以下为本篇教程所使用的代码及模型文件：
* [tf_keras_model.py](https://github.com/syt123450/tensorspace/blob/master/docs/preprocess/tfKeras/src_py/tf_keras_model.py)
* [convert_tf_keras.sh](https://github.com/syt123450/tensorspace/blob/master/docs/preprocess/tfKeras/src_sh/convert_tf_keras.sh)
* [模型](https://github.com/syt123450/tensorspace/tree/master/docs/preprocess/tfKeras/models)

在教程中我们将使用：Python 3.6.5 的运行环境。以下为我们所需要使用的库：
```Python
import tensorflow as tf
import numpy as np
```

此外，我们还需要安装 [tfjs-converter](https://github.com/tensorflow/tfjs-converter) (基于 TensorFlow.js 的转换工具)：
```shell
$ pip install tensorflowjs
```

如果您在此之前没有任何基于 tf.keras 的经验，那我们强烈建议您首先阅读由 TensorFlow 所撰写的[官方教程](https://www.tensorflow.org/guide/keras)

预处理 tf.keras 模型，我们需要以下步骤：
<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/tf_keras/tf_keras_general_process.png" alt="general TF process" width="830" >
<br/>
<b>图1</b> - 预处理 tf.keras 模型的步骤
</p>

* [1. 训练/加载模型](#loadModel)
* [2. 植入中间层输出](#addOutputs)
* [3. 保存嵌入后的模型](#saveModel)
* [4. 转换为 TensorSpace 适配的模型](#convertModel)

在本教程中，我们将使用 MNIST 数据集和 LeNet 神经网络结构来构筑一个 tf.keras 模型作为例子

### <div id="loadModel">1 训练/加载模型</div>
#### 1.1 训练一个新模型
若您目前还没有可以马上直接使用的 tf.keras 模型，您可以按照本小节的方法构筑一个新的 MNIST 手写识别的样例模型。

根据 LeNet 的网络结构：
<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/General/LeNet_Structure.png" alt="LeNet structure" width="175" >
<br/>
<b>图2</b> - LeNet 网络结构
</p>

我们可以用一下代码迅速搭建其网络结构：

```python
def create_sequential_model():
    single_output_model = tf.keras.models.Sequential([
            tf.keras.layers.InputLayer(input_shape=(28, 28)),
            tf.keras.layers.Reshape((28, 28, 1), input_shape=(28, 28,)),
            tf.keras.layers.Convolution2D(
                filters=6, kernel_size=5, strides=1, 
                input_shape=(28, 28, 1), name="conv_1"
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
**注意：** 
* 我们为所有我们想展示的网络层均添加了 “**name**” 属性。

在完成网络结构的构筑之后，我们可以使用 MNIST 来训练我们的模型：
```python
mnist = tf.keras.datasets.mnist
(x_train, y_train),(x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

model.fit(x_train, y_train, epochs=5)
```

在训练完成之后，我们应当得到一个具有完整结构及一定训练程度的 Keras 神经网络模型。我们可以通过以下代码来尝试我们的模型是否可以正常运行：
```python
input_sample = np.ndarray(shape=(28,28), buffer=np.random.rand(28,28))
input_sample = np.expand_dims(input_sample, axis=0)
print(model.predict(input_sample))
```

我们可以得到与下图相似的单一预测结果（一个长度为10的列表）：
<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/tf_keras/tf_keras_predict_1.png" alt="predict output 1" width="705" >
<br/>
<b>图3</b> - 新 Keras 模型的单一预测结果
</p>

#### 1.2 加载已有模型
如果您已经拥有需要展示的模型，您可以使用以下代码来尝试加载：
```python
model = tf.keras.models.load_model(
    "PATH_TO_MODEL/model.h5",
    custom_objects=None,
    compile=True
)
```
或者若该模型的结构与权重为分开保存，我们可以使用以下代码来加载
```python
json_path = "PATH_TO_JSON/model.json"
weight_path = "PATH_TO_WEIGHT/weights.hdf5"
structure = open(json_path, "r")
model = tf.keras.models.model_from_json(
    structure
)
model.load_weights(weight_path)
```

与完成创建新模型之后相似，在完成加载以后我们可以通过以下代码来测试我们所加载的模型是否可以正常使用：
```python
input_sample = np.ndarray(shape=(28,28), buffer=np.random.rand(28,28))
input_sample = np.expand_dims(input_sample, axis=0)
print(model.predict(input_sample))
```

我们应当可以得到与下图相似的单一预测结果：
<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/tf_keras/tf_keras_predict_1.png" alt="predict output 1" width="705" >
<br/>
<b>图4</b> - 加载已有 Keras 模型得到的单一预测结果
</p>

**注意：** 
* 由于我们使用随机数最为输入，因此我们的输出也相对非常随机。

### <div id="addOutputs">2 植入中间层输出</div>
通过第一步，我们已经可以获得 LeNet 所预测的结果——一个1维数组，长度为10，每一位代表该序号所对应的概率。

使用 TensorSpace 的重要目的是为了展示中间层之间的关系，因此我们需要找到合适的方法来抓取中间层的预测结果。

首先，我们可以使用 `summary()` 方法来得到中间层的信息（layer.name）。当然，我们也可以通过 layer 对象直接获取：
```
model.summary()
for layer in model.layers:
     print(layer.name)
```

<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/tf_keras/tf_keras_summary.png" alt="summary" width="705" >
<br/>
<b>图5</b> - 中间层信息输出
</p>

**注意：** 
* 若在之前的步骤中已经设置了恰当的 `**name**` 属性，我们可以很迅速对发现其名称及对应信息。
* 若该模型为加载已有模型所得，大多数情况下，中间层名称应与其所对应的类相关。

现在我们可以通过以下方法提取我们所需要的中间层，并将其植入我们新创建的模型中：
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

或者我们可以用以下方式添加所有的中间层：
```python
def generate_encapsulate_model(model):
    display_model = tf.keras.models.Model(
        inputs=model.input,
        # ignore 1st layer (input), since some old models do not have 1st layer as tf.layer
        outputs=list(map(lambda layer: layer.output, model.layers[1:]))
    )
    return display_model
```
**注意：** 
* 请不要包括任何输入层（ 'input' 或是 `input_layer` ）。由于某些模型是由 Model() 构筑的，其输入部分并不是一个 tf.keras 层。
* 请确认所需要的中间层并保证其顺序.

然后,我们就可以生成一个新的带有中间层植入的嵌入模型：
```python
enc_model = generate_encapsulate_model_with_output_layer_names(model, output_layer_names)
# OR
# enc_model = generate_encapsulate_model(model)
```

我们可以尝试使用我们的嵌入式模型：
```python
print(enc_model.predict(input_sample))
```

<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/tf_keras/tf_keras_predict_2.png" alt="predict output 2" width="705" >
<br/>
<b>图6</b> - 经过预处理之后的中间层输出
</p>

最后一层的输出对应原模型的预测结果，我们可以发现它们是一致的。

<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/tf_keras/tf_keras_predict_3.png" alt="predict output 3" width="705" >
<br/>
<b>图7</b> - 最后一层的输出与原模型预测结果一致
</p>

我们现在可以得到了所有想要的中间层输出。

### <div id="saveModel">3 保存嵌入后的模型</div>

为了进一步转换模型，我们需要保存嵌入后的模型。

**注意：** 
* 因为我们并不需要进一步训练，所以我们并不需要编译我们的嵌入后模型。
* 若您希望基于该嵌入后模型继续训练，您可以加入合适的编译器及损失计算方法。这里我们以 “adam” 和 “sparse_categorical_crossentropy” 为例。
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

### <div id="convertModel">4 转换为 TensorSpace 适配的模型</div>
最后一步是将我们先前得到的嵌入后模型转换为 TensorSpace 所适配的模型。我们将会用到 [tfjs-converter](https://github.com/tensorflow/tfjs-converter)。

我们可以通过以下脚本来进行转换：
```shell
tensorflowjs_converter \
    --input_format=keras \
    ../models/enc_tf_keras_model.h5 \
    ../models/json_models/tf_keras
```

<p align="center">
<img src="https://github.com/zchholmes/tsp_image/blob/master/tf_keras/tf_keras_models.png" alt="models" width="530" >
<br/>
<b>图8</b> - 转换后所保存的最终模型文件
</p>

**注意：**
* 我们将会得到两种类型的文件：
    * 一份 `model.json` 文件：包含所得到的模型结构信息（包括中间层输出）。
    * 一些权重文件：包含模型训练所得到的权重信息。权重文件的数量取决于模型的结构。
* 默认设置下，模型结构文件将命名为 "model.json"，您**可以**修改其名称。
* 权重文件都将以 "group1-shard1of1" 的格式命名并在 “model.json” 声明其关联性。因此，我们建议不要更改权重文件的名称。如有情况需要修改的，请妥善修改 “.json” (“model.json”) 中的关联信息。
* 请访问[这里](https://github.com/tensorflow/tfjs-converter)以获取更多 tfjs-converter 的信息。

若至此一切顺利，我们可以移步下一部分——[加载TensorSpace适配模型]()(TBD)。
