# Weather App

You can check the online demo [here](https://trofa13.github.io/weather-app/app).

## Getting Started

```
$ git clone https://github.com/trofa13/weather-app.git && cd weather-app && npm install && npm start
```
Then you can check your browser `http://localhost:8000`

### Prerequisites
1. [NodeJS](http://nodejs.org/)
2. NPM - usually comes with node, but you can check this by typing `npm -v`
3. Bower is supposed to be installed globally. You can check this by typing in your console `bower -v`.
If it is not installed, then type `$ npm install bower -g`

## Testing

There are two kinds of tests in the weather app: Unit tests and end-to-end tests.

### Running Unit Tests

This app comes with some unit tests. These are written in
[Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. 

```
npm test
```

### End to end testing

There are also some unit tests in this app, again written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] E

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests are found in `e2e-tests/scenarios.js`

```
npm start
```

In addition, since Protractor is built upon WebDriver we need to install this.  The angular-seed
project comes with a predefined script to do this:

```
npm run update-webdriver
```

This will download and install the latest version of the stand-alone WebDriver tool.

Once you have ensured that the development web server hosting our application is up and running
and WebDriver is updated, you can run the end-to-end tests using the supplied npm script:

```
npm run protractor
```

This script will execute the end-to-end tests against the application being hosted on the
development server.

**Note:**
Under the hood, Protractor uses the [Selenium Stadalone Server][selenium], which in turn requires 
the [Java Development Kit (JDK)][jdk] to be installed on your local machine. Check this by running 
`java -version` from the command line.

If JDK is not already installed, you can download it [here][jdk-download].

## Contact

For more information on AngularJS please check out http://angularjs.org/

[bower]: http://bower.io
[git]: http://git-scm.com/
[http-server]: https://github.com/nodeapps/http-server
[jasmine]: https://jasmine.github.io
[jdk]: https://en.wikipedia.org/wiki/Java_Development_Kit
[jdk-download]: http://www.oracle.com/technetwork/java/javase/downloads/index.html
[karma]: https://karma-runner.github.io
[node]: https://nodejs.org
[npm]: https://www.npmjs.org/
[protractor]: https://github.com/angular/protractor
[selenium]: http://docs.seleniumhq.org/
