(function() {
  'use strict';
  angular
    .module('dados.study.form', [
      'dados.common.directives.hateoas.controls',
      'dados.common.directives.pluginEditor.formService'
    ])
    .controller('StudyFormController', StudyFormController);

  StudyFormController.$inject = [
    '$scope', '$resource', '$location', '$modal', 'AuthService', 'ngTableParams', 'sailsNgTable',
    'toastr', 'API', 'FormService'
  ];

  function StudyFormController($scope, $resource, $location, $modal, AuthService, TableParams,
                               SailsNgTable, toastr, API, Form) {

    var vm = this;

    // bindable variables
    vm.allow = {};
    vm.query = { 'where' : {} };
    vm.selected = null;
    vm.template = {};
    vm.resource = {};
    vm.url = API.url() + $location.path();

    // bindable methods;
    vm.select = select;
    vm.openForm = openForm;
    vm.archiveForm = archiveForm;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var currStudy = _.getStudyFromUrl($location.path());

      var Resource = $resource(vm.url);
      var TABLE_SETTINGS = {
        page: 1,
        count: 10,
        filter: vm.filters
      };

      $scope.tableParams = new TableParams(TABLE_SETTINGS, {
        getData: function($defer, params) {
          var api = SailsNgTable.parse(params, vm.query);

          Resource.get(api, function(data, headers) {
            vm.selected = null;
            var permissions = headers('allow').split(',');
            _.each(permissions, function (permission) {
              vm.allow[permission] = true;
            });

            vm.template = data.template;
            vm.resource = angular.copy(data);

            params.total(data.total);
            $defer.resolve(data.items);

            // initialize submenu
            AuthService.setSubmenu(currStudy, data, $scope.dados.submenu);
          });
        }
      });
    }

    function select(item) {
      vm.selected = (vm.selected === item ? null : item);
    }

    function openForm() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'study/form/formPreviewModal.tpl.html',
        controller: 'FormPreviewController',
        controllerAs: 'formPreview',
        bindToController: true,
        resolve: {
          study: function() {
            return currStudy;
          }
        }
      });

      modalInstance.result.then(function () {
        $scope.tableParams.reload();
      });
    }

    function archiveForm() {
      var conf = confirm("Are you sure you want to archive this form?");
      if (conf) {
        var form = new Form({ id: vm.selected.id });
        return form.$delete({ id: vm.selected.id }).then(function () {
          toastr.success('Archived form from '+ currStudy + '!', 'Form');
          $scope.tableParams.reload();
        });
      }
    }

    // watchers
    $scope.$watchCollection('studyForm.query.where', function(newQuery, oldQuery) {
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

    $scope.$on('hateoas.client.refresh', function() {
      init();
    });
  }
})();
