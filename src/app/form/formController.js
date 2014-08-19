angular.module( 'dados.form.controller', [
  'ui.bootstrap',
  'dados.form.service',
  'nglist-editor',
  'ngform-builder',
  'dados.common.directives.form-viewer'
])

.controller('FormCtrl', function ($scope, $stateParams, Form) {
  $scope.alerts = [];
  $scope.form = {};
  $scope.formID = '53f22587cb08d4b8093ddcf0';

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