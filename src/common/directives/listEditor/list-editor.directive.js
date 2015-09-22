/**
 * element: list-editor
 *
 * This is a generic editor for list data. Provided an array, the list-editor
 * will manage a list of objects. A template object can be provided to define
 * the structure of the objects store in the list. If no template is provided,
 * then an array of objects with a name, value pair will be stored.
 *
 * A \"canEdit\" flag will allow the client to modify the object structure
 * by creating, renaming, and deleting object properties.
 *
 * Dependencies:
 * ngTable, angular-bootstrap
 *
 * Usage:
 angular.module('main', ['dados.common.directives.listEditor'])
 .controller('MainCtrl', function($scope) {
		$scope.list = [
			{name: "Moroni", age: 50},
			{name: "Tiancum", age: 43, weight: 189, complexion: "dark"},
			{name: "Jacob", age: 27},
			{name: "Nephi", age: 29, complexion: "fair"}
		];

		$scope.columns = [
			{ title: 'Name of Person', field: 'name', type: 'text'},
			{ title: 'Age of Person', field: 'age', type: 'number'},
			{ title: 'Type', field: 'type', type: 'dropdown', options: [
        { prompt: 'Scheduled', value: 'scheduled' },
        { prompt: 'Non-scheduled', value: 'non-scheduled' }
      ]},
		];

		$scope.toggleReload = false;

		$scope.someFunction = function() {
		  // does something, then reloads table
		  $scope.toggleReload = $scope.toggleReload
		};
	});

 <body ng-controller="MainCtrl">
  <list-editor list="list"
               columns="columns"
               affix-missing="false"
               can-edit="true"
               can-add-newcol="false"
               can-add-newrow="false"
               can-edit-header="false"
               can-del-row="false"
               can-del-col="false"
               force-reload="toggleReload">
  </list-editor>
 </body>
 */

(function() {
  'use strict';
  angular.module('dados.common.directives.listEditor', [
    'ui.bootstrap',
    'ngTable',
    'dados.common.directives.list-editor.controller'
  ])

    .directive('listEditor', function ($timeout) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          list: '=',
          columns: '=',
          affixMissing: '@',
          canEdit: '@',
          canAddNewcol: '@',
          canAddNewrow: '@',
          canEditHeader: '@',
          canDelRow: '@',
          canDelCol: '@',
          forceReload: '='
        },
        templateUrl: 'directives/listEditor/list-editor.tpl.html',
        controller: 'ListEditorController',
        controllerAs: 'ledit',
        bindToController: true
      };
    });

})();
