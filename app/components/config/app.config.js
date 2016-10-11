'use strict';

angular.module('weatherApp.config',[])

.constant('config', {
    apiBaseUrl: 'http://localhost:3030',
    config2: "Default config2"
})

.constant('weatherConfig',{
    apiBaseUrl: 'http://api.openweathermap.org/data/2.5',
    apiKey: '088c18cc1d6f1f2e5ed1c97e9da77df2',
    lang: 'ru'
});