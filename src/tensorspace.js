import { Sequential } from "./vis-model/Sequential";
import { PixelSequential } from "./vis-model/PixelSequential";

import { Conv1d } from "./layer/prime/Conv1d";
import { Conv2d } from "./layer/prime/Conv2d";
import { Conv2dTranspose } from "./layer/prime/Conv2dTranspose";
import { Cropping1d } from "./layer/prime/Cropping1d";
import { Cropping2d } from "./layer/prime/Cropping2d";
import { Input1d } from "./layer/prime/Input1d";
import { Input2d } from "./layer/prime/Input2d";
import { Input3d } from "./layer/prime/Input3d";
import { Output } from "./layer/prime/Output1d";
import { Output2d } from "./layer/prime/Output2d";
import { Flatten } from "./layer/prime/Flatten";
import { Pooling1d } from "./layer/prime/Pooling1d";
import { Pooling2d } from "./layer/prime/Pooling2d";
import { Reshape } from "./layer/prime/Reshape";
import { Dense } from "./layer/prime/Dense";
import { Padding1d } from "./layer/prime/Padding1d";
import { Padding2d } from "./layer/prime/Padding2d";
import { UpSampling1d } from "./layer/prime/UpSampling1d";
import { UpSampling2d } from "./layer/prime/UpSampling2d";
import { GlobalPooling1d } from "./layer/prime/GlobalPooling1d";
import { GlobalPooling2d } from "./layer/prime/GlobalPooling2d";
import { BasicLayer1d } from "./layer/prime/BasicLayer1d";
import { BasicLayer2d } from "./layer/prime/BasicLayer2d";
import { BasicLayer3d } from "./layer/prime/BasicLayer3d";
import { Activation1d } from "./layer/prime/Activation1d";
import { Activation2d } from "./layer/prime/Activation2d";
import { Activation3d } from "./layer/prime/Activation3d";

import { PixelConv2d } from "./layer/pixel/PixelConv2d";
import { PixelPadding } from "./layer/pixel/PixelPadding2d";
import { PixelInput } from "./layer/pixel/PixelInput";
import { PixelPooling2d } from "./layer/pixel/PixelPooling2d";
import { PixelFlatten } from "./layer/pixel/PixelFlatten";
import { PixelDense } from "./layer/pixel/PixelDense";
import { PixelOutput } from "./layer/pixel/PixelOutput";

import { Add } from "./merge/Add";
import { Concatenate } from "./merge/Concatenate";
import { Subtract } from "./merge/Subtract";
import { Maximum } from "./merge/Maximum";
import { Average } from "./merge/Average";
import { Dot } from "./merge/Dot";
import { Multiply } from "./merge/Multiply";

let layers = {
	Input1d: Input1d,
	Input2d: Input2d,
	Input3d: Input3d,
	Output: Output,
	Output2d: Output2d,
	Conv1d: Conv1d,
	Conv2d: Conv2d,
	Conv2dTranspose: Conv2dTranspose,
	Cropping1d: Cropping1d,
	Cropping2d: Cropping2d,
	Dense: Dense,
	Flatten: Flatten,
	Reshape: Reshape,
	Pooling1d: Pooling1d,
	Pooling2d: Pooling2d,
	Padding1d: Padding1d,
	Padding2d: Padding2d,
	GlobalPooling1d: GlobalPooling1d,
	GlobalPooling2d: GlobalPooling2d,
	UpSampling1d: UpSampling1d,
	UpSampling2d: UpSampling2d,
	Layer1d: BasicLayer1d,
	Layer2d: BasicLayer2d,
	Layer3d: BasicLayer3d,
	Activation1d: Activation1d,
	Activation2d: Activation2d,
	Activation3d: Activation3d,

	PixelConv2d: PixelConv2d,
	PixelPadding: PixelPadding,
	PixelInput: PixelInput,
	PixelPooling2d: PixelPooling2d,
	PixelFlatten: PixelFlatten,
	PixelDense: PixelDense,
	PixelOutput: PixelOutput
};

let model = {
	Sequential: Sequential,
	PixelSequential: PixelSequential
};

export {model, layers, Add, Concatenate, Subtract, Dot, Multiply, Average, Maximum};