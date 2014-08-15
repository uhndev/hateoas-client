angular.module( 'dados.formbuilder.controller', [
  'ui.bootstrap',
  'ui.sortable',
  'ui.validate',
  'ngResource',
  'dados.form.service',
  'ngform-builder'
])

.controller('FormBuilderController', 
function ($scope, $stateParams, Form) {
  $scope.alerts = [];
  $scope.form = {};
  $scope.formID = $stateParams.formID || '';

  var addAlert = function(msg) {
      $scope.alerts.push(msg);
  };

  var success = function(data) {
    addAlert({msg: 'Saved form successfully!', type: 'success'});
  };

  var error = function(err) {
    addAlert({msg: err.data.raw.err, type: 'danger'});
  };

  if ($scope.formID !== '') {
    // make rest call here to load form from ID
    Form.get({id: $scope.formID}).$promise.then(function(form) {
       $scope.form = form;
       addAlert({msg: 'Loaded form '+$scope.form.form_name+' successfully!', type: 'success'});
    }, function(errResponse) {
       addAlert({msg: 'Unable to load form! ' + err, type: 'danger'});
    });
  }

  $scope.saveForm = function() {
    Form.set($scope.form, success, error);
  };

  $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
  };
});