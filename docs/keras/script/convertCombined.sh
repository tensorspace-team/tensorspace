#!/usr/bin/env bash
tensorspacejs_converter \
    --input_model_from="keras" \
    --input_model_format="topology_weights_combined" \
    --output_node_names='Conv2D_1,MaxPooling2D_1,Conv2D_2,MaxPooling2D_2,Dense_1,Dense_2,Softmax' \
    ./rawModel/combined/mnist.h5 \
    ./convertedModel/