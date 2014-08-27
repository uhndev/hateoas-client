/**
 * Modal Controller responsible for formPopup actions
 */
angular.module('dados.common.directives.modelInstance.controller', [])

.controller('ModalInstanceCtrl', 
  ['$rootScope', '$scope', '$resource', '$modalInstance',
   'template', 'onSubmit', 'onCancel',

  function ($rootScope, $scope, $resource, $modalInstance, template, onSubmit, onCancel) {
    $scope.form = {};
    // retrieve (Create, Update) callback payloads - see person.js and form.js
    var payload, item, toAnswerSet;
    
    payload = onSubmit();
    item = payload.item;

    // retrieve form via href from hateoas template
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
        console.log(data);
        // if filling out a user form with destination AnswerSet,
        // there exists no template, so we use the field name from
        // the form; otherwise, we read from the template as the key
        var field_keys = (!template.data) ? 
                            _.pluck(data.form_questions, 'field_name') :
                            _.pluck(template.data, 'name');
        // answers from the filled out form
        var field_values = _.pluck(data.form_questions, 'field_value');
        // zip pairwise key/value pairs
        var answers = _.zipObject(field_keys, field_values);

        // if filling out user form, need to record form, subject, and user
        // otherwise, just the answers are passed to the appropriate model
        var ansSet = (!template.data) ? {
          form: '1',
          subject: '2',
          user: '3',
          answers: answers
        } : answers;
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