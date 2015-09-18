(function () {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.pluginController', [
      'dados.common.directives.pluginEditor.formService'
    ])
    .controller('PluginController', PluginController);

  PluginController.$inject = ['$scope', '$location', 'FormService', 'StudyFormService', 'toastr'];

  function PluginController($scope, $location, FormService, StudyFormService, toastr) {
    // bindable variables
    $scope.isSaving = false;
    $scope.isSettingsOpen = true;
    $scope.isEditorOpen = true;
    $scope.forms = FormService.query();
    $scope.idPlugin = $location.search()['idPlugin'];
    $scope.study = $location.search()['study'];
    $scope.form = { name: '', questions: [], metaData: {} };
    $scope.sortableOptions = {
      cursor: 'move',
      revert: true
    };

    // bindable methods
    $scope.save = save;
    $scope.importLegacy = importLegacy;
    $scope.importJson = importJson;
    $scope.loadForm = loadForm;

    init();

    /////////////////////////////////////////////////////////////////////////////////////

    function init() {
      // form id set in url, load form by id
      if ($scope.idPlugin && !_.has($scope.form, 'id')) {
        FormService.get({id: $scope.idPlugin}).$promise.then(function (form) {
          // we only want non-hateoas attributes to load into our pluginEditor
          setForm(_.pick(form, 'id', 'name', 'questions', 'metaData', 'isDirty'));
        });
      }
    }

    /**
     * Event Listeners
     */

    $scope.$on('metaDataControllerLoaded', function (e) {
      $scope.$broadcast('setMetaData', $scope.form.metaData);
    });

    $scope.$on('layoutControllerLoaded', function (e) {
      $scope.$broadcast('setGrid', $scope.form.questions);
    });

    $scope.$on('saveGrid', function (e, widgets) {
      $scope.form.questions = angular.copy(widgets);
    });

    /**
     * Private Methods
     */

    function onFormSaved(result) {
      $scope.form = angular.copy(_.pick(result, 'id', 'name', 'questions', 'metaData', 'isDirty'));
      $scope.isSaving = false;
      toastr.success('Saved form ' + $scope.form.name + ' successfully!', 'Form');
      $location.search('idPlugin', $scope.form.id);
      $scope.forms = FormService.query();
    }

    function onFormError(err) {
      $scope.isSaving = false;
      console.log(err);
    }

    function setForm(form) {
      $scope.form = form;

      angular.forEach($scope.form.questions, function (question) {
        if (angular.isUndefined(question.properties.defaultValue)) {
          if (question.properties.type.match(/checkbox/i)) {
            question.properties.defaultValue = {value: []};
          } else {
            question.properties.defaultValue = {value: undefined};
          }
        }
      });

      $scope.$broadcast('setGrid', $scope.form.questions);
      $scope.$broadcast('setMetaData', $scope.form.metaData);
      $scope.isSaving = false;
      toastr.info('Loaded form ' + $scope.form.name + ' successfully!', 'Form');
    }

    /**
     * Public Methods
     */

    function save() {
      if (_.isEmpty($scope.form.name)) {
        toastr.warning('You must enter a name for the plugin!', 'Plugin Editor');
      } else {
        if (_.all($scope.form.questions, 'name')) {
          $scope.isSaving = true;
          if ($scope.form.id) {
            FormService.update($scope.form, onFormSaved, onFormError);
          } else {
            if (!$scope.study) {
              FormService.save($scope.form, onFormSaved, onFormError);
            } else {
              var studyForm = new StudyFormService($scope.form);
              studyForm.studyID = $scope.study;
              studyForm.$save()
                .then(onFormSaved)
                .catch(onFormError);
            }
          }
        } else {
          toastr.warning('No questions added yet!', 'Plugin Editor');
        }
      }
    }

    function importLegacy() {
      var idEncounter = $scope.encounter.id;
      if (angular.isDefined(idEncounter) &&
        angular.isNumber(idEncounter)) {
        $scope.isSaving = true;
        LegacyResource.get({id: idEncounter})
          .$promise.then(setForm);
      }
    }

    function importJson(jsonForm) {
      var form = JSON.parse(jsonForm);

      // Strip IDs. It is vital that all id's are stripped to prevent
      // overwriting of data
      form = omit(form, 'id', form, true);

      setForm(form);
    }

    function loadForm(id) {
      $scope.idPlugin = id;
      if (!id) { // load new form palette
        $scope.form = {};
      }
      $location.search('idPlugin', id);
    }

  }
})();
