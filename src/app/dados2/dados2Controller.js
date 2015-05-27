angular.module( 'dados.plugincreator.controller', [
])

.controller('PluginController',
  ['$scope', '$location', '$timeout', '$resource', 
  function ($scope, $location, $timeout, $resource) {
    var api = 'http://localhost:1337/api/userform/:id';
    var Resource = $resource(api, {}, {'update': { method: 'PUT' }});
    $scope.alerts = [];
    $scope.form = {};
  }
]);
