angular.module('myApp')
  .component('settingsComponent', {
    templateUrl: './templates/settings.html',
    controller: ($scope, UserService, Weather) => {
      $scope.user = UserService.user;

      $scope.save = () => {
        UserService.save();
      };

      $scope.fetchCities = Weather.getCityDetails;
    }
  })
  .factory('UserService', () => {
    let defaults = {
      location: '30/Kiev'
    };

    let service = {
      user: {},
      save: () => {
        sessionStorage.presently = angular.toJson(service.user);
      },
      restore: () => {
        // Pull from sessionStorage
        service.user = angular.fromJson(sessionStorage.presently) || defaults;

        return service.user;
      }
    };
    // Immediately call restore from the session storage
    // so we have our user data available immediately
    service.restore();
    return service;
  });

