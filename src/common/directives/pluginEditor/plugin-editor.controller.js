(function () {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.pluginController', [
      'dados.common.directives.pluginEditor.formService'
    ])
    .controller('PluginController', PluginController);

  PluginController.$inject = ['$scope', '$location', 'FormService', 'toastr'];

  function PluginController($scope, $location, FormService, toastr) {
    $scope.isSaving = false;
    $scope.isSettingsOpen = true;
    $scope.isEditorOpen = true;
    $scope.forms = FormService.query();
    $scope.idPlugin = $location.search()['idPlugin'];
    $scope.studyName = $location.search()['studyName'];
    $scope.form = { name: '', questions: [], metaData: {}, studyName: $scope.studyName };
    $scope.sortableOptions = {
      cursor: 'move',
      revert: true
    };

    if ($scope.idPlugin && !_.has($scope.form, 'id')) {
      FormService.get({id: $scope.idPlugin}).$promise.then(function (form) {
        setForm(_.pick(form, 'id', 'name', 'study', 'questions', 'metaData', 'isDirty'));
      });
    }

    $scope.$on('metaDataControllerLoaded', function (e) {
      $scope.$broadcast('setMetaData', $scope.form.metaData);
    });

    $scope.$on('layoutControllerLoaded', function (e) {
      $scope.$broadcast('setGrid', $scope.form.questions);
    });

    $scope.$on('saveGrid', function (e, widgets) {
      $scope.form.questions = angular.copy(widgets);
    });

    /*
     * Dirty fix. This quick fix was put in place because the "Save" button
     * would fail after the first save. Didn't have time to debug, so forced
     * a refresh on the page.
     *
     * For a more permanent fix, please use angular routing to control the follow
     * of the application.
     *
     * @TODO investigate what this was about - Kevin
     */
    // $scope.$on('$locationChangeSuccess', function(e, newHref, oldHref) {
    //   if (newHref !== oldHref) {
    //     window.location.reload();
    //   }
    // });

    var onFormSaved = function (result) {
      $scope.form = angular.copy(_.pick(result, 'id', 'name', 'study', 'questions', 'metaData', 'isDirty'));
      $scope.isSaving = false;
      toastr.success('Saved form ' + $scope.form.name + ' successfully!', 'Form');
      // @TODO investigate what this was about - Kevin
      $location.search('idPlugin', $scope.form.id);
      $scope.forms = FormService.query();
      // window.location.reload();
    };

    var onFormError = function (err) {
      $scope.isSaving = false;
      console.log(err);
    };

    var setForm = function (form) {
      $scope.form = form;
      if (!_.has(form, 'studyName')) {
        $scope.form.studyName = $scope.studyName;
      }

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
    };

    $scope.save = function () {
      if (_.isEmpty($scope.form.name)) {
        toastr.warning('You must enter a name for the plugin!', 'Plugin Editor');
      }
      if (_.all($scope.form.questions, 'name')) {
        $scope.isSaving = true;
        if ($scope.form.id) {
          FormService.update($scope.form, onFormSaved, onFormError);
        } else {
          FormService.save($scope.form, onFormSaved, onFormError);
        }
      } else {
        toastr.warning('No questions added yet!', 'Plugin Editor');
      }
    };

    $scope.import = function () {
      var idEncounter = $scope.encounter.id;
      if (angular.isDefined(idEncounter) &&
        angular.isNumber(idEncounter)) {
        $scope.isSaving = true;
        LegacyResource.get({id: idEncounter})
          .$promise.then(setForm);
      }
    };

    $scope.importJson = function (jsonForm) {
      var form = JSON.parse(jsonForm);

      // Strip IDs. It is vital that all id's are stripped to prevent
      // overwriting of data
      form = omit(form, 'id', form, true);

      setForm(form);
    };

    $scope.loadForm = function (id) {
      $scope.idPlugin = id;
      if (!id) { // load new form palette
        $scope.form = {};
      }
      $location.search('idPlugin', id);
    };

  }
})();
