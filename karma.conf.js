module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      useIframe: false,
      jasmine: {
        random: false,
      },
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      check: {
        emitWarning: false,
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      },
      reporters: [
        {
          type: 'html',
          dir: 'coverage/'
        },
        { type: 'lcovonly', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromePipeline', 'ChromeLocal'],
    customLaunchers: {
      ChromePipeline: {
        base: 'ChromeHeadless',
        flags: [
          '--disable-gpu',
          '--no-sandbox',
          '--disable-web-security',
        ]
      },
      ChromeLocal: {
        base: 'Chrome',
        flags: [
          '--disable-gpu',
          '--no-sandbox',
          '--disable-web-security',
        ]
      }
    },
    singleRun: true,
    restartOnFileChange: false,
  });
};
