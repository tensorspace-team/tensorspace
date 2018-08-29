import { Sequential } from "./composite/MapSequential";
import { PixelSequential } from "./composite/PixelSequential";

import { Conv2d } from "./layer/map/MapConv2d";
import { Input } from "./layer/map/MapInput";
import { Output } from "./layer/map/MapOutput";
import { Flatten } from "./layer/map/MapFlatten";
import { Pooling2d } from "./layer/map/MapPooling2d";
import { Reshape } from "./layer/map/MapReshape";
import { Dense } from "./layer/map/MapDense";
import { Padding2d } from "./layer/map/MapPadding2d";

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
	Output: Output,
	Conv2d: Conv2d,
	Dense: Dense,
	Flatten: Flatten,
	Reshape: Reshape,
	Pooling2d: Pooling2d,
	Padding2d: Padding2d,
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