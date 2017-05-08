angular.module('myApp')
  .component('settingsComponent', {
    templateUrl: './templates/settings.html',
    controller: ($scope, UserService, Weather) => {
      // TODO you assign user by reference - this means that any change of $scope.user will affect on UserService.user too
    $scope.user = UserService.user;

      $scope.save = () => {
        UserService.save();
      };

      $scope.fetchCities = Weather.getCityDetails;
    }
  })
  // TODO CapitalCase in JS means constructor. w/o  exceptions
  .factory('UserService', () => {
    let defaults = {
      location: '30/Kiev'
    };

    let service = {
      user: {},
      save: () => {
        // TODO MDN recommendation: use methods instead of getters/setters - https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API  
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

