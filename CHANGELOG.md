# Change Log

All notable changes to TensorSpace will be documented in this file.

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