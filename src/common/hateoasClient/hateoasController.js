angular.module('hateoas.controller', 
    ['ngTable', 
     'hateoas',
     'dados.common.services.sails',
     'dados.common.directives.formPopup'])
  .controller('HateoasController', 
    ['$scope', '$rootScope', '$resource', '$injector', '$location',
      'API', 'ngTableParams', 'sailsNgTable',  
      
  function($scope, $rootScope, $resource, $injector, $location,
    API, TableParams, SailsNgTable) {
    $scope.url = API.url() + $location.path();
    $scope.query = { 'where' : {} };
    var Resource = $resource($scope.url);

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
      ok: function() {
        console.log('OK CALLBACK');
      },
      cancel: function() {
        console.log('CANCEL CALLBACK');
      },
      // Actions that can be mapped to the allow-nav directive
      // returns payload to modalInstanceController
      'create': function() {
        return {
          item: null,
          Resource: Resource
        };
      },
      'update': function(item) {
        return {
          item: item,
          Resource: $resource(item.href, {}, {
            'update' : { method: 'PUT' }
          })
        };              
      },
      'delete': function(item) {
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
          var index = link.href.indexOf(API.prefix) + API.prefix.length;
          $location.path(link.href.substring(index));
        }
      }
    };

    $scope.select = function(item) {
      $scope.selected = ($scope.selected === item ? null : item);
    };

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
