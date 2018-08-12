import Sequential from './composite/Sequential';
import Conv2d from './layer/Conv2d';
import Dense from './layer/Dense';
import Flatten from './layer/Flatten';
import Reshape from './layer/Reshape';
import Input from './layer/Input';
import Output from './layer/Output';
import Pooling2d from './layer/Pooling2d';

let layers = {
	Input: Input,
	Output: Output,
	Conv2d: Conv2d,
	Dense: Dense,
	Flatten: Flatten,
	Reshape: Reshape,
	Pooling2d: Pooling2d
};

let model = {
	Sequential: Sequential
};

export {model, layers};