#!/usr/bin/env bash
tensorspacejs_converter \
    --input_type="tfjs" \
    --output_layer_names='myPadding,myConv1,myMaxPooling1,myConv2,myMaxPooling2,myDense1,myDense2,myDense3' \
    ./rawModel/mnist.json \
    ./convertedModel/