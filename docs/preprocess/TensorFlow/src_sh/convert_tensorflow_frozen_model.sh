onn='MyConv2D_1,MyMaxPooling2D_1,MyConv2D_2,MyMaxPooling2D_2,MyDense_1,MyDense_2,MySoftMax'
tensorflowjs_converter \
    --input_format=tf_frozen_model \
    --output_node_names=$onn \
    --saved_model_tags=serve \
    ./saved_models/model.pb \
    ./saved_models/json_models