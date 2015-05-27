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
	angular.module('main', ['nglist-editor'])
	.controller('MainCtrl', function($scope) {
		$scope.list = [
			{name: "Moroni", age: 50},
			{name: "Tiancum", age: 43, weight: 189, complexion: "dark"},
			{name: "Jacob", age: 27},
			{name: "Nephi", age: 29, complexion: "fair"}
		];
		
		$scope.columns = [
			{ title: 'Name of Person', field: 'name', type: 'text'},
			{ title: 'Age of Person', field: 'age', type: 'number'}
		];
	});

	<body ng-controller="MainCtrl">
		<list-editor can-edit="true" list="list" columns="columns"></list-editor>
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
				canEdit: '@',
				canAddNewcol: '@',
				canAddNewrow: '@',
				canEditHeader: '@',
				canDelRow: '@',
				canDelCol: '@',
				config: '@',
				list: '=',
				columns: '=',
				forceReload: '='
			},
			templateUrl: 'directives/listEditor/list-editor.tpl.html',
			controller: 'ListEditorController',
			controllerAs: 'ledit',
			bindToController: true
		};
	});

})();

