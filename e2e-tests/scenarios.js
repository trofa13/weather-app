'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /forecast when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch('/current-weather');
  });


  describe('/current-weather', function() {

    beforeEach(function() {
      browser.get('index.html#!/current-weather');
    });


    it('should render current weather when user navigates to /current-weather', function() {
      expect(element.all(by.css('.h1')).first().getText()).
        toMatch(/Текущая погода/);
    });

  });


  describe('/forecast', function() {

    beforeEach(function() {
      browser.get('index.html#!/forecast');
    });


    it('should render forecast when user navigates to /forecast', function() {
      expect(element.all(by.css('.h1')).first().getText()).
        toMatch(/Прогноз/);
    });

  });
});
