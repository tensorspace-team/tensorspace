import { Sequential } from "./vis-model/Sequential";
import { PixelSequential } from "./vis-model/PixelSequential";

import { Conv1d } from "./layer/prime/Conv1d";
import { Conv2d } from "./layer/prime/Conv2d";
import { Input } from "./layer/prime/Input";
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

import { PixelConv2d } from "./layer/pixel/PixelConv2d";
import { PixelPadding } from "./layer/pixel/PixelPadding2d";
import { PixelInput } from "./layer/pixel/PixelInput";
import { PixelPooling2d } from "./layer/pixel/PixelPooling2d";
import { PixelFlatten } from "./layer/pixel/PixelFlatten";
import { PixelDense } from "./layer/pixel/PixelDense";
import { PixelReshape } from "./layer/pixel/PixelReshape";
import { PixelOutput } from "./layer/pixel/PixelOutput";

let layers = {
	Input: Input,
	Input3d: Input3d,
	Output: Output,
	Output2d: Output2d,
	Conv1d: Conv1d,
	Conv2d: Conv2d,
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

	PixelConv2d: PixelConv2d,
	PixelPadding: PixelPadding,
	PixelInput: PixelInput,
	PixelPooling2d: PixelPooling2d,
	PixelFlatten: PixelFlatten,
	PixelDense: PixelDense,
	PixelReshape: PixelReshape,
	PixelOutput: PixelOutput
};

let model = {
	Sequential: Sequential,
	PixelSequential: PixelSequential
};

export {model, layers};