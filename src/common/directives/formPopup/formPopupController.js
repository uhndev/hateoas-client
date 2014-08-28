/**
 * Directive controller responsible for passing through data to modals
 */
angular.module('dados.common.directives.formPopup.controller', [
  'ngform-builder',
  'dados.common.directives.modelInstance.controller'
])

.controller('FormPopupController', 
  ['$rootScope', '$scope', '$resource', '$modal',
  
  function ($rootScope, $scope, $resource, $modal) {
    $scope.open = function() {
      // if not given a form URL, pass through and continue without popup
      // (only applicable for the allowNav on forms page)
      if ($scope.template.rel == "form") {
        return $scope.onSubmit();
      }

      // otherwise, we know the form to load, and we open a modal
      var modalInstance = $modal.open({
        templateUrl: 'directives/formPopup/formPopup.tpl.html',
        controller: 'ModalInstanceCtrl',
        size: 'lg',
        resolve: {
          template: function () {
            return $scope.template;
          },
          onSubmit: function() {
            return $scope.onSubmit;
          },
          onCancel: function() {
            return $scope.onCancel;
          }
        }
      });
    };
  } 
]);