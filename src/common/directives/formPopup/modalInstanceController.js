/**
 * Modal Controller responsible for formPopup actions
 */
angular.module('dados.common.directives.modelInstance.controller', [])

.controller('ModalInstanceCtrl', 
  ['$rootScope', '$scope', '$resource', '$modalInstance',
   'template', 'onSubmit', 'onCancel',

  function ($rootScope, $scope, $resource, $modalInstance, template, onSubmit, onCancel) {
    $scope.form = {};
    // retrieve (Create, Update) callback payloads - see person.js
    var payload, item;
    if (!_.has(template, 'form_name')) {
      payload = onSubmit();
      item = payload.item;
    }

    // retrieve form via href from hateoas template
    /**
     * [form description]
     * @type {[type]}
     */
    var form = $resource(template.href);
    form.get().$promise.then(function (form) {
      // if item was included in callback payload, map item values to form
      if (item) {
        // retrieve values from selected row via template data name
        var values = _.map(template.data, function(temp) { return item[temp.name]; });
        // replace field values in form
        _.each(form.items.form_questions, function(question, idx) {
          question.field_value = values[idx];
        });
      }
      $scope.form = form.items;
    }, function(errResponse) {
      $scope.error = 'Unable to load form!';
    });

    /**
     * [ok - invoke given callbacks for submit]
     */
    $scope.ok = function () {
      $modalInstance.result.then(function (data) {
        var answers = _.zipObject(
                        _.pluck(template.data, 'name'),
                        _.pluck(data.form_questions, 'field_value')
                      );
        var resource = new payload.Resource(answers);
        
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