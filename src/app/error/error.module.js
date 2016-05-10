(function() {
  'use strict';

  angular
    .module('dados.error', [])
    .config(function config($stateProvider) {
      $stateProvider
        .state('forbidden', {
          url: '/forbidden',
          templateUrl: 'error/forbidden/forbiddenView.tpl.html',
          controller: 'ErrorStateController',
          controllerAs: 'error',
          data: {
            pageTitle: 'Forbidden'
          }
        })
        .state('notfound', {
          url: '/notfound',
          templateUrl: 'error/notfound/notfoundView.tpl.html',
          controller: 'ErrorStateController',
          controllerAs: 'error',
          data: {
            pageTitle: 'Not Found'
          }
        })
        .state('servererror', {
          url: '/servererror',
          templateUrl: 'error/servererror/servererrorView.tpl.html',
          controller: 'ErrorStateController',
          controllerAs: 'error',
          data: {
            pageTitle: 'Server Error'
          }
        });
    })
    .controller('ErrorStateController', ErrorStateController);

  ErrorStateController.$inject = ['$scope', '$state', 'DefaultRouteService'];

  function ErrorStateController($scope, $state, DefaultRoute) {
    var vm = this;

    // bindable variables
    vm.previousUrl = '';
    vm.pageTitle = $state.current.data.pageTitle;

    // bindable methods
    vm.goHome = goHome;

    /////////////////////////////////////////////////////////////////////////

    function goHome() {
      DefaultRoute.navigateHome();
    }

    // hitting back button triggers this event, which should then try to resolve whatever the previous state was
    $scope.$on('$locationChangeStart', function(e, currentHref, prevHref) {
      vm.previousUrl = prevHref;
      if ($state.is('forbidden') || $state.is('notfound') || $state.is('servererror') && prevHref !== currentHref) {
        DefaultRoute.resolve();
      }
    });
  }

})();
