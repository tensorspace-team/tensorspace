/**
 * @author botime / https://github.com/botime
 */

// puppeteer will download Chromium during
process.env.CHROME_BIN = require('puppeteer').executablePath();

let isCI = typeof process.env.CI !== 'undefined' &&
    (process.env.CI.toLowerCase() == 'true');

let browser = isCI ? 'ChromeHeadless' : 'Chrome';

module.exports = function(config) {

  config.set({

    browsers: [browser],

    captureTimeout: 120000,

    reportSlowerThan: 500,

    browserNoActivityTimeout: 180000,

    frameworks: ['jasmine'],

    client: {

        useIframe: false,

        runInParent: false,

        captureConsole: false
      },

    reporters: [ 'spec' ],

    files: [

      { pattern: 'test/lib/three.min.js', included: true },

      { pattern: 'test/lib/stats.min.js', included: true },

      { pattern: 'test/lib/tween.min.js', included: true },

      { pattern: 'test/lib/TrackballControls.js', included: true },

      { pattern: 'test/lib/tf.min.js', included: true },

      { pattern: 'build/tensorspace.js', included: true },

      {pattern: 'test/e2e/template.html', included: true},

      {pattern: 'test/e2e/*', included: true, watch: true},

    ],
    preprocessors: {

      'test/e2e/*.html': ['html2js']

    },

    logLevel: 'debug',

    autoWatch: false
  })
};
