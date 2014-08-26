angular.module('hateoas.controller', 
    ['ngTable', 'dados.common.services.sails', 
     'dados.common.directives.formPopup'])
  .constant('API_URL', 'http://localhost:1337/api/study')
  .controller('HateoasController', 
    ['$scope', '$resource', '$injector', '$location', 
      'API_URL', 'ngTableParams', 'sailsNgTable', 
  function($scope, $resource, $injector, $location, 
    api, TableParams, SailsNgTable) {
    $scope.url = api;
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

    $scope.follow = function(link) {
      if (link) {
        if (link.rel) {
          Service = ($injector.has(link.rel + 'Service') ?
            $injector.get(link.rel + 'Service') :
            null);
          $scope.pageTitle = link.prompt;  
          $scope.url = link.href;
        }
      }
    };

    $scope.actions = {
      'create' : function(item) {
        if (Service !== null) {
          Service.create(Resource, item);
        } else {
          Resource.save(item);
        }
      },
  
      'update' : function(item) {
        if (Service !== null) {
          Service.update(Resource, item);
        } else {
          Resource.update(item);
        }
      },
  
      'delete' : function(item) {
        if (Service !== null) {
          Service.remove(Resource, item);
        } else {
          Resource.remove(item);
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
        reloadTable();
      }
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
        if (Resource) {
          Resource.get(api, function(data, headers) {
            $scope.selected = null;
            $scope.allow = headers('allow');
            $scope.template = data.template;
            $scope.resource = angular.copy(data);
            params.total(data.total);
            $defer.resolve(data.items);
          });
        }
      }
    });
  }]);
