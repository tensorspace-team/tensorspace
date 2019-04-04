<p align="center">
<img width=400 src="./img/tfjs.png">
</p>
<h1 align=center>TensorFlow.js</h1>
<p align=center><b>使用 TensorSpace 和 TensorSpace-Converter 可视化 TensorFlow.js 模型</b></p>

## 简介

本教程展示如何使用 TensorSpace 和 TensorSpace-Converter 可视化 TensorFlow.js 模型。在接下来的教程中，可视化一个使用 MNIST 数据集和 LeNet 神经网络结构 构建的 TensorFlow.js 模型。

若果您并没有任何可以直接使用的 `tfjs` 模型，可以使用 [这个](https://github.com/tensorspace-team/tensorspace-converter/blob/master/examples/tfjs/train/createModel.html) 脚本训练一个新的样例模型。当然，我们也提供了一个训练好的 `LeNet` 模型，在可以直接从 [这里](https://github.com/tensorspace-team/tensorspace-converter/tree/master/examples/tfjs/rawModel) 获得。

## 文件

以下为本篇教程所使用的代码及模型文件:

* TensorFlow.js 模型 ([mnist.json](https://github.com/tensorspace-team/tensorspace-converter/blob/master/examples/tfjs/rawModel/mnist.json) 和 [mnist.weight.bin](https://github.com/tensorspace-team/tensorspace-converter/blob/master/examples/tfjs/rawModel/mnist.weights.bin))
* [TensorSpace-Converter 预处理脚本](https://github.com/tensorspace-team/tensorspace-converter/blob/master/examples/tfjs/script/converter.sh)
* [TensorSpace 可视化代码](https://github.com/tensorspace-team/tensorspace-converter/blob/master/examples/tfjs/index.html)

## 预处理

首先我们将会使用 TensorSpace-Converter 对一个 TensorFlow.js 模型进行预处理:

```shell
$ tensorspacejs_converter \
    --input_model_from="tfjs" \
    --output_layer_names="myPadding,myConv1,myMaxPooling1,myConv2,myMaxPooling2,myDense1,myDense2,myDense3" \
    ./rawModel/mnist.json \
    ./convertedModel/
```

**❗ 注意:** 

* 将 `input_model_from` 设置成 `tfjs`。
* 当使用 TensorFlow.js 训练并保存一个模型后，会得到一个模型结构文件 `xxx.json` 和一些权重文件 `xxx.weight.bin`。将模型结构文件（xxx.json）和权重文件（xxx.weight.bin）放在同一个目录下，然后将模型结构文件的路径设置为 `input_path`。
* 取出 `TensorFlow.js` 模型的 `Layer` 名称 , 然后设置到 `output_layer_names` 中，如 `图1` 所示。
* 以上 TensorSpace-Converter 预处理脚本将会在 `convertedModel` 文件夹中生成经过预处理的模型。在本教程中，我们已经生成了经过预处理的模型，模型文件可以在 [这个文件夹](https://github.com/tensorspace-team/tensorspace-converter/tree/master/examples/tfjs/convertedModel) 中找到。

<p align="center">
<img src="./img/output_layer_names.png" alt="layernames" width="100%" >
<br/>
<b>图1</b> - 将模型 Layer 名取出并设置 output_layer_names
</p>

经过转化后，我们将会得到经过预处理的模型：
<p align="center">
<img src="./img/tfjs_created_model.png" alt="models" width="400" >
<br/>
<b>图2</b> - 经过预处理的 TensorFlow.js 模型
</p>

**❗ 注意:** 

* 我们将会得到2种不同类型的文件：
    * `.json` 包含神经网络结构。
    * `.bin` 包含所训练得到的权重。

## 载入并可视化

通过 TensorSpace API 构建 TensorSpace 可视化模型。
```javascript
let model = new TSP.models.Sequential( modelContainer );

model.add( new TSP.layers.GreyscaleInput() );
model.add( new TSP.layers.Padding2d() );
model.add( new TSP.layers.Conv2d() );
model.add( new TSP.layers.Pooling2d() );
model.add( new TSP.layers.Conv2d() );
model.add( new TSP.layers.Pooling2d() );
model.add( new TSP.layers.Dense() );
model.add( new TSP.layers.Dense() );
model.add( new TSP.layers.Output1d( {
    outputs: [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ]
} ) );
```

载入经过 TensorSpace-Converter 预处理的模型，然后将模型进行初始化：
```javascript
model.load( {
    type: "tfjs",
    url: "./convertedModel/model.json"
} );

model.init();
```

## 结果显示

若至此一切顺利，在浏览器中打开 `index.html`，将会看到以下模型：
<p align="center">
<img src="./img/data5.jpg" alt="prediction" width="100%" >
<br/>
<b>图3</b> - TensorSpace LeNet 预测 "5"
</p>