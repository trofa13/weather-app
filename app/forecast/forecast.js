(function(){
    'use strict';

    angular.module('weatherApp.forecast', ['ngRoute'])

        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/forecast', {
                templateUrl: 'forecast/forecast.html',
                controller: 'ForecastCtrl',
                controllerAs: '$ctrl'
            });
        }])

        .controller('ForecastCtrl', ['ForecastService', '$routeParams', '$q', function(ForecastService, $routeParams, $q) {

            var vm = this;
            vm.submit = submit;
            vm.geolocateAndSearch = geolocateAndSearch;
            vm.autocompleteOptions =  { types: '(cities)' };
            vm.alerts = [];

            vm.addAlert = function(type, msg) {
                vm.alerts.push({type: type, msg: msg});
            };

            vm.closeAlert = function(index) {
                vm.alerts.splice(index, 1);
            };

            if($routeParams.lat && $routeParams.lng){
                var LatLng = {
                    lat: $routeParams.lat,
                    lon: $routeParams.lng
                };
                ForecastService.getForecastByLatLng(LatLng)
                    .then(function(forecasts){
                        vm.forecasts = forecasts;
                    })
                    .catch(function(err){
                        vm.addAlert('danger', err);
                    });
            }

            function submit(details){
                var LatLng = {
                    lat: details.geometry.location.lat(),
                    lon: details.geometry.location.lng()
                };
                vm.LatLng = '?lat='+ LatLng.lat +'&lng=' + LatLng.lon;
                ForecastService.getForecastByLatLng(LatLng)
                    .then(function(forecasts){
                        vm.forecasts = forecasts;
                    })
                    .catch(function(err){
                        vm.addAlert('danger', err);
                    });
            }

            function geolocate(){
                return $q(function(resolve, reject){
                    if ('geolocation' in navigator) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                                resolve(position);
                            },
                            function(){
                                reject('Вы не предоставили доступ к Вашему местоположению, однако Вы все равно можете найти погоду, воспользовавшись формой поиска.')
                            });
                    } else {
                        reject('К сожалению, Ваш браузер не поддерживает функцию геолокации. Воспользуйтесь формой пооска, пожалуйста.');
                    }
                });
            }

            function geolocateAndSearch(){
                geolocate()
                    .then(function(position){
                        var LatLng = {
                            lat: position.coords.latitude,
                            lon: position.coords.longitude
                        };
                        vm.LatLng = '?lat='+ LatLng.lat +'&lng=' + LatLng.lon;
                        ForecastService.getForecastByLatLng(LatLng)
                            .then(function(forecasts){
                                vm.forecasts = forecasts;
                            });
                    })
                    .catch(function(err){
                        vm.addAlert('danger', err);
                    });
            }
        }])

        .service('ForecastService', ['weatherConfig', '$http', '$q', function(weatherConfig, $http, $q){
            return {
                getForecastByLatLng: getForecastByLatLng
            };

            function getForecastByLatLng(LatLng){
                var params = Object.assign({}, LatLng, { APPID: weatherConfig.apiKey, lang: weatherConfig.lang});
                return $http.get(weatherConfig.apiBaseUrl + '/forecast' , { params: params } )
                    .then(function(response){
                        return processResponse(response.data.list);
                    });
            }

            function processResponse(weatherItemsArray){
                return weatherItemsArray.map(function(item){
                    var usefulData = {};
                    usefulData.temp = Math.round(item.main.temp - 273); // Convert from Kelvin to Celsius
                    usefulData.pressure =  Math.round(item.main.pressure * 0.75006375541921); // Convert hPa to mmHg
                    usefulData.description = item.weather[0].description;
                    usefulData.humidity = item.main.humidity;
                    usefulData.iconUrl = 'http://openweathermap.org/img/w/'+ item.weather[0].icon +'.png';
                    usefulData.windSpeed = item.wind.speed;
                    usefulData.windDirection = mapWindDirection(item.wind.deg);
                    usefulData.dateTime = new Date(item.dt_txt);
                    return usefulData;
                });
            }

            function mapWindDirection(degrees){
                if(degrees>=0 && degrees<90){
                    return 'СВ';
                }

                if(degrees>=90 && degrees<180){
                    return 'ЮВ';
                }

                if(degrees>=180 && degrees<270){
                    return 'ЮЗ';
                }

                if(degrees>=270 && degrees<360){
                    return 'СЗ';
                }
            }

        }]);
})();