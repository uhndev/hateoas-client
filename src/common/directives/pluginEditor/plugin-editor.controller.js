/**
 * Form Editor Controller
 *
 * @module      directives/pluginEditor
 * @description Main controller for pluginEditor directive that handles form import and saving logic.
 */

(function () {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.pluginController', [
      'dados.common.directives.pluginEditor.formService'
    ])
    .controller('PluginController', PluginController);

  PluginController.$inject = ['$scope', '$location', '$timeout', 'FormService', 'StudyFormService', 'FormVersionService', 'toastr'];

  function PluginController($scope, $location, $timeout, FormService, StudyFormService, FormVersionService, toastr) {
    // bindable variables
    $scope.firstLoad = true;
    $scope.isSaving = false;
    $scope.isCommitting = false;
    $scope.isSettingsOpen = true;
    $scope.isEditorOpen = true;
    $scope.forms = FormService.query();
    $scope.idPlugin = $location.search()['idPlugin'];
    $scope.study = $location.search()['study'];
    $scope.form = { name: '', questions: [], metaData: {} };
    $scope.sortableOptions = {
      helper: "clone", // fixes the issue when click event intercepts the drop movement
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
          setForm(pickFormAttributes(form));
        });
      }
    }
    
    /**
     * Function that picks only non-hateoas attributes from server response
     */
    
    function pickFormAttributes(hateoas) {
      if (hateoas.hasOwnProperty('items')) {
        return _.pick(hateoas.items, 'id', 'name', 'questions', 'metaData', 'isDirty');
      } else {
        return _.pick(hateoas, 'id', 'name', 'questions', 'metaData', 'isDirty');
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
      var savedForm = pickFormAttributes(result);
      $scope.isSaving = false;
      if ($scope.isCommitting) {
        FormVersionService.save($scope.form);
      }
      toastr.success('Saved form ' + savedForm.name + ' successfully!', 'Form');
      $location.search('idPlugin', savedForm.id);
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
      $scope.firstLoad = true;
      toastr.info('Loaded form ' + $scope.form.name + ' successfully!', 'Form');
    }

    /**
     * Public Methods
     */

    function save(isManual) {
      if (typeof(isManual)==='undefined') {
        isManual = true;
      }
    
      if (_.isEmpty($scope.form.name)) {
        if (isManual) {
          toastr.warning('You must enter a name for the plugin!', 'Plugin Editor');
        }
      } else {
        if (_.all($scope.form.questions, 'name')) {
          $scope.isSaving = true;
          $scope.isCommitting = false;
          if ($scope.form.id) {
            $scope.isCommitting = isManual;
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
        } else if (isManual) {
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
    
    /* Debounce the $watch call with the hardcoded timeout 
     * so we are not trying to save the form on each change.
     * Save() will check if form is valid.
     */
    var onFormUpdate = debounceWatch($timeout, function (newVal, oldVal) {
      if ($scope.firstLoad) {
        // Suspend the first watch triggered until the end of digest cycle
        $timeout(function() {
          $scope.firstLoad = false;
        });
      } else if (!_.equalsDeep(newVal, oldVal)) {
        save(false);
      }
    }, 5000);
    
    /* Have to watch for specific form changes
     * otherwise flag or timestamp updates may trigger save again.
     */
    $scope.$watch('form', onFormUpdate, true);
    
  }
})();
