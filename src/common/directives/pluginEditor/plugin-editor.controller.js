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

  PluginController.$inject = [
    '$scope', '$location', '$timeout', 'FormService', 'StudyFormService', 'FormVersionService', 'AuthService', 'toastr'
  ];

  function PluginController($scope, $location, $timeout, FormService,
                            StudyFormService, FormVersionService, AuthService, toastr) {

    // private variables
    var EMPTY_FORM = {name: '', questions: [], metaData: {}};
    // bindable variables
    $scope.isAdmin = AuthService.isAdmin();
    $scope.firstLoad = true;
    $scope.isSaving = false;
    $scope.formID = $location.search().formID;
    $scope.isEditorOpen = true;
    $scope.isSettingsOpen = false;
    $scope.form = EMPTY_FORM;
    $scope.sortableOptions = {
      helper: 'clone', // fixes the issue when click event intercepts the drop movement
      cursor: 'move',
      revert: true
    };

    // bindable methods
    $scope.isFormValid = isFormValid;
    $scope.save = save;
    $scope.commitChanges = commitChanges;
    $scope.archive = archive;
    $scope.importJson = importJson;
    $scope.loadForm = loadForm;

    init();

    /////////////////////////////////////////////////////////////////////////////////////

    function init() {
      $scope.forms = fetchAvailableForms();

      // if form id set in url, load form by id
      if ($scope.formID && !_.has($scope.form, 'id')) {
        FormService.get({id: $scope.formID}).$promise.then(function (form) {
          // we only want non-hateoas attributes to load into our pluginEditor
          setForm(pickFormAttributes(form));
        });
      }
    }

    /*************************************************************************
     * Event Listeners
     *************************************************************************/

    $scope.$on('metaDataControllerLoaded', function (e) {
      $scope.$broadcast('setMetaData', $scope.form.metaData);
    });

    $scope.$on('layoutControllerLoaded', function (e) {
      $scope.$broadcast('setGrid', $scope.form.questions);
    });

    $scope.$on('saveGrid', function (e, widgets) {
      $scope.form.questions = angular.copy(widgets);
    });

    /* Debounce the $watch call with the hardcoded timeout
     * so we are not trying to save the form on each change.
     * Save() will check if form is valid.
     */
    var onFormUpdate = debounceWatch($timeout, function (newVal, oldVal) {
      if ($scope.firstLoad || !$scope.formID) {
        // Suspend the first watch triggered until the end of digest cycle
        $timeout(function () {
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

    /*************************************************************************
     * Private Methods                                                       *
     *************************************************************************/

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
     * onFormSaved
     * @description Callback function for successful saves
     * @param result
     */
    function onFormSaved(result) {
      var savedForm = null;
      $scope.isSaving = false;
      if ($scope.study && !$scope.formID) { // if saving a study form, going to return study object
        var studyResponse = _.last(_.sortBy(result.forms, 'createdAt'));
        savedForm = pickFormAttributes(studyResponse);
        toastr.success('Created form ' + savedForm.name + ' in study!', 'Form');
      } else {
        savedForm = pickFormAttributes(result);
        toastr.success('Saved form ' + savedForm.name + ' successfully!', 'Form');
      }
      $location.search('formID', savedForm.id);
      $scope.forms = fetchAvailableForms();
    }

    /**
     * onFormCommitted
     * @description Callback function for successful commits
     * @param result
     */
    function onFormCommitted(result) {
      var description = prompt('Enter a description of changes: ');
      if (!_.isEmpty(description)) {
        $scope.form.description = description;
      }
      FormVersionService.save($scope.form, function (result) {
        var savedForm = pickFormAttributes(result);
        toastr.success('Committed changes for form ' + savedForm.name + ' successfully!', 'Form');
      }, onFormError);
    }

    /**
     * onFormError
     * @description Callback function for unsuccessful saves
     * @param err
     */
    function onFormError(err) {
      $scope.isSaving = false;
      console.log(err);
    }

    /**
     * setForm
     * @description Private function to set the scoped form, used in init function
     *              and when importing a form from JSON.
     * @param form  Form object
     */
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

    function fetchAvailableForms() {
      // if viewing plugin editor on /study/1/forms, get studyID from $location
      var pathArray = _.pathnameToArray($location.path());
      if (pathArray.length > 1) {
        $scope.study = pathArray[1];
        return StudyFormService.query({studyID: $scope.study}); // fetch study forms if from study formbuilder
      } else {
        return FormService.query(); // fetch all if from global formbuilder
      }
    }

    /*************************************************************************
     * Public Methods
     *************************************************************************/

    /**
     * isFormValid
     * @description Simple validity checker for the current form.
     * @param showMessages boolean on whether to popup toasts for errors
     * @returns {boolean}
     */
    function isFormValid(showMessages) {
      if (_.has($scope.form, 'questions')) {
        var hasName = !_.isEmpty($scope.form.name);
        var hasFieldNames = _.all($scope.form.questions, 'name');
        var hasQuestions = $scope.form.questions.length > 0;
        var unique = _.uniq($scope.form.questions, 'name');
        var isUnique = unique.length === $scope.form.questions.length;

        if (showMessages) {
          if (!hasName) { toastr.warning('You must enter a name for the plugin!', 'Form Builder'); }
          if (!hasFieldNames) { toastr.warning('All questions must have unique field names!', 'Form Builder'); }
          if (!hasQuestions) { toastr.warning('No questions added yet!', 'Form Builder'); }
          if (!isUnique) { toastr.warning('Field names are not unique!', 'Form Builder'); }
        }

        return hasName && hasFieldNames && hasQuestions && isUnique;
      }
      return false;
    }

    /**
     * save
     * @description Handler for saving a form in the form builder.  The
     *              form must have a name and each question must have a field name.
     * @param isManual
     */
    function save(isManual) {
      if (isFormValid(true)) {
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
      }
    }

    /**
     * commitChanges
     * @description Click handler for committing a form in the form builder.  The
     *              form must have a name and each question must have a field
     *              name.  Saving an existing form should 'commit' the form to
     *              the FormVersion model depending on whether it has been
     *              published already.
     */
    function commitChanges() {
      if (isFormValid(true)) {
        $scope.isSaving = true;
        if ($scope.form.id) {
          FormService.update($scope.form, onFormCommitted, onFormError);
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
      }
    }

    /**
     * archive
     * @description Archives a form from the system (sets expiredAt to now)
     * @returns {*}
     */
    function archive() {
      if ($scope.formID && _.has($scope.form, 'id')) {
        var conf = confirm('Are you sure you want to archive this form?');
        if (conf) {
          var form = new FormService({id: $scope.formID});
          return form.$delete().then(function () {
            toastr.success('Form successfully archived!', 'Success');
            $location.search('formID', null);
            $scope.forms = fetchAvailableForms();
          });
        }
      }
    }

    /**
     * importJson
     * @description Surprisingly enough, this function imports a form from JSON
     * @param jsonForm
     */
    function importJson(jsonForm) {
      var form = JSON.parse(jsonForm);

      // Strip IDs. It is vital that all id's are stripped to prevent overwriting of data
      form = omit(form, 'id', form, true);

      setForm(form);
    }

    /**
     * loadForm
     * @description As part of the initialization behaviour of the form builder,
                    and the form selection dropdown, load a form by id.
     * @param id
     */
    function loadForm(id) {
      if (id === 'new') {
        $scope.form = EMPTY_FORM;
        delete $scope.formID;
        $location.search('formID', null);
      } else {
        if (!_.isNull(id)) {
          $scope.formID = id;
          $location.search('formID', id);
        }
      }
    }

  }
})();
