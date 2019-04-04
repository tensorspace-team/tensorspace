#!/usr/bin/env bash
tensorspacejs_converter \
    --input_model_from="tensorflow" \
    --input_model_format="tf_keras_separated" \
    --output_layer_names="Conv2D_1,MaxPooling2D_1,Conv2D_2,MaxPooling2D_2,Dense_1,Dense_2,Softmax" \
    ./rawModel/keras_separated/topology.json,./rawModel/keras_separated/weights.h5 \
    ./convertedModel/layerModel