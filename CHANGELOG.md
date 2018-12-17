# Change Log

All notable changes to TensorSpace will be documented in this file.

## v0.3.0 - Merry Christmas TensorSpace v0.3

> 2018-12-17 ( 0.2.0 ==> 0.3.0 )

In general, this version simplify TensorSpace Functional model configuration, add new way to construct TensorSpace layer, fix bug, improve TensorSpace playground UX and optimize docs.

### Feature

* Add Chirstmas logo [ecb7947](https://github.com/tensorspace-team/tensorspace/commit/ecb79477bd27b0ae3e97c179976f64ff43907aa7)
* Add and export version attribute [#135](https://github.com/tensorspace-team/tensorspace/issues/135)
* Add auto outputsOrder detect [#154](https://github.com/tensorspace-team/tensorspace/issues/154)
* Add Shape constructor for layers [#152](https://github.com/tensorspace-team/tensorspace/issues/152)
* Add auto pre-trained model input shape detection [#165](https://github.com/tensorspace-team/tensorspace/issues/165)
* Add predictDataShapes for dynamically input shapes model [#170](https://github.com/tensorspace-team/tensorspace/issues/170)
* Add feedInputs configuration for TensorSpace models [#172](https://github.com/tensorspace-team/tensorspace/issues/172)
* Change shape constructor definition for Conv2d and Pooling2d [#155](https://github.com/tensorspace-team/tensorspace/issues/155)
* Change GlobalPooling output shape dimension [#159](https://github.com/tensorspace-team/tensorspace/issues/159)
* Improve keras preprocess doc [3a3cadb](https://github.com/tensorspace-team/tensorspace/commit/3a3cadb2400b0a75fbe6d52a5770b750886f43f6)
* Improve Functional model’s reset function to re-align layers in the same level [#158](https://github.com/tensorspace-team/tensorspace/issues/158)
* Deprecate multiInputs and inputShapes attribute in Loader in functional model [#168](https://github.com/tensorspace-team/tensorspace/issues/168)
* Deprecate outputsOrder configuration for functional model [#154](https://github.com/tensorspace-team/tensorspace/issues/154)

### Bug Fixed

* Fix dense layer overlay [#150](https://github.com/tensorspace-team/tensorspace/issues/150)
* Fix missing relation line in Activation2d [#157](https://github.com/tensorspace-team/tensorspace/issues/157)

### Repo

* Add CHANGELOG.md [306da0b](https://github.com/tensorspace-team/tensorspace/commit/306da0b3716f659d41e31e4700126f61f16bbf69)
* Add awesome-tensorspace.md [5ee9216](https://github.com/tensorspace-team/tensorspace/commit/5ee9216b0307add6b1b17e6256faf8563dffc7ba)

### Website

* Add missing reset() doc for model [badcd32](https://github.com/tensorspace-team/tensorspace/commit/badcd32bef3fd9ffe17f6764fe956f7ff81388e9) [8d6b9d5](https://github.com/tensorspace-team/tensorspace/commit/8d6b9d5929d44c8dcf8a01c451457874bc226d01)
* Add progress percentage for playground demos [#149](https://github.com/tensorspace-team/tensorspace/issues/149)
* Add shape constructor doc for layers [#160](https://github.com/tensorspace-team/tensorspace/issues/160)
* Change Yolo playground configuration [9e5afc3](https://github.com/tensorspace-team/tensorspace/commit/9e5afc378f9a5687159fcd24afd3e180324b161a)
* Change layerType for merge layer [#145](https://github.com/tensorspace-team/tensorspace/issues/145)
* Improve reset for lenet demo in playground [dbc9a58](https://github.com/tensorspace-team/tensorspace/commit/dbc9a586dfde817c5adb9e8e7f6cf05410c957fb)
* Improve doc view for large device [30ad994](https://github.com/tensorspace-team/tensorspace/commit/30ad994783c935573b5d918d8a7712031c217ea2)
* Improve playground button for lenet training example [6027684](https://github.com/tensorspace-team/tensorspace/commit/6027684d7e7c58e571eac278f4572324096ed69a)

## v0.2.0 - Hello TensorSpace v0.2

> 2018-12-4 ( 0.1.0 ==> 0.2.0 )

### Feature

* Add Merge functions for 1d and 2d layers [#14](https://github.com/tensorspace-team/tensorspace/issues/14)
* Add liveLoader to visualize training [#117](https://github.com/tensorspace-team/tensorspace/issues/117)
* Add "closeable" attribute for layers [#85](https://github.com/tensorspace-team/tensorspace/issues/85)
* Add "paging" for Input1d [#143](https://github.com/tensorspace-team/tensorspace/issues/143)
* Add model depth's attribute [#130](https://github.com/tensorspace-team/tensorspace/issues/130)
* Add layerLevel attribute to show layer's position in model [#144](https://github.com/tensorspace-team/tensorspace/issues/144)
* Add NMS and IOU for yolo [fb27b88](https://github.com/tensorspace-team/tensorspace/commit/fb27b88fbeb7aff29cc2ad502019f676e93a8578)
* Add source map for tensorspace.js and tensorspace.min.js [#137](https://github.com/tensorspace-team/tensorspace/issues/137)
* Add non-square convolutional window and strides [#128](https://github.com/tensorspace-team/tensorspace/issues/128)
* Change layerType definition for Merge layer [#134](https://github.com/tensorspace-team/tensorspace/issues/134)
* Change tfjs dependency version from 0.13.3 to 0.14.0+ [#146](https://github.com/tensorspace-team/tensorspace/issues/146)
* Support three.js r99 [#147](https://github.com/tensorspace-team/tensorspace/issues/147)
* Improve model's reset() method [#148](https://github.com/tensorspace-team/tensorspace/issues/148)

### Performance

* GC useless Tensors in time to make GPU memory friendly [#122](https://github.com/tensorspace-team/tensorspace/issues/122)

### Examples

* LeNet training visualization [link](https://github.com/tensorspace-team/tensorspace/tree/master/examples/trainingLeNet)
* Inceptionv3 [link](https://github.com/tensorspace-team/tensorspace/tree/master/examples/inceptionv3)

### Bug Fixed

* Fix relation line overlap [#142](https://github.com/tensorspace-team/tensorspace/issues/142)
* Fix missing line for concatenate3d [#142](https://github.com/tensorspace-team/tensorspace/issues/142)
* Fix function model render bug [#126](https://github.com/tensorspace-team/tensorspace/issues/126)
* Fix preamble license in uglify script [97b0dba](https://github.com/tensorspace-team/tensorspace/commit/97b0dbab9fbb31419cc4004bc9f41001aa7ed9ea)
* Fix merged layer relation bug [a10dc3f](https://github.com/tensorspace-team/tensorspace/commit/a10dc3f28a1d8f894210829526781eb23119a4f0)

### Website

* Add Inceptionv3 demo to playground [438c4ad](https://github.com/tensorspace-team/tensorspace/commit/438c4ad837e9b80d9c2b1493477bd82d7cb2dd68)
* Add LeNet training demo to playground [38d22a5](https://github.com/tensorspace-team/tensorspace/commit/38d22a5277bcb43dc341b70b265d0727a2a1985e)
* Add reset feature to playground [1b6d224](https://github.com/tensorspace-team/tensorspace/commit/1b6d2248b70878edd734086f6d43b15c4d66e319)
* Add loading pad to playground [e23d1a8](https://github.com/tensorspace-team/tensorspace/commit/e23d1a8135885f5c02c6a646cc520bed8ceb45d8) [1afa6b4](https://github.com/tensorspace-team/tensorspace/commit/1afa6b4d6d5c546e99bad2c6865193c92ff5eb54) ...
* Improve text height in API doc [2ee8550](https://github.com/tensorspace-team/tensorspace/commit/2ee855016fc860a7a9ea10148b5c500733392d62)
* Add missing "Add" method for Sequential model [a9a7eca](https://github.com/tensorspace-team/tensorspace/commit/a9a7eca88a51c333a6e358be15ac7be7bf82e9e3)
* Disable image selector in VGG16 demo [fde97cc](https://github.com/tensorspace-team/tensorspace/commit/fde97cc6da7cc537fbfa6dfa2790a981c15569cd)
* Improve Layer Introduction page [#129](https://github.com/tensorspace-team/tensorspace/issues/129)
* Improve Functional Model doc page [ae93517](https://github.com/tensorspace-team/tensorspace/commit/ae93517cf089de501eb89c6d98c94e630962833f)
* Update doc for new non-square convolutional window and strides feature [#145](https://github.com/tensorspace-team/tensorspace/issues/145)

## v0.1.0 - TensorSpace Hello World

> 2018-11-11

First Public Version!
