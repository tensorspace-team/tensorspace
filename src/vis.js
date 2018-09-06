import { Sequential } from "./vis-model/Sequential";
import { PixelSequential } from "./vis-model/PixelSequential";

import { Conv2d } from "./layer/prime/Conv2d";
import { Input } from "./layer/prime/Input";
import { Input3d } from "./layer/prime/Input3d";
import { Output } from "./layer/prime/Output";
import { Flatten } from "./layer/prime/Flatten";
import { Pooling2d } from "./layer/prime/Pooling2d";
import { Reshape } from "./layer/prime/Reshape";
import { Dense } from "./layer/prime/Dense";
import { Padding2d } from "./layer/prime/Padding2d";

import { PixelConv2d } from "./layer/pixel/PixelConv2d";
import { PixelPadding } from "./layer/pixel/PixelPadding2d";
import { PixelInput } from "./layer/pixel/PixelInput";
import { PixelPooling2d } from "./layer/pixel/PixelPooling2d";
import { PixelFlatten } from "./layer/pixel/PixelFlatten";
import { PixelDense } from "./layer/pixel/PixelDense";
import { PixelReshape } from "./layer/pixel/PixelReshape";
import { PixelOutput } from "./layer/pixel/PixelOutput";
import {GlobalPooling2d} from "./layer/prime/GlobalPooling2d";

let layers = {
	Input: Input,
	Input3d: Input3d,
	Output: Output,
	Conv2d: Conv2d,
	Dense: Dense,
	Flatten: Flatten,
	Reshape: Reshape,
	Pooling2d: Pooling2d,
	Padding2d: Padding2d,
	GlobalPooling2d: GlobalPooling2d,
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