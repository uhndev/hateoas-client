angular.module( 'dados.formbuilder', [
  'ui.router',
  'ui.bootstrap',
  'ui.sortable',
  'ui.validate',
  'ngResource',
  'ngform-builder'
])

.config(function config( $stateProvider ) {
  $stateProvider
  .state( 'formbuilder', {
    url: '/formbuilder/:formID',
    views: {
      'main': {
        controller: 'FormBuilderCtrl',
        templateUrl: 'formbuilder/formbuilder.tpl.html'     
      }
    },
    data:{ pageTitle: 'Form Builder' }
  });
})

.controller('FormBuilderCtrl', function ($scope, $timeout, $resource, $stateParams) {
  $scope.alerts = [];
  $scope.form = {};
  $scope.formID = $stateParams.formID || '';

  var addAlert = function(msg) {
      $scope.alerts.push(msg);
  };

  if ($scope.formID !== '') {
    // make rest call here to load form from ID
    console.log('Loading form: ' + $scope.formID);
    addAlert({msg: 'Loaded form '+$scope.formID+' successfully!', type: 'danger'});
  }

  $scope.saveForm = function() {
    var form = $resource('http://localhost:1337/form');
    form.save($scope.form, function(resp) {
      addAlert({msg: 'Saved form successfully!', type: 'success'});
    }, function (err) {
      addAlert({msg: err, type: 'danger'});
    });
  };

  $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
  };
});
