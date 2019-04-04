#!/usr/bin/env bash
tensorspacejs_converter \
    --input_model_from="tensorflow" \
    --input_model_format="tf_frozen" \
    --output_layer_names="MyConv2D_1,MyMaxPooling2D_1,MyConv2D_2,MyMaxPooling2D_2,MyDense_1,MyDense_2,MySoftMax" \
    ./rawModel/frozen/frozen_model.pb \
    ./convertedModel/graphModel