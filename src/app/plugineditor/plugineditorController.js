(function() {
  'use strict';

  angular
    .module('dados.plugincreator.controller', [
      'dados.common.directives.pluginEditor.formService'
    ])
    .controller('PluginController', PluginController);

  PluginController.$inject = ['$scope', '$location', '$resource'];

  function PluginController($scope, $location, $resource) {

  }

})();
