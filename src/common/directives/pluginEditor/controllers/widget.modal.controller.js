(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.widgetModalController', [
    ])
    .controller('WidgetModalController', WidgetModalController);

  WidgetModalController.$inject = ['$scope', '$modalInstance', 'widget', 'fieldNames'];

  function WidgetModalController($scope, $modalInstance, widget, fieldNames) {
    $scope.fieldNames = angular.copy(fieldNames);
    $scope.widget = angular.copy(widget);
    
    $scope.$on('widgetControllerLoaded', function(e) {
      $scope.$broadcast('setWidget', $scope.widget);
    });
    
    $scope.$on('returnWidget', function(e, widget) {
      angular.copy(widget, $scope.widget);
      $scope.widget.uuid = guid(8);
      $modalInstance.close($scope.widget);
    });
    
    $scope.ok = function () {
      $scope.$broadcast('getWidget');
    };
    
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }

})();