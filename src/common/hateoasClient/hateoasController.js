angular.module('hateoas.controller', 
    ['ngTable', 'dados.common.services.sails',
     'dados.common.directives.formPopup'])
  .constant('API', { 
    protocol: 'http',
    host : 'localhost',
    port: '1337',
    prefix: '/api',
    url: function getUrl() {
      return this.protocol + "://" + 
        this.host + ":" + this.port + this.prefix;
    }
  })
  .controller('HateoasController', 
    ['$scope', '$rootScope', '$resource', '$injector', '$state', '$location',
      'API', 'ngTableParams', 'sailsNgTable', 'Actions', 
      
  function($scope, $rootScope, $resource, $injector, $state, $location,
    api, TableParams, SailsNgTable, Actions) {
    console.log("Starting controller!");
    console.log($location.path());
    $scope.url = api.url() + $location.path();
    $scope.query = { 'where' : {} };
    var Resource = $resource($scope.url);
    var Service = null;

    function reloadTable() {
      // Page changes will trigger a reload. To reduce the calls to
      // the server, force a reload only when the user is already on
      // page 1.
      if ($scope.tableParams.page() !== 1) {
        $scope.tableParams.page(1);
      } else {
        $scope.tableParams.reload();
      }
    }

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
          $location.path(link.href.replace(/^.*\/api/i, ''));
        }
      }
    };

    $scope.select = function(item) {
      $scope.selected = ($scope.selected === item ? null : item);
    };

    $scope.$watch('url', function(href) {
      Resource = $resource(href);
      reloadTable();
    });

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
