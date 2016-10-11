//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'components/**/*.js',
      'forecast/**/*.js',
      'currentWeather/**/*.js'
    ],


    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],
    reporters: ['dots', 'kjhtml'], // 'coverage' available

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-jasmine-html-reporter',
      'karma-coverage'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    }

  });
};
