(function() {
  'use strict';

  angular.module('dados', [
    'ui.router',
    'toastr',
    'ngAnimate',
    'ngResource',

    'templates-app',
    'templates-common',
    'config.interceptors',

  	'dados.auth',
    'dados.study',
    'dados.user',
    'dados.header',
    'dados.workflow',
    'dados.formbuilder',

    'dados.filters.formatter',
    'dados.filters.type',

    'dados.common.directives.dadosError',
    'dados.common.directives.hateoas',
    'dados.common.directives.queryBuilder',
    'dados.common.services.csrf'
  ])
  .config(dadosConfig)
  .controller('DadosController', DadosController);

  dadosConfig.$inject = ['$httpProvider', '$stateProvider', 'toastrConfig'];

  function dadosConfig($httpProvider, $stateProvider, toastrConfig) { 
    $httpProvider.interceptors.push('httpRequestInterceptor');
    $stateProvider.state('hateoas', {
      template: '<div class="container" hateoas-client></div>'
    });

    angular.extend(toastrConfig, {
      autoDismiss: true,
      closeButton: true,
      positionClass: 'toast-bottom-right',
      progressBar: true,
      tapToDismiss: true,
      timeOut: 3000
    });
  }
 
  DadosController.$inject = ['$scope', '$state', '$location'];

  function DadosController($scope, $state, $location) {

    var vm = this;
    vm.submenu = {};

    if (_.isEmpty($location.path())) {
      $location.path('/study');
    } else {
      $state.go('hateoas');  
    }    

    $scope.$on('$locationChangeSuccess', function(e, current, prev) {
      var prevBaseUrl = _.parseUrl($location, prev)[0];
      var currBaseUrl = _.first(_.pathnameToArray($location.path()));

      if (prevBaseUrl !== currBaseUrl) {
        vm.submenu = {};
      }

      $scope.pageTitle = _.titleCase($location.path()
                                       .replace(/\//g, ' ')
                                       .toLowerCase()
                                       .trim());     
    }); 
  }

})();
