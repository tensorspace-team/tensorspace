## Introduction: Model Preprocessing
It is confusing for the new TensorSpace developer to preprocess the pre-trained models: "What is a model preprocessing?", "Why do we need to preprocess the model?" and " How can we make it?". Then this introduction should somehow help you to understand the preprocessing.

**What is a model preprocessing?**<br/>
A model preprocessing for TensorSpace is the process to detect necessary data (intermediate layers/tensors), extract intermediate outputs from hidden layers and convert to TensorSpace compatible tfjs model format.



**Why do we need a model preprocessing?**<br/>
Typically, the trained model consumes the input data from the users and then computes among different layers/tensors and finally returns the meaningful outputs which can be used for further evaluations.

<p align="center">
<img width=800 src="https://github.com/zchholmes/tsp_image/blob/master/General/intro_preprocess_s.png">
</p>
<p align="center">
<b>Fig. 1</b> - Classic pre-trained model with single output
</p>

TensorSpace is a flexible library: we can construct a model **without** any existed network or trained weights to show the general structure of the model. It is intuitive to design and explain the prototype of a network before any construction and training.

However, the beauties of TensorSpace as a 3D data visualization model are not only about showing the model structure - how to construct a network, but also about presenting the data interactions among different intermediate layers - how to generate the final outputs step by step.

Hence, we need to find a way to collect the intermediate outputs from not only the last few output layers, but also from the intermediate hidden layers.

<p align="center">
<img width=800 src="https://github.com/zchholmes/tsp_image/blob/master/General/intro_preprocess_m.png">
</p> 
<p align="center">
<b>Fig. 2</b> - TensorSpace compatible model with intermediate outputs
</p>


**How do we preprocess a model?**<br/>
To fully apply the core functionality of TensorSpace, we need to transfer the classic model (only returns the final output) into a new model (generates all intermediate outputs we want to present). For the following sections, we introduce how to preprocess the models built by TensorFlow, Keras, tf.Keras and TensorFlow.js.

* [TensorFlow model preprocessing tutorial](https://github.com/syt123450/tensorspace/wiki/%5BTutorial%5D--TensorFlow-model-preprocessing-tutorial)
* [Keras model preprocessing tutorial](https://github.com/syt123450/tensorspace/wiki/%5BTutorial%5D--Keras-model-preprocessing-tutorial)
* [tf.keras model preprocessing tutorial](https://github.com/syt123450/tensorspace/wiki/%5BTutorial%5D--tf.keras-model-preprocessing-tutorial)
* [TensorFlow.js model preprocessing tutorial](https://github.com/syt123450/tensorspace/wiki/%5BTutorial%5D--TensorFlow.js-preprocessing-tutorial)
