angular.module( 'dados.formbuilder.controller', [
  'ngResource',
  'ngform-builder'
])

.controller('FormBuilderController',
  ['$scope', '$location', '$timeout', '$resource', 
  function ($scope, $location, $timeout, $resource) {
    var api = 'http://localhost:1337/api/form/:id';
    var Resource = $resource(api, {}, {'update': { method: 'PUT' }});
    $scope.alerts = [];
    $scope.form = {};

    var addAlert = function(msg) {
      $scope.alerts.push(msg);
      $timeout(function() {
        $scope.closeAlert(0);
      }, 5000);
    };

    var pushError = function(err) {
      addAlert({msg: err.data, type: 'danger'});
    };

    var query = $location.search();
    // if formURL to load contains a form ID, load it
    if (_.has(query, 'id')) {
      Resource.get(_.pick(query, 'id')).$promise.then(function (form) {
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
      var resource = new Resource($scope.form);
      // if current form object has an href attribute, we update
      if (_.has($scope.form, 'href')) {
        resource.$update( {id:$scope.form.id} ).then(function (data) {
          addAlert({msg: 'Updated form '+$scope.form.form_name+' successfully!', type: 'success'});
        }).catch(pushError);        
      } 
      // otherwise, we create a new form
      else {
        resource.$save().then(function (data) {
          addAlert({msg: 'Saved form '+$scope.form.form_name+' successfully!', type: 'success'});
        }).catch(pushError);
      }    
    };
  }
]);
