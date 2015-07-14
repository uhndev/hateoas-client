(function() {
  'use strict';
  angular.module('dados.common.directives.pluginEditor.pluginController', [
    'dados.common.directives.pluginEditor.formService'
  ])
  .controller('PluginController', PluginController);

  PluginController.$inject = ['$scope', '$location', 'FormService'];

  function PluginController($scope, $location, FormService) {
    $scope.isSaving = false;
    $scope.isSettingsOpen = true;
    $scope.isEditorOpen = true;
    $scope.form = { name: '', questions: [], metaData: {}};
    $scope.forms = FormService.query();
    $scope.idPlugin = $location.search()['idPlugin'];
    
    $scope.$on('metaDataControllerLoaded', function(e) {
      $scope.$broadcast('setMetaData', $scope.form.metaData);
    });
    
    $scope.$on('layoutControllerLoaded', function(e) {
      $scope.$broadcast('setGrid', $scope.form.questions);
    });
    
    $scope.$on('saveGrid', function(e, widgets) {
      $scope.form.questions = angular.copy(widgets);
    });
    
    /*
     * Dirty fix. This quick fix was put in place because the "Save" button
     * would fail after the first save. Didn't have time to debug, so forced
     * a refresh on the page.
     * 
     * For a more permanent fix, please use angular routing to control the follow
     * of the application.
     */
    $scope.$on('$locationChangeSuccess', function(e, newHref, oldHref) {
      if (newHref !== oldHref) {
        window.location.reload();
      }
    });
    
    var onFormSaved = function(result) {
      $scope.form = angular.copy(result);
      $scope.isSaving = false;
      $location.search('idPlugin', $scope.form.id);
      window.location.reload();
    };
    
    var setForm = function(form) {
      $scope.form = form;
      
      angular.forEach($scope.form.questions, function(question) {
        if (angular.isUndefined(question.properties.defaultValue)) {
          if (question.properties.type.match(/checkbox/i)) {
            question.properties.defaultValue = { value : [] };
          } else {
            question.properties.defaultValue = { value : undefined };
          }
        }
      });
      
      $scope.$broadcast('setGrid', $scope.form.questions);
      $scope.$broadcast('setMetaData', $scope.form.metaData);	
      $scope.isSaving = false;
    };
    
    $scope.save = function() {
      $scope.isSaving = true;
      if ($scope.form.id) {
        FormService.update($scope.form, onFormSaved);
      } else {
        FormService.save($scope.form, onFormSaved);
      }
    };
    
    $scope.import = function() {
      var idEncounter = $scope.encounter.id;
      if (angular.isDefined(idEncounter) && 
          angular.isNumber(idEncounter)) {
        $scope.isSaving = true;
        LegacyResource.get({ id: idEncounter })
          .$promise.then(setForm);
      }
    };
    
    $scope.importJson = function(jsonForm) {
      var form = JSON.parse(jsonForm);
      
      // Strip IDs. It is vital that all id's are stripped to prevent 
      // overwriting of data
      form = omit(form, 'id', form, true);
      
      setForm(form);
    };
    
    if ($scope.idPlugin) {
      FormService.get({id: $scope.idPlugin}, setForm);
    }
    
    $scope.loadForm = function(id) {
      $location.search('idPlugin', id);
    };
  }
})();