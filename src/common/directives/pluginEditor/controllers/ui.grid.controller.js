(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.uiGridController', [
    ])
    .controller('UiGridController', UiGridController);

  UiGridController.$inject = ['$scope'];

  function UiGridController($scope) {
    $scope.configure = function() {
      $scope.$emit('configure', $scope.cellIndex);
    };
    
    $scope.clone = function() {
      $scope.$emit('clone', $scope.cellIndex);
    };
    
    $scope.remove = function() {
      $scope.$emit('remove', $scope.cellIndex);
    };

    $scope.shrinkable = function() {
      return (parseInt($scope.cell.css.width) > 20);
    };
    
    $scope.shrink = function() {
      $scope.$emit('shrink', $scope.cell);
    };
    
    $scope.expandable = function() {
      return (parseInt($scope.cell.css.width) < 100);
    };
    
    $scope.expand = function() {
      $scope.$emit('expand', $scope.cell);
    };
    
    $scope.addLeft = function() {
      $scope.$emit('add', $scope.cellIndex);
    };
    
    $scope.addRight = function() {
      $scope.$emit('add', $scope.cellIndex + 1);
    };
  }

})();