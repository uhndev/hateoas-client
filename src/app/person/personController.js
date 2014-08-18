angular.module('dados.person.controller', ['dados.person.service'])
  .controller('PersonController', ['$scope', 'Person',
  function($scope, Person) {
    $scope.people = Person.query();


  }]);
