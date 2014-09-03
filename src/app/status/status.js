angular.module('status', [])
  .controller('StatusController', function($scope) {
    $scope.messages = [ ];

    $scope.close = function(index) {
      $scope.messages.splice(index, 1);
    };

    $scope.$on('status.update', function(e, message) {
      $scope.messages.push(message);
    });

    $scope.$broadcast('status.update', { type: 'warning', note: 'Hello, world!' });

  });
