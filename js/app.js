angular.module('myApp', ['ui.router'])
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        abstract: true,
      })
      .state('home.tab', {
        url: '',
        views: {
          'x@': {
            template: '<tab-component></tab-component>'
          }
        }
      })
      .state('home.settings', {
        url: '/settings',
        views: {
          'x@': {
            template: '<settings-component></settings-component>'
          }
        }
      })
  })
  .directive('autoFill', function($timeout) {
    return {
      restrict: 'EA',
      scope: {
        autoFill: '&',
        ngModel: '='
      },
      compile: function(tEle, tAttrs) {
        let tplEl = angular.element('<div class="typeahead">' +
          '<input type="text" autocomplete="off" />' +
          '<ul id="autolist" ng-show="reslist">' +
          '<li ng-repeat="res in $ctrl.reslist">{{res.name}}</li>' +
          '</ul>' +
          '</div>');
        let input = tplEl.find('input');
        input.attr('type', tAttrs.type);
        input.attr('ng-model', tAttrs.ngModel);
        tEle.replaceWith(tplEl);

        return function(scope, ele, attrs) {
          let minKeyCount = attrs.minKeyCount || 3,
            timer,
            input = ele.find('input');

          input.bind('keyup', function(e) {
            val = ele.val();
            if (val.length < minKeyCount) {
              if (timer) $timeout.cancel(timer);
              scope.reslist = null;
            } else {
              if (timer) $timeout.cancel(timer);
              timer = $timeout(function() {
                scope.autoFill()(val)
                  .then(function(data) {
                    if (data && data.length > 0) {
                      scope.reslist = data;
                      scope.ngModel = data[0].name;
                    }
                  });
              }, 300);
            }
          });
          // Hide the reslist on blur
          input.bind('blur', function(e) {
            scope.reslist = null;
            scope.$digest();
          });
        }
      }
    }
  });


