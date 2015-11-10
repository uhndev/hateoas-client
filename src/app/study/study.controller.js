(function() {
  'use strict';
  angular
    .module('dados.study.controller', [
      'dados.common.directives.selectLoader',
      'dados.common.directives.simpleTable',
      'dados.common.directives.formBuilder.directives.form'
    ])
    .constant('FORM_NAME', 'survey_tracking')
    .controller('StudyOverviewController', StudyOverviewController);

  StudyOverviewController.$inject = [
    '$scope', '$resource', '$location', 'API', 'FORM_NAME', 'AuthService'
  ];

  function StudyOverviewController($scope, $resource, $location, API, FORM_NAME, AuthService) {
    var vm = this;

    // bindable variables
    vm.allow = '';
    vm.template = {};
    vm.resource = {};
    vm.studyInfo = {};
    vm.collectionCentres = {};
    vm.savedData = {};
    vm.url = API.url() + $location.path();

    // bindable methods
    vm.generateReport = generateReport;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);
      var SurveyForm = $resource(API.url() + '/systemform?form_name=' + FORM_NAME);

      Resource.get(function(data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.resource = angular.copy(data);
        var robj = _.pick(data.items, 'name', 'reb', 'administrator', 'pi');

        vm.studyInfo = {
          rows: {
            'name': { title: 'COMMON.MODELS.STUDY.NAME', type: 'text' },
            'reb': { title: 'COMMON.MODELS.STUDY.REB', type: 'text' },
            'administrator': { title: 'COMMON.MODELS.STUDY.ADMINISTRATOR', type: 'user' },
            'pi': { title: 'COMMON.MODELS.STUDY.PI', type: 'user' }
          },
          tableData: _.objToPair(robj)
        };
        var subTotal = _.reduce(_.pluck(data.items.centreSummary, 'subjects_count'), function(result, count) {
          return result + _.parseInt(count);
        }, 0);
        var coordTotal = _.reduce(_.pluck(data.items.centreSummary, 'coordinators_count'), function(result, count) {
          return result + _.parseInt(count);
        }, 0);

        vm.collectionCentres = {
          subjects_total: subTotal,
          coordinators_total: coordTotal,
          tableData: data.items.centreSummary || [],
          columns: [
            { title: 'APP.STUDY.OVERVIEW.ENROLLMENT.COLLECTION_CENTRES', field: 'name', type: 'text' },
            { title: 'APP.STUDY.OVERVIEW.ENROLLMENT.CONTACT', field: 'contact', type: 'text' },
            { title: 'APP.STUDY.OVERVIEW.ENROLLMENT.COORDINATORS', field: 'coordinators_count', type: 'number'},
            { title: 'APP.STUDY.OVERVIEW.ENROLLMENT.SUBJECTS_ENROLLED', field: 'subjects_count', type: 'number'}
          ]
        };

        // initialize submenu
        if (_.has(data.items, 'links')) {
          var submenu = {
            href: data.items.slug,
            name: data.items.name,
            links: AuthService.getRoleLinks(data.items.links)
          };
          angular.copy(submenu, $scope.dados.submenu);
        }
      });

      SurveyForm.get(function (data) {
        vm.clinicalForm = angular.copy(_.first(data.items));
      });
    }

    function generateReport() {
      alert('Generating report');
    }

    $scope.$on('hateoas.client.refresh', function() {
      init();
    });
  }
})();
