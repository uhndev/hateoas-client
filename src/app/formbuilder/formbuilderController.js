angular.module( 'dados.formbuilder.controller', [
  'ngResource',
  'dados.form.service',
  'ngform-builder'
])

.controller('FormBuilderController',
  ['$scope', '$stateParams', '$timeout', '$resource', 'FORM_API', 'Form',
  function ($scope, $stateParams, $timeout, $resource, FORM_API, Form) {
    $scope.alerts = [];
    $scope.form = {};

    // read formID from URL
    $scope.formID = $stateParams.formID || '';

    var addAlert = function(msg) {
        $scope.alerts.push(msg);
    };

    if ($scope.formID !== '') {
      // make rest call here to load form from ID
      Form.get({id: $scope.formID}).$promise.then(function (form) {
        angular.copy(form.items, $scope.form);
        addAlert({msg: 'Loaded form '+$scope.form.form_name+' successfully!', type: 'success'});
      }, function (err) {
        addAlert({msg: 'Unable to load form! ' + err.data, type: 'danger'});
      });
    }

    $scope.saveForm = function() {
      // if current form object has an href attribute, we update
      if (_.has($scope.form, 'href')) {
        var Resource = $resource(FORM_API + '/' + $scope.formID, {}, {
          'update' : { method: 'PUT' }
        });
        var resource = new Resource($scope.form);
        resource.$update().then(function (data) {
          addAlert({msg: 'Updated form '+$scope.form.form_name+' successfully!', type: 'success'});
          $timeout(function() {
            $scope.closeAlert(0);
          }, 5000);
        })
        .catch(function (err) {
          addAlert({msg: err.data, type: 'danger'});
        });        
      } 
      // otherwise, we create a new form
      else {
        Form.set($scope.form)
        .then(function(data) {
          addAlert({msg: 'Saved form '+$scope.form.form_name+' successfully!', type: 'success'});
          $timeout(function() {
            $scope.closeAlert(0);
          }, 5000);
        })
        .catch(function(err) {
          addAlert({msg: err.data, type: 'danger'});
        });
      }    
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }
]);