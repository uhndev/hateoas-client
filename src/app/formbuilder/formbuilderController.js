angular.module( 'dados.formbuilder.controller', [
  'ngResource',
  'dados.form.service',
  'ngform-builder'
])

.controller('FormBuilderController',
  ['$scope', '$state', '$timeout', '$resource', 'FORM_API', 'Form',  
  function ($scope, $state, $timeout, $resource, FORM_API, Form) {
    $scope.alerts = [];
    $scope.form = {};

    // read formURL from query param
    $scope.formURL = $state.params.formURL || FORM_API;

    var Resource = $resource($scope.formURL, {}, {
      'update' : { method: 'PUT' }
    });

    var addAlert = function(msg) {
      $scope.alerts.push(msg);
      $timeout(function() {
        $scope.closeAlert(0);
      }, 5000);
    };

    var pushError = function(err) {
      addAlert({msg: err.data, type: 'danger'});
    };

    // if formURL to load contains a form ID, load it
    if ($scope.formURL !== FORM_API) {
      Resource.get($scope.formURL).$promise.then(function (form) {
        angular.copy(form.items, $scope.form);
        addAlert({msg: 'Loaded form '+$scope.form.form_name+' successfully!', type: 'success'});
      }, function (err) {
        addAlert({msg: 'Unable to load form! ' + err.data, type: 'danger'});
      });
    }

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.saveForm = function() {
      // if current form object has an href attribute, we update
      if (_.has($scope.form, 'href')) {
        var resource = new Resource($scope.form);
        resource.$update().then(function (data) {
          addAlert({msg: 'Updated form '+$scope.form.form_name+' successfully!', type: 'success'});
        }).catch(pushError);        
      } 
      // otherwise, we create a new form
      else {
        Form.set($scope.form)
        .then(function (data) {
          addAlert({msg: 'Saved form '+$scope.form.form_name+' successfully!', type: 'success'});
        }).catch(pushError);
      }    
    };
  }
]);