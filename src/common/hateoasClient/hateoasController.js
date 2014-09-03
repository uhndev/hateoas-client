angular.module('hateoas.controller', 
    ['ngTable', 
     'hateoas',
     'hateoas.utils',
     'dados.common.services.sails'])
  .controller('HateoasController', 
    ['$scope', '$resource', '$location',
      'API', 'ngTableParams', 'sailsNgTable', 'HateoasUtils',
      
  function($scope, $resource, $location,
    API, TableParams, SailsNgTable, Utils) {
    $scope.url = API.url() + $location.path();
    $scope.query = { 'where' : {} };
    var Resource = $resource($scope.url);

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
