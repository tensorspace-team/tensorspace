/**
 * End-to-end test example for Tensorspace.js
 */

describe('Tensorspace e2e tests:', () => {
  let container;
  let model;

  beforeAll(() => {
    // Load template.html as testing context
    document.body.innerHTML = __html__['test/template.html'];
    container = document.getElementById("container");
  });

  beforeEach(() => {
    model = new TSP.models.Sequential(container);
  });

  it('Div \"container\" should be created:', () => {
    let div = document.getElementById('container');
    expect(div).not.toBeNull();
    expect(div.nodeName).toBe('DIV');
  });

  it('Should create layer \"GreyscaleInput\"', () => {
    let greyscaleInputLayer = new TSP.layers.GreyscaleInput({
      shape: [ 28, 28 ]
    });
    model.add(greyscaleInputLayer);

    model.init(() => {
      expect(greyscaleInputLayer.layerType).toBe('GreyscaleInput');
      expect(greyscaleInputLayer.outputShape[0]).toBe(28);
      expect(greyscaleInputLayer.outputShape[1]).toBe(28);
    });
  });

  it('Should create layer \"conv2d\"', () => {
    let greyscaleInputLayer = new TSP.layers.GreyscaleInput({
      shape: [ 28, 28 ]
    });
    model.add(greyscaleInputLayer);

    let conv2dLayer = new TSP.layers.Conv2d( {
      shape: [ 28, 28, 3 ]
    });
    model.add(conv2dLayer);

    // expect(conv2dLayer.outputShape).not.toBeDefined();
    model.init(() => {
      expect(conv2dLayer.layerType).toBe('Conv2d');
      expect(conv2dLayer.inputShape[0]).toBe(28);
      expect(conv2dLayer.inputShape[1]).toBe(28);

      expect(conv2dLayer.outputShape[0]).toBe(28);
      expect(conv2dLayer.outputShape[1]).toBe(28);
      expect(conv2dLayer.outputShape[2]).toBe(3);
    });

  });

  afterEach(() => {
    model = null;
  });
});
