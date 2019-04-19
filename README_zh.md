<p align="center">
<img width=150 src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/logo.png">
</p>
<h1 align="center">TensorSpace.js</h1>
<p align="center"><b>Present Tensor in Space</b></p>

<p align="center">
<a href="https://github.com/tensorspace-team/tensorspace/blob/master/README.md"><strong>English</strong></a> | <strong>中文</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/tensorspace"><img src="https://img.shields.io/npm/v/tensorspace.svg" alt="npm version" height="18"></a>
  <a href="https://github.com/tensorspace-team/tensorspace/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-green.svg" alt="license badge"></a>
  <a href="https://github.com/tensorflow/tfjs"><img src="https://img.shields.io/badge/dependencies-tfjs-brightgreen.svg" alt="dependencies badge"></a>
  <a href="https://github.com/mrdoob/three.js"><img src="https://img.shields.io/badge/dependencies-three.js-brightgreen.svg" alt="dependencies badge"></a>
  <a href="https://github.com/tweenjs/tween.js"><img src="https://img.shields.io/badge/dependencies-tween.js-brightgreen.svg" alt="dependencies badge"></a>
  <a href="https://travis-ci.org/tensorspace-team/tensorspace"><img src="https://travis-ci.org/tensorspace-team/tensorspace.svg?branch=master" alt="build"></a>
  <a href="https://gitter.im/tensorspacejs/Lobby#"><img src="https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg" alt="gitter"></a>
</p>

TensorSpace是一套用于构建神经网络3D可视化应用的框架。
开发者可以使用 TensorSpace API，轻松创建可视化网络、加载神经网络模型并在浏览器中基于已加载的模型进行3D可交互呈现。
TensorSpace可以使您更直观地观察神经网络模型，并了解该模型是如何通过中间层 tensor 的运算来得出最终结果的。
TensorSpace 支持3D可视化经过适当预处理之后的 TensorFlow、Keras、TensorFlow.js 模型。

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_lenet.gif">
</p>
<p align="center">
<b>图1</b> - 使用 TensorSpace 创建的交互式 LeNet 模型
</p>

## 目录

* [TensorSpace 使用场景](#motivation)
* [开始使用](#getting-start)
* [Awesome TensorSpace](https://github.com/tensorspace-team/tensorspace/blob/master/awesome-tensorspace.md)
* [使用样例](#example)
* [文档](#documentation)
* [更新日志](https://github.com/tensorspace-team/tensorspace/blob/master/CHANGELOG.md)
* [开发人员](#contributors)
* [联系方式](#contact)
* [许可证](#license)

## <div id="motivation">TensorSpace 使用场景</div>

TensorSpace 基于 TensorFlow.js、Three.js 和 Tween.js 开发，用于对神经网络进行3D可视化呈现。通过使用 TensorSpace，不仅仅能展示神经网络的结构，还可以呈现网络的内部特征提取、中间层的数据交互以及最终的结果预测等一系列过程。

通过使用 TensorSpace，可以帮助您更直观地观察、理解、展示基于 TensorFlow、Keras 或者 TensorFlow.js 开发的神经网络模型。
TensorSpace 降低了前端开发者进行深度学习相关应用开发的门槛。
我们期待看到更多基于 TensorSpace 开发的3D可视化应用。

* **交互** -- 使用 Layer API，在浏览器中构建可交互的3D可视化模型。

* **直观** -- 观察并展示模型中间层预测数据，直观演示模型推测过程。

* **集成** -- 支持使用 TensorFlow、Keras 以及 TensorFlow.js 训练的模型。

## <div id="getting-start">开始使用</div>

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/workflow_zh.png">
</p>
<p align="center">
<b>图2</b> - TensorSpace 使用流程
</p>

### 1. 安装

#### 基本使用场景下安装

- 第一步：下载依赖库

下载依赖库文件 TensorFlow.js ([tf.min.js](https://cdnjs.com/libraries/tensorflow))，Three.js ([three.min.js](https://cdnjs.com/libraries/three.js))，Tween.js ([tween.min.js](https://cdnjs.com/libraries/tween.js))，TrackballControls ([TrackballControls.js](https://github.com/mrdoob/three.js/blob/master/examples/js/controls/TrackballControls.js))。

- 第二步：下载 TensorSpace

可以通过这些途径下载 `tensorspace.min.js`： [Github](https://github.com/tensorspace-team/tensorspace/tree/master/dist), [NPM](https://www.npmjs.com/package/tensorspace)， [TensorSpace 网站](https://tensorspace.org/#download)，或者 CDN：

```html
<!-- 将”VERSION”替换成需要的版本 -->
<script src="https://cdn.jsdelivr.net/npm/tensorspace@VERSION/dist/tensorspace.min.js"></script>
```

- 第三步：在页面中引入库文件

```html
<script src="tf.min.js"></script>
<script src="three.min.js"></script>
<script src="tween.min.js"></script>
<script src="TrackballControls.js"></script>
<script src="tensorspace.min.js"></script>
```

#### 在渐进式框架中安装

- 第一步： 安装 TensorSpace
  
  - 途径一: NPM
    
  ```bash
  npm install tensorspace
  ```

  - 途径二: Yarn
    
  ```bash
  yarn add tensorspace
  ```

- 第二步： 引入 TensorSpace

```javascript
import * as TSP from 'tensorspace';
```

这个 [Angular 样例](https://github.com/tensorspace-team/tensorspace/tree/master/examples/helloworld-angular) 具体展示了如何使用。

### 2. 模型预处理

在应用 TensorSpace 可视化之前，需要完成一个重要的步骤————对预训练模型进行预处理（通过 [这篇介绍](https://tensorspace.org/html/docs/preIntro_zh.html) 可以了解更多有关 TensorSpace 预处理的概念与原理）。[TensorSpace-Converter](https://github.com/tensorspace-team/tensorspace-converter) 可以帮助开发者快速完成 TensorSpace 预处理过程的辅助工具。

举个例子，如果现在有一个 [tf.keras model](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/rawModel) 的模型，我们可以使用以下 TensorSpace-Converter 转化脚本快速将 tf.keras 模型转化成 TensorSpace 兼容的格式：
```shell
$ tensorspacejs_converter \
    --input_model_from="tensorflow" \
    --input_model_format="tf_keras" \
    --output_layer_names="padding_1,conv_1,maxpool_1,conv_2,maxpool_2,dense_1,dense_2,softmax" \
    ./PATH/TO/MODEL/tf_keras_model.h5 \
    ./PATH/TO/SAVE/DIR
```

**注意：**

* 在使用 TensorSpace-Converter 对预训练的模型进行预处理之前，需要下载 `tensorspacejs` 的 pip 包，并且配置 TensorSpace-Converter 的运行环境。
* 基于不同的机器学习库，我们提供了 [TensorFlow 模型预处理教程](https://tensorspace.org/html/docs/preTf_zh.html)，[Keras 模型预处理教程](https://tensorspace.org/html/docs/preKeras_zh.html)，[TensorFlow.js 模型预处理教程](https://tensorspace.org/html/docs/preTfjs_zh.html)。
* 查看 [TensorSpace-Converter 仓库](https://github.com/tensorspace-team/tensorspace-converter) 了解更多有关 TensorSpace-Converter 的使用细节。

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/workflow_zh.png">
</p>
<p align="center">
<b>图3</b> - TensorSpace-Converter 使用流程
</p>

### 3. 使用 TensorSpace 可视化模型

在成功安装完成 TensorSpace 并完成神经网络模型预处理之后，我们可以来创建一个3D TensorSpace 模型。

我们将使用 [HelloWorld](https://github.com/tensorspace-team/tensorspace/tree/master/examples/helloworld) 路径下的资源，其中包括[适配 TensorSpace 的预处理模型](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/convertedModel) 以及[样例输入数据（“5”）](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/data/5.json)作为使用样例来进行说明。所有的源码都可以在 [helloworld.html](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/helloworld.html) 文件中找到。

首先，我们需要新建一个 TensorSpace 模型实例：
```JavaScript
let container = document.getElementById( "container" );
let model = new TSP.models.Sequential( container );
```

然后，基于 LeNet 网络的结构：输入层 + Padding2d层 + 2 X (Conv2D层 & Maxpooling层) + 3 X (Dense层)，我们可以搭建其模型结构：
```JavaScript
model.add( new TSP.layers.GreyscaleInput() );
model.add( new TSP.layers.Padding2d() );
model.add( new TSP.layers.Conv2d() );
model.add( new TSP.layers.Pooling2d() );
model.add( new TSP.layers.Conv2d() );
model.add( new TSP.layers.Pooling2d() );
model.add( new TSP.layers.Dense() );
model.add( new TSP.layers.Dense() );
model.add( new TSP.layers.Output1d({
    outputs: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
}) );
```

最后，我们需要载入[经过预处理的 TensorSpace 适配模型](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/convertedModel)并使用`init()`方法来创建模型对象：
```JavaScript
model.load({
    type: "tensorflow",
    url: './PATH/TO/MODEL/model.json'
});
model.init(function(){
    console.log("Hello World from TensorSpace!");
});
```

我们可以在浏览器中看到以下模型：
<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/HelloWorld_empty_lenet.jpg">
</p>
<p align="center">
<b>图4</b> - 所创建的 LeNet 模型 (无输入数据）
</p>

我们可以使用我们已经提取好的[手写“5”](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/data/5.json)作为模型的输入：
```
model.init(function() {
    model.predict( image_5 );
});

```

我们在这里将预测方法放入`init()`的回调函数中以确保预测在初始化完成之后进行([在线演示](https://tensorspace.org/html/helloworld.html))。

点击后面这个CodePen logo来在CodePen中试一下这个例子吧 ~ &nbsp;&nbsp;<a target="_blank" href="https://codepen.io/syt123450/pen/667a7943b0f23727790ca38c93389689"><img width=50 height=50 src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/codepen.png"></a>

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/HelloWorld_5.jpg">
</p>
<p align="center">
<b>图5</b> - LeNet 模型判别输入 “5”
</p>

## <div id="example">样例展示</div>

* **LeNet** [ TensorFlow.js 模型 ]

 [➡ 在线演示](https://tensorspace.org/html/playground/lenet_zh.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_lenet.gif">
</p>
<p align="center">
<b>图6</b> - 使用 TensorSpace 构建 LeNet
</p>

* **AlexNet** [ TensorFlow 模型 ]

[➡ 在线演示](https://tensorspace.org/html/playground/alexnet_zh.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_alexnet.gif">
</p>
<p align="center">
<b>图7</b> - 使用 TensorSpace 构建 AlexNet
</p>

* **Yolov2-tiny** [ TensorFlow 模型 ]

[➡ 在线演示](https://tensorspace.org/html/playground/yolov2-tiny_zh.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_yolov2.gif">
</p>
<p align="center">
<b>图8</b> - 使用 TensorSpace 构建 YOLO-v2-tiny
</p>

* **ResNet-50** [ Keras 模型 ]

[➡ 在线演示](https://tensorspace.org/html/playground/resnet50_zh.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_resnet50.gif">
</p>
<p align="center">
<b>图9</b> - 使用 TensorSpace 构建 ResNet-50
</p>

* **Vgg16** [ Keras 模型 ]

[➡ 在线演示](https://tensorspace.org/html/playground/vgg16_zh.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_vgg.gif">
</p>
<p align="center">
<b>图10</b> - 使用 TensorSpace 构建 VGG-16
</p>

* **ACGAN** [ Keras 模型 ]

[➡ 在线演示](https://tensorspace.org/html/playground/acgan_zh.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_acgan.gif">
</p>
<p align="center">
<b>图11</b> - 使用 TensorSpace 构建 ACGAN 生成网络
</p>

* **MobileNetv1** [ Keras 模型 ]

[➡ 在线演示](https://tensorspace.org/html/playground/mobilenetv1_zh.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_mobilenetv1.gif">
</p>
<p align="center">
<b>图12</b> - 使用 TensorSpace 构建 MobileNetv1
</p>

* **Inceptionv3** [ Keras 模型 ]

[➡ 在线演示](https://tensorspace.org/html/playground/inceptionv3_zh.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_inceptionv3.gif">
</p>
<p align="center">
<b>图13</b> - 使用 TensorSpace 构建 Inceptionv3
</p>

* **LeNet训练过程3D可视化** [ TensorFlow.js 动态模型 ]

使用 TensorSpace.js 和 TensorFlow.js 将 LeNet 的训练过程在浏览器端进行3D可视化展示

[➡ 在线演示](https://tensorspace.org/html/playground/trainingLeNet_zh.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_lenet_training.gif">
</p>
<p align="center">
<b>图14</b> - LeNet训练过程3D可视化
</p>

### 本地查看以上模型

有些模型非常大，使用官网的`Playground`载入非常慢。如果你想获得更好的载入速度，把`TensorSpace`项目拷贝到本地是一个好选择

- 第一步：`Clone` 项目文件夹到任意文件夹（无系统要求，这一步时间较长，大约2GB大小，都是预训练模型）

```bash
git clone https://github.com/tensorspace-team/tensorspace.git
```

- 第二步：本地使用 `WebStorm` 打开项目
- 第三步：打开 `/examples` 文件夹，点选任意模型的 `.html` 文件（比如`/exampes/resnet50/resnet50.html`）
- 第四步：点击**右上角**的Chrome图表在本地运行`.html` 文件（`js` 和 `css` ）直接可以在本地浏览器内查看对应模型

## <div id="documentation">文档</div>

* 迅速开始使用，参阅[开始使用](https://tensorspace.org/html/docs/startHello_zh.html)。
* 了解更多[基本概念](https://tensorspace.org/html/docs/basicIntro_zh.html)。
* 如何使用神经网络模型，查看[模型预处理](https://tensorspace.org/html/docs/preIntro_zh.html), [TensorSpace-Converter](https://github.com/tensorspace-team/tensorspace-converter)。
* 了解核心组成构件：[模型](https://tensorspace.org/html/docs/modelIntro_zh.html)、[网络层](https://tensorspace.org/html/docs/layerIntro_zh.html) 以及 [网络层融合](https://tensorspace.org/html/docs/mergeIntro_zh.html)。
* 希望获取更多 TensorSpace 的信息，请访问 TensorSpace 官方网站 [TensorSpace.org](https://tensorspace.org/index_zh.html)。

## <div id="changelog">更新日志</div>

TensorSpace 的所有更新日志都可以在这个文件中查看。

[CHANGELOG.md](https://github.com/tensorspace-team/tensorspace/blob/master/CHANGELOG.md)

## <div id="contributors">开发人员</div>

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/7977100?v=4" width="100px;"/><br /><sub><b>syt123450</b></sub>](https://github.com/syt123450)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=syt123450 "Code") [🎨](#design-syt123450 "Design") [📖](https://github.com/tensorspace-team/tensorspace/commits?author=syt123450 "Documentation") [💡](#example-syt123450 "Examples") | [<img src="https://avatars3.githubusercontent.com/u/4524339?v=4" width="100px;"/><br /><sub><b>Chenhua Zhu</b></sub>](https://github.com/zchholmes)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=zchholmes "Code") [🎨](#design-zchholmes "Design") [✅](#tutorial-zchholmes "Tutorials") [💡](#example-zchholmes "Examples") | [<img src="https://avatars0.githubusercontent.com/u/21956621?v=4" width="100px;"/><br /><sub><b>YaoXing Liu</b></sub>](https://charlesliuyx.github.io/)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=CharlesLiuyx "Code") [🎨](#design-CharlesLiuyx "Design") [✅](#tutorial-CharlesLiuyx "Tutorials") [💡](#example-CharlesLiuyx "Examples") | [<img src="https://avatars2.githubusercontent.com/u/19629037?v=4" width="100px;"/><br /><sub><b>Qi(Nora)</b></sub>](https://github.com/lq3297401)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=lq3297401 "Code") [🎨](#design-lq3297401 "Design") | [<img src="https://avatars2.githubusercontent.com/u/97291?s=400&v=4" width="100px;"/><br /><sub><b>Dylan Schiemann</b></sub>](https://github.com/dylans)<br />[📝](#blog-dylans "Blogposts") | [<img src="https://avatars3.githubusercontent.com/u/25629006?s=400&v=4" width="100px;"/><br /><sub><b>BoTime</b></sub>](https://github.com/BoTime)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=BoTime "Code") [📖](https://github.com/tensorspace-team/tensorspace/commits?author=BoTime "Documentation") [💡](#example-BoTime "Examples") | [<img src="https://avatars0.githubusercontent.com/u/9149028?s=400&v=4" width="100px;"/><br /><sub><b>Kamidi Preetham</b></sub>](https://github.com/kamidipreetham)<br />[📖](https://github.com/tensorspace-team/tensorspace/commits?author=kamidipreetham "Documentation") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars3.githubusercontent.com/u/333921?s=400&v=4" width="100px;"/><br /><sub><b>Wade Penistone</b></sub>](https://github.com/Truemedia)<br />[📖](https://github.com/tensorspace-team/tensorspace/commits?author=Truemedia "Documentation") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## <div id="contact">联系方式</div>
若有任何疑问，欢迎通过以下方式联系我们：
* Email: tensorspaceteam@gmail.com
* GitHub Issues: [create issue](https://github.com/tensorspace-team/tensorspace/issues/new)
* Slack: [#questions](https://tensorspace.slack.com/messages/CDSB58A5P)
* Gitter: [#Lobby](https://gitter.im/tensorspacejs/Lobby#)

## <div id="license">许可证</div>

[Apache License 2.0](https://github.com/tensorspace-team/tensorspace/blob/master/LICENSE)
