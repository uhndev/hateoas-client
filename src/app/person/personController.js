angular.module('dados.person.controller', 
    ['ngTable', 'dados.common.services.sails'])
  .controller('PersonController', 
    ['$scope', '$timeout', '$resource', 'ngTableParams',
     'sailsNgTable',

  function($scope, $timeout, $resource, TableParams, SailsNgTable) {
    var Resource = $resource('http://localhost:1337/api/person');

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

    var TABLE_SETTINGS = {
      page: 1,
      count: 10,
      filter: $scope.filters
    };

    $scope.tableParams = new TableParams(TABLE_SETTINGS, { 
      getData: function($defer, params) {
        var api = SailsNgTable.parse(params, $scope.query);

        Resource.get(api, function(data, headers) {
          $scope.selected = null;
          $scope.allow = headers('allow');
          $scope.template = data.template;
          $scope.resource = angular.copy(data);
          $timeout(function() {
            params.total(data.total);
            $defer.resolve(data.items);
          });
        });
      }
    });
  }]);
