angular.module( 'dados.formbuilder', [
  'ui.router',
  'ui.bootstrap',
  'ui.sortable',
  'ui.validate',
  'dados.common.services.rest',
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

.controller('FormBuilderCtrl', function ($scope, $timeout, $stateParams, RestService) {
  $scope.alerts = [];
  $scope.form = {};
  $scope.formID = $stateParams.formID || '';

  var addAlert = function(msg) {
      $scope.alerts.push(msg);
      $timeout(function() {
          $scope.alerts.splice(0);
      }, 5000);
  };

  if ($scope.formID !== '') {
    // make rest call here to load form from ID
    console.log('Loading form: ' + $scope.formID);
    addAlert({msg: 'Loaded form '+$scope.formID+' successfully!', type: 'danger'});
  }

  $scope.saveForm = function() {
    addAlert({msg: 'Saved form successfully!', type: 'success'}); 
      // RestService.create('form', $scope.testForm, function(err) {
      //     console.log(err);
      //     addAlert({msg: err, type: 'danger'});
      // }).then(function () {
      //     addAlert({msg: 'Saved form successfully!', type: 'success'});
      // });
  };

  $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
  };
});
