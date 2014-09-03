angular.module('hateoas.controls.controller', 
  ['hateoas.modal.controller',
   'hateoas.controls.service',
   'hateoas.utils',
   'ngform-builder'])
  .controller('HateoasControlsController', 
    ['$scope', '$modal', 'HateoasUtils',
    /**
     * Controller for the directive
     */
    function HateoasControlsController($scope, $modal, HateoasUtils) {
      // By default, the HateoasService is used. However, the service can be
      // overridden by declaring the service in the directive.
      var Service = HateoasUtils.getService('ControlsService');

      /**
       * Private: archive
       * Archives an item on the API.
       * @param   item - item to archive
       * @returns $promise
       */
      function archive(item) {
        Service.archive(item);
      }

      /**
       * Private: edit
       * Launches a form to edit or create an item. Uses form-builder to draw the
       * form.
       * @param   item - item to create/update
       * @returns null
       */
      function open(method) {
        var modalScope = $scope.$new(true);
        modalScope.item = (method === 'post' ? 
            {} : angular.copy($scope.item));
        modalScope.template = $scope.template;

        var instance = $modal.open({
          templateUrl: 'hateoasClient/Modal/hateoasModal.tpl.html',
          controller: 'HateoasModalController',
          size: 'lg',
          scope: modalScope
        });

        instance.result.then(function(item) {
          var newItem = _.merge(modalScope.item, item);
          var api = newItem.href || $scope.href;
          //TODO: Handle errors!
          Service.commit(api, newItem).then(function() {
            $scope.$emit('hateoas.client.refresh');
            modalScope.$destroy();
          });
        });
      }

      /**
       * Private: defaultLauncher
       * The default button handler
       */
      $scope.launch = function defaultLauncher(button) {
        if (button.method === 'delete') {
          archive($scope.item);
        } else {
          open(button.method);
        }
      };

    }]);
