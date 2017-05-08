angular.module('myApp', ['ui.router'])
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        abstract: true,
      })
      .state('home.tab', {
        url: '',
        views: {
          // TODO use human-readable names
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
      // TODO are you sure that you need both restictions?
      restrict: 'EA',
      // TODO use controller-as syntax
      scope: {
        autoFill: '&',
        ngModel: '='
      },
      compile: function(tEle, tAttrs) {
        // TODO keep templates in separate files
        let tplEl = angular.element('<div class="typeahead">' +
          '<input type="text" autocomplete="off" />' +
          // TODO extra id
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

          // TODO I'm sure that you can replace this manual binding with ngKeyup
          // TODO in any case for any .bind/.on/etc you neeed appropriate .unbind/.off/etc
          input.bind('keyup', function(e) {
            val = ele.val();
            if (val.length < minKeyCount) {
              if (timer) $timeout.cancel(timer);
              scope.reslist = null;
            } else {
              // TODO @see https://lodash.com/docs/4.17.4#throttle and https://lodash.com/docs/4.17.4#debounce
              if (timer) $timeout.cancel(timer);
              timer = $timeout(function() {
                // TODO function, that returns another function, that expects some input params - it is bad idea
                scope.autoFill()(val)
                // TODO  what about error handling?
                  .then(function(data) {
                    if (data && data.length > 0) {
                      scope.reslist = data;
                      scope.ngModel = data[0].name;
                    }
                  });
              }, 300);
            }
          });
          // TODO ngBlur?
          // Hide the reslist on blur
          input.bind('blur', function(e) {
            scope.reslist = null;
            // TODO why $digest, not $apply? @see guideline https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest
            // TODO if you really need $digest here (for some optimization purposes, maybe) - then you should be aware of
            // TODO such kind of problems: http://stackoverflow.com/questions/12729122/angularjs-prevent-error-digest-already-in-progress-when-calling-scope-apply
            scope.$digest();
          });
        }
      }
    }
  });


