# Hello Angular Example
This is a minimum Tensorspace example in AngularJS. Code scaffold is create with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.3.

### Quick Start (Beta - for review)

1. (Optional) If tensorspace v0.4.0 is not published yet. Publish local tensorspace module with `yalc`.

	```shell
	# Create ~/.yalc/tensorspace folder to simulate npm publish
	cd {TENSORSPACE_REPO}
	npm run publish-local

	# Does two things:
	# 1. copy tensorspace from ~/.yalc/packages/tensorspace to
	# 	./examples/angular-examle/.yalc/tensorspace
	# 	
	# 2. create a new entry in package.json file
	# 	"tensorspace": "file:.yalc/tensorspace",
	cd examples/angular-example
	npm run add-tsp
	```

2. Install dependencies

	```shell
	npm install
	```

3. Start app

	```shell
	npm run start
	```

4. Load web page at `localhost:4200`. In dev mode of the browser, you should see `"Hello Angular!" from TensorSpace Loader.` in console output.
