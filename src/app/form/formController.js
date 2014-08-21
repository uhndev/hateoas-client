angular.module( 'dados.form.controller', [
  'ui.router',
  'ngTable',
  'dados.form.service',
  'dados.common.services.sails',
  'dados.common.directives.form-popup'
])

.controller('FormCtrl', 
  ['$scope', '$timeout', '$resource', '$state', 
   'FORM_API', 'ngTableParams', 'sailsNgTable',

  function($scope, $timeout, $resource, $state, FORM_API, TableParams, SailsNgTable) {
    var Resource = $resource(FORM_API);

    /**
     * Actions to be mapped to the form-popup directive
     */
    $scope.popup = {
      ok: function() {
        console.log('OK CALLBACK');
      },
      cancel: function() {
        console.log('CANCEL CALLBACK');
      }
    };

    /**
     * Actions to be mapped to the allow-nav directive
     */
    $scope.actions = {
      createForm: function() {
        $state.go('formbuilder');
      },
      updateForm: function() {
        $state.go('formbuilder.edit', { formURL: $scope.selected.href });
      },
      deleteForm: function() {
        if (confirm('Are you sure you want to delete: ' + 
                     $scope.selected.form_title + '?')) {
          $resource($scope.selected.href).remove()
          .$promise.then(function() {
            $scope.tableParams.reload();
          });
        }
      }
    };

    $scope.select = function(item) {
      $scope.selected = ($scope.selected === item ? null : item);
    };

    $scope.query = { 'where' : {} };
    $scope.$watchCollection('query.where', function(newQuery, oldQuery) {
      if (newQuery && !_.isEqual(newQuery, oldQuery)) {
        // Page changes will trigger a reload. To reduce the calls to
        // the server, force a reload only when the user is already on
        // page 1.
        if ($scope.tableParams.page() !== 1) {
          $scope.tableParams.page(1);
        } else {
          $scope.tableParams.reload();
        }
      }
    });

    var TABLE_SETTINGS = {
      page: 1,
      count: 10,
      filter: $scope.filters
    };

    $scope.tableParams = new TableParams(TABLE_SETTINGS, { 
      getData: function($defer, params) {
        var api = SailsNgTable.parse(params, $scope.query);

        Resource.get(api, function(data, headers) {
          $scope.selected = null;
          $scope.allow = headers('allow');
          $scope.template = data.template;
          $scope.resource = angular.copy(data);
          $timeout(function() {
            params.total(data.total);
            $defer.resolve(data.items);
          });
        });
      }
    });
  }
]);
