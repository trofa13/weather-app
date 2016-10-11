(function(){
    'use strict';

    angular.module('weatherApp.currentWeather', ['ngRoute'])

        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/current-weather', {
                templateUrl: 'currentWeather/currentWeather.html',
                controller: 'CurrentWeatherCtrl',
                controllerAs: '$ctrl'
            });
        }])

        .controller('CurrentWeatherCtrl', ['CurrentWeatherService', '$q' ,function(CurrentWeatherService, $q) {
            var vm = this;
            vm.submit = submit;
            vm.geolocateAndSearch = geolocateAndSearch;
            vm.alerts = [];
            vm.getAll = getAll;
            vm.getSchema = getSchema;
            vm.autocompleteOptions =  { types: '(cities)' };
            vm.requests = {};
            vm.schema = {};

            vm.addAlert = function(type, msg) {
                vm.alerts.push({type: type, msg: msg});
            };

            vm.closeAlert = function(index) {
                vm.alerts.splice(index, 1);
            };



            function submit(details){
                var LatLng = {
                    lat: details.geometry.location.lat(),
                    lon: details.geometry.location.lng()
                };
                vm.LatLng = '?lat='+ LatLng.lat +'&lng=' + LatLng.lon;
                CurrentWeatherService.getCurrentWeatherByLatLng(LatLng)
                    .then(function(currentWeather){
                        vm.currentWeather = currentWeather;
                    })
                    .catch(function(err){
                        vm.addAlert('danger', err);
                    });
            }

            function geolocate(){
                return $q(function(resolve, reject){
                    if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                                resolve(position);
                            },
                            function(){
                                reject('Вы не предоставили доступ к Вашему местоположению, однако Вы все равно можете найти погоду, воспользовавшись формой поиска.')
                            });
                        /* геолокация доступна */
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
                        CurrentWeatherService.getCurrentWeatherByLatLng(LatLng)
                            .then(function(currentWeather){
                                vm.currentWeather = currentWeather;
                            });
                    })
                    .catch(function(err){
                        vm.addAlert('danger', err);
                    });
            }

            function getSchema(){
                return ForecastService.getSchema()
                    .then(function(data){
                        vm.schema = data;
                        vm.tableHeaders = Object.keys(data).map(function(header, index) {
                            return hideUnusedHeaders(header);
                        });
                        vm.translatedTableHeaders = vm.tableHeaders.map(function(header){
                            return translateTableHeaders(header);
                        });
                        console.log(vm.tableHeaders)
                    })
                    .catch(function(err){
                        //TODO: handle error
                    });
            }
            function getAll(params){
                return ForecastService.getAll(params)
                    .then(function(data){
                        vm.requests = data;
                    })
                    .catch(function(err){
                        //TODO: handle error
                    });
            }


        }])

        .service('CurrentWeatherService', ['config', 'weatherConfig', '$http', '$q', function(config, weatherConfig, $http, $q){
            return {
                getCurrentWeatherByLatLng: getCurrentWeatherByLatLng
            };

            function getCurrentWeatherByLatLng(LatLng){
                var params = Object.assign({}, LatLng, { APPID: weatherConfig.apiKey, lang: weatherConfig.lang});
                return $http.get(weatherConfig.apiBaseUrl + '/weather' , { params: params } )
                 .then(function(response){

                    return processResponse(response.data);
                     // Use this to debug safely
                     // localStorage.setItem('SainP', JSON.stringify(response.data))
                 });

                // Uncomment this for debugging
               /*return $q(function(resolve){
                    var resp = JSON.parse(localStorage.getItem('SainP'));

                    return resolve(processResponse(resp));
                });*/
            }

            function processResponse(response){
                var resp = Object.assign({}, response);
                console.log('original url', resp);
                var usefulData = {};
                usefulData.temp = Math.round(resp.main.temp - 273); // Convert from Kelvin to Celsius
                usefulData.pressure =  Math.round(resp.main.pressure * 0.75006375541921); // Convert hPa to mmHg
                usefulData.description = resp.weather[0].description;
                usefulData.humidity = resp.main.humidity;
                usefulData.iconUrl = 'http://openweathermap.org/img/w/'+ resp.weather[0].icon +'.png';
                usefulData.windSpeed = resp.wind.speed;
                usefulData.windDirection = mapWindDirection(resp.wind.deg);
                return usefulData;
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