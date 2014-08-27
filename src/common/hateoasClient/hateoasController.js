angular.module('hateoas.controller', 
    ['ngTable', 'dados.common.services.sails',
     'dados.common.directives.formPopup'])
  .controller('HateoasController', 
    ['$scope', '$rootScope', '$state', '$resource', '$injector',
     'ngTableParams', 'sailsNgTable', 'Resource', 'Actions',

  function($scope, $rootScope, $state, $resource, $injector,
            TableParams, SailsNgTable, Resource, Actions) {

    /**
     * [actions - mapped callbacks that can be individually overridden]
     */
    $scope.actions = {
      // Actions that can be mapped to the form-popup directive
      ok: Actions.ok || function() {
        console.log('OK CALLBACK');
      },
      cancel: Actions.cancel || function() {
        console.log('CANCEL CALLBACK');
      },
      // Actions that can be mapped to the allow-nav directive
      // returns payload to modalInstanceController
      'create': Actions.create || function() {
        return {
          item: null,
          Resource: Resource
        };
      },
      'update': Actions.update || function(item) {
        return {
          item: item,
          Resource: $resource(item.href, {}, {
            'update' : { method: 'PUT' }
          })
        };              
      },
      'delete': Actions.delete || function(item) {
        if (confirm('Are you sure you want to delete this item?')) {
          $resource(item.href).remove()
          .$promise.then(function() {
            $rootScope.$broadcast('hateoas.client.refresh');
          });
        }
      }
    };

    $scope.follow = function(link) {
      if (link) {
        if (link.rel) {
          Service = ($injector.has(link.rel + 'Service') ?
            $injector.get(link.rel + 'Service') :
            null);
          $scope.pageTitle = link.prompt;  
          $scope.url = link.href;
          // $location.path(link.href.replace(/\/api/,''))
        }
      }
    };

    $scope.select = function(item) {
      $scope.selected = ($scope.selected === item ? null : item);
    };

    $scope.query = { 'where' : {} };
    $scope.$watchCollection('query.where', function(newQuery, oldQuery) {
      if (newQuery && !_.isEqual(newQuery, oldQuery)) {
        // Page changes will trigger a reload. To reduce the calls to
        // the server, force a reload only when the user is already on
        // page 1.
        if ($scope.tableParams.page() !== 1) {
          $scope.tableParams.page(1);
        } else {
          $scope.tableParams.reload();
        }
      }
    });

    $scope.$on('hateoas.client.refresh', function(e) {
      $scope.tableParams.reload();
    });

    var TABLE_SETTINGS = {
      page: 1,
      count: 10,
      filter: $scope.filters
    };

    $scope.tableParams = new TableParams(TABLE_SETTINGS, { 
      counts: [],
      getData: function($defer, params) {
        var api = SailsNgTable.parse(params, $scope.query);

        Resource.get(api, function(data, headers) {
          $scope.selected = null;
          $scope.allow = headers('allow');
          $scope.template = data.template;
          $scope.resource = angular.copy(data);
          params.total(data.total);
          $defer.resolve(data.items);
        });
      }
    });
  }]);