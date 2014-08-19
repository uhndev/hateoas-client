angular.module( 'dados.form.controller', [
  'ui.bootstrap',
  'dados.form.service',
  'ngTable',
  'nglist-editor',
  'ngform-builder',
  'dados.common.directives.form-popup'
])

.controller('FormCtrl', function ($scope, $stateParams, Form) {
  $scope.alerts = [];
  $scope.form = {};
  $scope.formURL = 'http://localhost:1337/api/form/53f3a864e51118201fcc065f';

  $scope.list = [];
  $scope.columns = [];

  Form.query().$promise.then(function (forms) {
    $scope.list = forms.items;
  }, function (err) {
    addAlert({msg: 'Unable to load forms ' + err, type: 'danger'});
  });

  var addAlert = function(msg) {
    $scope.alerts.push(msg);
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
});