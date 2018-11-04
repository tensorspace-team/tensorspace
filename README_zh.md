<p align="center">
<img width=150 src="https://github.com/tensorspace-team/tensorspace/blob/master/assets/logo.png">
</p>
<h1 align="center">TensorSpace.js</h1>
<p align="center"><b>Present Tensor in Space</b></p>

<p align="center">
<a href="https://github.com/tensorspace-team/tensorspace/blob/master/README.md"><strong>English</strong></a> | <strong>中文</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/tensorspace"><img src="https://img.shields.io/npm/v/tensorspace.svg" alt="npm version" height="18"></a>
  <a href="https://github.com/tensorspace-team/tensorspace/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-green.svg" alt="license badge"></a>
  <a href="https://github.com/mrdoob/three.js/"><img src="https://img.shields.io/badge/dependencies-Three.js-brightgreen.svg" alt="dependencies badge"></a>
      <a href="https://github.com/tensorflow/tfjs"><img src="https://img.shields.io/badge/dependencies-TensorFlow.js-brightgreen.svg" alt="dependencies badge"></a>
  <a href="https://travis-ci.org/syt123450/giojs"><img src="https://travis-ci.org/syt123450/giojs.svg" alt="build"></a>
</p>

TensorSpace是一套用于构建神经网络3D可视化应用的框架。
开发者可以使用类Keras风格的TensorSpace API，轻松创建可视化网络、加载神经网络模型并在浏览器中基于已加载的模型进行3D可交互呈现。
TensorSpace可以使您更直观地观察神经网络模型，并了解该模型是如何通过中间层 tensor 的运算来得出最终结果的。
TensorSpace 支持3D可视化所有经过适当预处理之后的 TensorFlow、Keras、TensorFlow.js 模型。

<p align="center">
<img width="100%" src="https://github.com/tensorspace-team/tensorspace/blob/master/assets/tensorspace_lenet.gif">
</p>
<p align="center">
<b>图1</b> - 使用 TensorSpace 创建的交互式 LeNet 模型
</p>

## 目录

* [TensorSpace 使用场景](#motivation)
* [开始使用](#getting-start)
* [使用样例](#example)
* [文档](#documentation)
* [开发人员](#contributors)
* [联系方式](#contact)
* [许可证](#license)

## <div id="motivation">TensorSpace 使用场景</div>

TensorSpace 基于TensorFlow.js和Three.js开发，用于对神经网络进行3D可视化呈现。通过使用 TensorSpace，不仅仅能展示神经网络的结构，还可以呈现网络的内部特征提取、中间层的数据交互以及最终的结果预测等一系列过程。

通过使用 TensorSpace，可以帮助您更直观地观察并理解基于TensorFlow、Keras或者TensorFlow.js开发的神经网络模型。
TensorSpace 降低了前端开发者进行深度学习相关应用开发的门槛。
我们期待看到更多基于 TensorSpace 开发的3D可视化应用。

* **交互** -- 使用类 Keras 的API，在浏览器中构建可交互的3D可视化模型。

* **直观** -- 观察并展示模型中间层预测数据，直观演示模型推测过程。

* **集成** -- 支持使用 TensorFlow、Keras 以及 TensorFlow.js 训练的模型。

## <div id="getting-start">开始使用</div>

### 安装

* **第一步: 下载 TensorSpace.js**

我们提供了三种下载 TensorSpace.js 的方法，它们分别是 npm、yarn 以及 来自官方网站。

途径 1: NPM
```bash
npm install tensorspace
```

途径 2: Yarn
```bash
yarn add tensorspace
```

途径 3: [官方网站下载](http://tensorspace.org/index_zh.html#download)

* **第二步: 安装依赖库**

请在使用 TensorSapce.js 之前，引入[TensorFlow.js](https://github.com/tensorflow/tfjs)、 [Three.js](https://github.com/mrdoob/three.js)、 [Tween.js](https://github.com/tweenjs/tween.js) 和 [TrackballControl.js](https://github.com/mrdoob/three.js/blob/master/examples/js/controls/TrackballControls.js) 至所需要的 html 文件中，并置于 TensorSpace.js 的引用之前。

```html
<script src="tf.min.js"></script>
<script src="three.min.js"></script>
<script src="tween.min.js"></script>
<script src="TrackballControls.js"></script>
```

* **第三步: 安装 TensorSpace.js**

将 TensorSpace.js 引入 html 文件中：
```html
<script src="tensorspace.min.js"></script>
```

### 模型预处理

为了获得神经网络中间层的运算结果，我们需要对已有的模型进行[模型预处理](https://github.com/tensorspace-team/tensorspace/tree/master/docs/preprocess_zh)。

基于不同的机器学习库，我们提供了 [TensorFlow 模型预处理教程](https://github.com/tensorspace-team/tensorspace/tree/master/docs/preprocess_zh/TensorFlow)、[Keras 模型预处理教程](https://github.com/tensorspace-team/tensorspace/tree/master/docs/preprocess_zh/Keras) 以及 [TensorFlow.js 模型预处理教程](https://github.com/tensorspace-team/tensorspace/tree/master/docs/preprocess_zh/TensorFlowJS)。

### 使用

在成功安装完成 TensorSpace 并完成神经网络模型预处理之后，我们可以来创建一个3D TensorSpace 模型。

为了简化步骤，请随意使用我们在 [HelloWorld](https://github.com/tensorspace-team/tensorspace/tree/master/examples/helloworld) 路径下所提供的资源。

我们将会用到[适配 TensorSpace 的预处理模型](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/model) 以及[样例输入数据（“5”）](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/data/5.json)作为使用样例来进行说明。所有的源码都可以在 [helloworld.html](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/helloworld.html) 文件中找到。

首先，我们需要新建一个 TensorSpace 模型实例：
```JavaScript
let container = document.getElementById( "container" );
let model = new TSP.model.Sequential( container );
```

然后，基于 LeNet 网络的结构：输入层 + 2 X (Conv2D层 & Maxpooling层) + 3 X (Dense层)，我们可以搭建其模型结构：
```JavaScript
model.add( new TSP.layers.GreyscaleInput({ shape: [28, 28, 1] }) );
model.add( new TSP.layers.Padding2d({ padding: [2, 2] }) );
model.add( new TSP.layers.Conv2d({ kernelSize: 5, filters: 6, strides: 1 }) );
model.add( new TSP.layers.Pooling2d({ poolSize: [2, 2], strides: [2, 2] }) );
model.add( new TSP.layers.Conv2d({ kernelSize: 5, filters: 16, strides: 1 }) );
model.add( new TSP.layers.Pooling2d({ poolSize: [2, 2], strides: [2, 2] }) );
model.add( new TSP.layers.Dense({ units: 120 }) );
model.add( new TSP.layers.Dense({ units: 84 }) );
model.add( new TSP.layers.Output1d({
    units: 10,
    outputs: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
}) );
```

最后，我们需要载入[经过预处理的 TensorSpace 适配模型](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/model/mnist.json)并使用`init()`方法来创建模型对象：
```JavaScript
model.load({
    type: "tfjs",
    url: './lenetModel/mnist.json',
    onComplete: function() {
        console.log( "\"Hello World!\" from TensorSpace Loader." );
    }
});
model.init();
```

我们可以在浏览器中看到以下模型：
<p align="center">
<img width="100%" src="https://github.com/tensorspace-team/tensorspace/blob/master/assets/HelloWorld_empty_lenet.jpg">
</p>
<p align="center">
<b>图2</b> - 所创建的 LeNet 模型 (无输入数据）
</p>

我们可以使用我们已经提取好的[手写“5”](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/data/5.json)作为模型的输入：
```
model.init(function() {
    model.predict( image_5 );
});

```

我们在这里将预测方法放入`init()`的回调函数中以确保预测在初始化完成之后进行。

<p align="center">
<img width="100%" src="https://github.com/tensorspace-team/tensorspace/blob/master/assets/HelloWorld_5.jpg">
</p>
<p align="center">
<b>图3</b> - LeNet 模型判别输入 “5”
</p>


## <div id="example">样例展示</div>

* **LeNet**

 [➡ 在线演示](http://tensorspace.org/html/playground/lenet_zh.html)

<p align="center">
<img width="100%" src="https://github.com/tensorspace-team/tensorspace/blob/master/assets/tensorspace_lenet.gif">
</p>
<p align="center">
<b>图4</b> - 使用 TensorSpace 构建 LeNet
</p>

* **AlexNet** 

[➡ 在线演示](http://tensorspace.org/html/playground/alexnet_zh.html)

<p align="center">
<img width="100%" src="https://github.com/tensorspace-team/tensorspace/blob/master/assets/tensorspace_alexnet.gif">
</p>
<p align="center">
<b>图5</b> - 使用 TensorSpace 构建 AlexNet
</p>

* **Yolov2-tiny** 

[➡ 在线演示](http://tensorspace.org/html/playground/yolov2-tiny_zh.html)

<p align="center">
<img width="100%" src="https://github.com/tensorspace-team/tensorspace/blob/master/assets/tensorspace_yolov2.gif">
</p>
<p align="center">
<b>图6</b> - 使用 TensorSpace 构建 YOLO-v2-tiny
</p>

* **ResNet-50**

[➡ 在线演示](http://tensorspace.org/html/playground/resnet50_zh.html)

<p align="center">
<img width="100%" src="https://github.com/tensorspace-team/tensorspace/blob/master/assets/tensorspace_resnet50.gif">
</p>
<p align="center">
<b>图7</b> - 使用 TensorSpace 构建 ResNet-50
</p>

* **Vgg16**

[➡ 在线演示](http://tensorspace.org/html/playground/vgg16_zh.html)

<p align="center">
<img width="100%" src="https://github.com/tensorspace-team/tensorspace/blob/master/assets/tensorspace_vgg.gif">
</p>
<p align="center">
<b>图8</b> - 使用 TensorSpace 构建 VGG-16
</p>

* **ACGAN**

[➡ 在线演示](http://tensorspace.org/html/playground/acgan_zh.html)

<p align="center">
<img width="100%" src="https://github.com/tensorspace-team/tensorspace/blob/master/assets/tensorspace_acgan.gif">
</p>
<p align="center">
<b>图9</b> - 使用 TensorSpace 构建 ACGAN 生成网络
</p>

## <div id="documentation">文档</div>

* 迅速开始使用，参阅[开始使用](http://tensorspace.org/html/docs/startHello_zh.html)。
* 下载并安装，查看[下载](http://tensorspace.org/index_zh.html#download)。
* 了解更多[基本概念](http://tensorspace.org/html/docs/basicIntro_zh.html)。
* 如何使用神经网络模型，查看[模型预处理](http://tensorspace.org/html/docs/preIntro_zh.html)。
* 了解核心组成构件：[模型](http://tensorspace.org/html/docs/modelIntro_zh.html)、[网络层](http://tensorspace.org/html/docs/layerIntro_zh.html) 以及 [网络层融合](http://tensorspace.org/html/docs/mergeIntro_zh.html)。
* 希望获取更多 TensorSpace 的信息，请访问 TensorSpace 官方网站 [TensorSpace.org](http://tensorspace.org/index_zh.html)。

## <div id="contributors">开发人员</div>

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/7977100?v=4" width="100px;"/><br /><sub><b>syt123450</b></sub>](https://github.com/syt123450)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=syt123450 "Code") [🎨](#design-syt123450 "Design") [📖](https://github.com/tensorspace-team/tensorspace/commits?author=syt123450 "Documentation") [💡](#example-syt123450 "Examples") | [<img src="https://avatars3.githubusercontent.com/u/4524339?v=4" width="100px;"/><br /><sub><b>Chenhua Zhu</b></sub>](https://github.com/zchholmes)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=zchholmes "Code") [🎨](#design-zchholmes "Design") [✅](#tutorial-zchholmes "Tutorials") [💡](#example-zchholmes "Examples") | [<img src="https://avatars0.githubusercontent.com/u/21956621?v=4" width="100px;"/><br /><sub><b>YaoXing Liu</b></sub>](https://charlesliuyx.github.io/)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=CharlesLiuyx "Code") [🎨](#design-CharlesLiuyx "Design") [✅](#tutorial-CharlesLiuyx "Tutorials") [💡](#example-CharlesLiuyx "Examples") | [<img src="https://avatars2.githubusercontent.com/u/19629037?v=4" width="100px;"/><br /><sub><b>Qi(Nora)</b></sub>](https://github.com/lq3297401)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=lq3297401 "Code") [🎨](#design-lq3297401 "Design") |
| :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## <div id="contact">联系方式</div>
若有任何疑问，欢迎通过以下方式联系我们：
* Email: tensorspaceteam@gmail.com
* GitHub Issues: [create issue](https://github.com/tensorspace-team/tensorspace/issues/new)
* Slack: [#questions](https://tensorspace.slack.com/messages/CDSB58A5P)

## <div id="license">许可证</div>

[Apache License 2.0](https://github.com/tensorspace-team/tensorspace/blob/master/LICENSE)
