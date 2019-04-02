<p align="center">
<img width=150 src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/logo.png">
</p>
<h1 align="center">TensorSpace.js</h1>
<p align="center"><b>Present Tensor in Space</b></p>

<p align="center">
<strong>English</strong> | <a href="https://github.com/tensorspace-team/tensorspace/blob/master/README_zh.md"><strong>中文</strong></a>
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

TensorSpace is a neural network 3D visualization framework built using TensorFlow.js, Three.js and Tween.js. TensorSpace provides Keras-like APIs to build deep learning layers, load pre-trained models, and generate a 3D visualization  in the browser. From TensorSpace, it is intuitive to learn what the model structure is, how the model is trained and how the model predicts the results based on the intermediate information. After preprocessing the model, TensorSpace supports to visualize pre-trained model from TensorFlow, Keras and TensorFlow.js.

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_lenet.gif">
</p>
<p align="center">
<b>Fig. 1</b> - Interactive LeNet created by TensorSpace
</p>

## Table of Content

* [Motivation](#motivation)
* [Getting Started](#getting-start)
* [Awesome TensorSpace](https://github.com/tensorspace-team/tensorspace/blob/master/awesome-tensorspace.md)
* [Example](#example)
* [Documentation](#documentation)
* [Changelog](https://github.com/tensorspace-team/tensorspace/blob/master/CHANGELOG.md)
* [Contributors](#contributors)
* [Contact](#contact)
* [License](#license)

## Motivation

TensorSpace is a neural network 3D visualization framework designed for not only showing the basic model structure, but also presenting the processes of internal feature abstractions, intermediate data manipulations and final inference generations.

By applying TensorSpace API, it is more intuitive to visualize and understand any pre-trained models built by TensorFlow, Keras, TensorFlow.js, etc. TensorSpace introduces a way for front end developers to be involved in the deep learning ecosystem. As an open source library, TensorSpace team welcomes any further development on visualization applications.

* **Interactive** -- Use Layer API to build interactive model in browsers.
* **Intuitive** -- Visualize the information from intermediate inferences.
* **Integrative** -- Support pre-trained models from TensorFlow, Keras, TensorFlow.js.


## Getting Started

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/workflow.png">
</p>
<p align="center">
<b>Fig. 2</b> - TensorSpace Workflow
</p>

### 1. Install TensorSpace Library

**Basic Case**
- Option 1: From CDN

  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/97/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/17.2.0/Tween.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tensorflow/0.13.4/tf.min.js"></script>
  <script src="https://tensorspace.org/assets/jslib/TrackballControls.js"></script>
  <!-- Replace "VERSION"  with the version you want to use. -->
  <script src="https://cdn.jsdelivr.net/npm/tensorspace@VERSION/build/tensorspace.min.js"></script>

  ```

- Option 2: Download and include `tensorspace.min.js` in web page.

  Get `tensorspace.min.js` from [Github](https://github.com/tensorspace-team/tensorspace/tree/master/dist), [NPM](https://www.npmjs.com/package/tensorspace) or [TensorSpace official website](https://tensorspace.org/#download)
  ```html
  <script src="three.min.js"></script>
  <script src="tween.min.js"></script>
  <script src="tf.min.js"></script>
  <script src="TrackballControls.js"></script>
  <script src="tensorspace.min.js"></script>
  ```

**Using TensorSpace in Progressive Framework**
  - Step 1: Install TensorSpace
    - Option 1: NPM
    
    ```bash
    npm install tensorspace
    ```

    - Option 2: Yarn
    
    ```bash
    yarm add tensorspace
    ```
  - Step 2: Use TensorSpace
  ```javascript
  import * as TSP from 'tensorspace';
  ```
  Checkout this [Angular example](https://github.com/tensorspace-team/tensorspace/tree/master/examples/helloworld-angular) for more information.

### 2. Preprocess Pre-trained Model

For presenting multiple intermediate outputs, we need to [preprocess](https://github.com/tensorspace-team/tensorspace/tree/master/docs/preprocess) the pre-trained model.

Based on different training libraries, we provide different tutorials: [TensorFlow model preprocessing](https://github.com/tensorspace-team/tensorspace/tree/master/docs/preprocess/TensorFlow), [Keras model preprocessing](https://github.com/tensorspace-team/tensorspace/tree/master/docs/preprocess/Keras) and [TensorFlow.js model preprocessing](https://github.com/tensorspace-team/tensorspace/tree/master/docs/preprocess/TensorFlowJS).


### 3. Create 3D TensorSpoace Model

If TensorSpace is installed successfully and the pre-trained deep learning model is preprocessed, let's create an interactive 3D TensorSpace model.

For convenience, feel free to use the resources from our [HelloWorld](https://github.com/tensorspace-team/tensorspace/tree/master/examples/helloworld) directory.

We will use the [preprocessed TensorSpace compatible LeNet model](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/model) and [sample input data ("5")](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/data/5.json) as an example to illustrate this step. All source code can be found in [helloworld.html](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/helloworld.html).

First, we need to new a TensorSpace model instance:
```JavaScript
let container = document.getElementById( "container" );
let model = new TSP.models.Sequential( container );
```

Next, based on the LeNet structure: Input + 2 X (Conv2D & Maxpooling) + 3 X (Dense), we build the structure of the model:
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

Last, we should load our [preprocessed TensorSpace compatible model](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/model/mnist.json) and use `init()` method to create the TensorSpace model:
```JavaScript
model.load({
    type: "tfjs",
    url: './lenetModel/mnist.json'
});
model.init(function(){
    console.log("Hello World from TensorSpace!");
});
```

We can get the following Fig. 2 model in the browser if everything looks good.

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/HelloWorld_empty_lenet.jpg">
</p>
<p align="center">
<b>Fig. 3</b> - LeNet model without any input data
</p>


We provide a [extracted file](https://github.com/tensorspace-team/tensorspace/blob/master/examples/helloworld/data/5.json) which is a handwritten "5" as the input of our model:  ([online demo](https://tensorspace.org/html/helloworld.html))

```
model.init(function() {
    model.predict( image_5 );
});

```

We put the `predict( image_5 )` method in the callback function of `init()` to ensure the prediction is after the initialization complete.

Click the CodePen logo to try it in CodePen: &nbsp;&nbsp;<a target="_blank" href="https://codepen.io/syt123450/pen/667a7943b0f23727790ca38c93389689"><img width=50 height=50 src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/codepen.png"></a>

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/HelloWorld_5.jpg">
</p>
<p align="center">
<b>Fig. 4</b> - LeNet model with input data "5"
</p>

## Example

* **LeNet** [ TensorFlow.js model ]

[➡ Live Demo](https://tensorspace.org/html/playground/lenet.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_lenet.gif">
</p>
<p align="center">
<b>Fig. 5</b> - Interactive LeNet created by TensorSpace
</p>

* **AlexNet** [ TensorFlow model ]

[➡ Live Demo](https://tensorspace.org/html/playground/alexnet.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_alexnet.gif">
</p>
<p align="center">
<b>Fig. 6</b> - Interactive AlexNet created by TensorSpace
</p>

* **Yolov2-tiny** [ TensorFlow model ]

[➡ Live Demo](https://tensorspace.org/html/playground/yolov2-tiny.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_yolov2.gif">
</p>
<p align="center">
<b>Fig. 7</b> - Interactive Yolov2-tiny created by TensorSpace
</p>

* **ResNet-50** [ Keras model ]

[➡ Live Demo](https://tensorspace.org/html/playground/resnet50.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_resnet50.gif">
</p>
<p align="center">
<b>Fig. 8</b> - Interactive ResNet-50 created by TensorSpace
</p>

* **Vgg16** [ Keras model ]

[➡ Live Demo](https://tensorspace.org/html/playground/vgg16.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_vgg.gif">
</p>
<p align="center">
<b>Fig. 9</b> - Interactive Vgg16 created by TensorSpace
</p>

* **ACGAN** [ Keras model ]

[➡ Live Demo](https://tensorspace.org/html/playground/acgan.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_acgan.gif">
</p>
<p align="center">
<b>Fig. 10</b> - Interactive ACGAN created by TensorSpace
</p>

* **MobileNetv1** [ Keras model ]

[➡ Live Demo](https://tensorspace.org/html/playground/mobilenetv1.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_mobilenetv1.gif">
</p>
<p align="center">
<b>Fig. 11</b> - Interactive MobileNetv1 created by TensorSpace
</p>

* **Inceptionv3** [ Keras model ]

[➡ Live Demo](https://tensorspace.org/html/playground/inceptionv3.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_inceptionv3.gif">
</p>
<p align="center">
<b>Fig. 12</b> - Interactive Inceptionv3 created by TensorSpace
</p>

* **LeNet Training Visualization** [ TensorFlow.js dynamic model ]

Visualize the LeNet Training Process with TensorSpace.js and TensorFlow.js.

[➡ Live Demo](https://tensorspace.org/html/playground/trainingLeNet.html)

<p align="center">
<img width="100%" src="https://raw.githack.com/tensorspace-team/tensorspace/master/assets/tensorspace_lenet_training.gif">
</p>
<p align="center">
<b>Fig. 13</b> - LeNet Training 3D Visualization
</p>

### View models locally

As some models above are extremely large, view them locally may be a good choice.

- Step 1: `clone` TensorSpace Repo

```bash
git clone https://github.com/tensorspace-team/tensorspace.git
```

- Step 2:  

Open "html" file in examples folder in local web server.

## Documentation

* For a quick start, checkout [Getting Start](https://tensorspace.org/html/docs/startHello.html)
* To download/install, see [Download](https://tensorspace.org/index.html#download)
* To learn more about the [Basic Concepts](https://tensorspace.org/html/docs/basicIntro.html)
* To process a deep learning model, checkout [Model Preprocessing](https://tensorspace.org/html/docs/preIntro.html)
* To learn core components: [Models](https://tensorspace.org/html/docs/modelIntro.html), [Layers](https://tensorspace.org/html/docs/layerIntro.html) and [Merge Function](https://tensorspace.org/html/docs/mergeIntro.html)
* Checkout the official website [TensorSpace.org](https://tensorspace.org) for more about TensorSpace.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/7977100?v=4" width="100px;"/><br /><sub><b>syt123450</b></sub>](https://github.com/syt123450)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=syt123450 "Code") [🎨](#design-syt123450 "Design") [📖](https://github.com/tensorspace-team/tensorspace/commits?author=syt123450 "Documentation") [💡](#example-syt123450 "Examples") | [<img src="https://avatars3.githubusercontent.com/u/4524339?v=4" width="100px;"/><br /><sub><b>Chenhua Zhu</b></sub>](https://github.com/zchholmes)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=zchholmes "Code") [🎨](#design-zchholmes "Design") [✅](#tutorial-zchholmes "Tutorials") [💡](#example-zchholmes "Examples") | [<img src="https://avatars0.githubusercontent.com/u/21956621?v=4" width="100px;"/><br /><sub><b>YaoXing Liu</b></sub>](https://charlesliuyx.github.io/)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=CharlesLiuyx "Code") [🎨](#design-CharlesLiuyx "Design") [✅](#tutorial-CharlesLiuyx "Tutorials") [💡](#example-CharlesLiuyx "Examples") | [<img src="https://avatars2.githubusercontent.com/u/19629037?v=4" width="100px;"/><br /><sub><b>Qi(Nora)</b></sub>](https://github.com/lq3297401)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=lq3297401 "Code") [🎨](#design-lq3297401 "Design") | [<img src="https://avatars2.githubusercontent.com/u/97291?s=400&v=4" width="100px;"/><br /><sub><b>Dylan Schiemann</b></sub>](https://github.com/dylans)<br />[📝](#blog-dylans "Blogposts") | [<img src="https://avatars3.githubusercontent.com/u/25629006?s=400&v=4" width="100px;"/><br /><sub><b>BoTime</b></sub>](https://github.com/BoTime)<br />[💻](https://github.com/tensorspace-team/tensorspace/commits?author=BoTime "Code") [📖](https://github.com/tensorspace-team/tensorspace/commits?author=BoTime "Documentation") [💡](#example-BoTime "Examples") | [<img src="https://avatars0.githubusercontent.com/u/9149028?s=400&v=4" width="100px;"/><br /><sub><b>Kamidi Preetham</b></sub>](https://github.com/kamidipreetham)<br />[📖](https://github.com/tensorspace-team/tensorspace/commits?author=kamidipreetham "Documentation") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars3.githubusercontent.com/u/333921?s=400&v=4" width="100px;"/><br /><sub><b>Wade Penistone</b></sub>](https://github.com/Truemedia)<br />[📖](https://github.com/tensorspace-team/tensorspace/commits?author=Truemedia "Documentation") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## Contact
If you have any issue or doubt, feel free to contact us by:
* Email: tensorspaceteam@gmail.com
* GitHub Issues: [create issue](https://github.com/tensorspace-team/tensorspace/issues/new)
* Slack: [#questions](https://tensorspace.slack.com/messages/CDSB58A5P)
* Gitter: [#Lobby](https://gitter.im/tensorspacejs/Lobby#)

## License

[Apache License 2.0](https://github.com/tensorspace-team/tensorspace/blob/master/LICENSE)
