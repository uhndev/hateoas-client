angular.module( 'dados.form.controller', [
  'ngTable',
  'dados.form.service',
  'dados.common.services.sails',
  'dados.common.directives.form-popup'
])

.controller('FormCtrl', ['$scope', '$timeout', '$resource', 'Form', 'ngTableParams', 'sailsNgTable',
  function ($scope, $timeout, $resource, Resource, TableParams, SailsNgTable) {
    $scope.filters = {};
    $scope.clearFilters = function() {
      $scope.filters = {};
      $scope.tableParams.filter($scope.filters);
    };

    $scope.ok = function () {
      alert('OKAY CALLBACK');
    };

    $scope.cancel = function () {
      alert('CANCEL CALLBACK');
    };

    $scope.query = { 'where' : {} };
    $scope.$watchCollection('query.where', function(value) {
      $scope.tableParams.reload();
    });

    $scope.showAdvance = 0;
    $scope.$watch('showAdvance', function(value) {
      $scope.query.where = {};
    });

    var TABLE_SETTINGS = {
      page: 1,
      count: 10,
      filter: $scope.filters
    };

    $scope.tableParams = new TableParams(TABLE_SETTINGS, { 
      getData: function($defer, params) {
        var api = SailsNgTable.parse(params, $scope.query);

        Resource.get(api, function(data) {
          $scope.template = data.template;
          $scope.resource = angular.copy(data);
          $timeout(function() {
            params.total(data.total);
            $defer.resolve(data.items);
          });
        });
      }
    });
  }
]);
