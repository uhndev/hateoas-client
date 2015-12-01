(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.widgetModalController', [
    ])
    .controller('WidgetModalController', WidgetModalController);

  WidgetModalController.$inject = ['$scope', '$uibModalInstance', 'widget', 'fieldNames'];

  function WidgetModalController($scope, $uibModalInstance, widget, fieldNames) {
    $scope.fieldNames = angular.copy(fieldNames);
    $scope.widget = angular.copy(widget);

    $scope.$on('widgetControllerLoaded', function(e) {
      $scope.$broadcast('setWidget', $scope.widget);
    });

    $scope.$on('returnWidget', function(e, widget) {
      angular.copy(widget, $scope.widget);
      $scope.widget.uuid = guid(8);
      $uibModalInstance.close($scope.widget);
    });

    $scope.ok = function () {
      $scope.$broadcast('getWidget');
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }

})();
