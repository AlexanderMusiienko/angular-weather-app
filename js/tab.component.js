angular.module('myApp')
  .component('tabComponent', {
    templateUrl: './templates/tab.html',
    controller: function($timeout, Weather, UserService) {
      // Build the date object
      this.date = {};

      // Build weather
      this.weather = {};

      this.user = UserService.user;
      Weather.getWeatherForecast(this.user.location)
        .then((data) => {
          this.weather.forecast = data;
        });

      // Update function
      let updateTime = () => {
        this.date.raw = new Date();
        $timeout(updateTime, 1000);
      };

      // Kick off the update function
      updateTime();

      this.user = UserService.user;
      Weather.getWeatherForecast(this.user.location)
        .then(data => {
          this.weather.forecast = data;
        })
    }
  })
  .provider('Weather', function() {
    let apiKey = "";

    this.setApiKey = key => {
      if (key) this.apiKey = key;
    };

    this.getUrl = function(type, ext) {
      return "http://api.wunderground.com/api/" +
        this.apiKey + "/" + type + "/q/" +
        ext + '.json';
    };

    this.$get = function($q, $http) {
      let self = this;
      return {
        getWeatherForecast: (city) => {
          let d = $q.defer();
          $http({
            method: 'GET',
            url: self.getUrl("forecast", city),
            cache: true
          }).then((result) => {
            d.resolve(result.data.forecast.simpleforecast);
          }).catch((err) => {
            d.reject(err);
          });
          return d.promise;
        },
        getCityDetails: function(query) {
          let d = $q.defer();
          $http({
            method: 'GET',
            url: "http://autocomplete.wunderground.com/" + "aq?query=" + query
          }).then(function(data) {
            d.resolve(data.data.RESULTS);
          }).catch(function(err) {
            d.reject(err);
          });
          return d.promise;
        }
      }
    }
  })
  .config(function(WeatherProvider) {
    WeatherProvider.setApiKey('f51543211efa5f38');
  });