angular.module( 'dados.form.controller', [
  'ui.bootstrap',
  'dados.form.service',
  'nglist-editor',
  'ngform-builder'
])

.controller('FormCtrl', function ($scope, $stateParams, Form) {
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
    addAlert({msg: err, type: 'danger'});
  };  
  
  if ($scope.formID !== '') {
    // make rest call here to load form from ID
    Form.get({id: $scope.formID}).$promise.then(function (form) {
      $scope.form = form;
      addAlert({msg: 'Loaded form '+$scope.form.form_name+' successfully!', type: 'success'});
    }, function (err) {
      addAlert({msg: 'Unable to load form! ' + err, type: 'danger'});
    });
  }

  $scope.saveForm = function() {
    var form = new Form($scope.form);
    if (_.has(form, 'id')) {
      form.$update().then(success).catch(error);
    } else {
      form.$save().then(success).catch(error);
    }
  };

  $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
  };  

  $scope.list = [];
  $scope.columns = [];
  Form.query().$promise.then(function (forms) {
    $scope.list = forms;
  }, function (err) {
    addAlert({msg: 'Unable to load forms ' + err, type: 'danger'});
  });
});