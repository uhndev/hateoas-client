/**
 * Modal Controller responsible for formPopup actions
 */
angular.module('dados.common.directives.modelInstance.controller', [
  'dados.common.directives.templateService'
])

.controller('ModalInstanceCtrl', 
  ['$rootScope', '$scope', '$resource', '$modalInstance',
   'template', 'onSubmit', 'onCancel', 'TemplateService',

  function ($rootScope, $scope, $resource, $modalInstance, 
             template, onSubmit, onCancel, TemplateService) {

    $scope.form = {};
    // retrieve (Create, Update) callback payloads - see person.js and form.js
    var payload, item, form;    
    payload = onSubmit();
    item = payload.item;
    form = {};

    if (template.href) {
      // retrieve form via href from hateoas template
      form = $resource(template.href);
      form.get().$promise.then(function (form) {
        TemplateService.loadAnswerSet(item, template, form);
        $scope.form = form.items;
      }, function(errResponse) {
        $scope.error = 'Unable to load form!';
      });      
    } else {
      // otherwise if no form href included, parse template object
      form.items = TemplateService.parseToForm(item, template);
      TemplateService.loadAnswerSet(item, template, form);
      $scope.form = form.items;
    }

    /**
     * [ok - invoke given callbacks for submit]
     */
    $scope.ok = function () {
      $modalInstance.result.then(function (data) {
        var ansSet = TemplateService.createAnswerSet(data, template);
        var resource = new payload.Resource(ansSet);
        
        // if given an item, we update; save otherwise
        var promise = (item) ? resource.$update() : resource.$save();
        promise.then(function (data) {
          $rootScope.$broadcast('hateoas.client.refresh');
        }).catch(function (err) {
          console.log(err);
        });

      }, function () {
        // on close
      });
      
      $modalInstance.close($scope.form);
    };

    /**
     * [cancel - invoke given callbacks for cancel]
     */
    $scope.cancel = function () {
      onCancel();
      $modalInstance.dismiss('cancel');
    };
  }
]);