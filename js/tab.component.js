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
        // TODO move update time to constants
        // TODO cancel timer on scope destroy - there is common rule for timers/intervals/event bindings:
        // TODO "For each subscribe you need have unsibscribe"
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
  // TODO  Same, Capital case for constructor
  .provider('Weather', function() {
    let apiKey = "";

    this.setApiKey = key => {
      // TODO with the following approach you cannot remove apiKey
      if (key) this.apiKey = key;
    };

    this.getUrl = function(type, ext) {
      // TODO if you use `let` - then you can use Template Literals too
      return "http://api.wunderground.com/api/" +
        this.apiKey + "/" + type + "/q/" +
        ext + '.json';
    };

    this.$get = function($q, $http) {
      let self = this;
      return {
        getWeatherForecast: (city) => {
          // TODO you do not need additional defer variable here, `return $http...` will be enough
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
    // TODO move API KEY to config/ENV variable
    // TODO  just an option - you can use angular.constant/.value for api key, this will allows you replace  Weather provider with factory
    WeatherProvider.setApiKey('f51543211efa5f38');
  });