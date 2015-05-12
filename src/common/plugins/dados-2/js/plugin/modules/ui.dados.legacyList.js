var StudyService = function($resource) {
	return $resource('../rest/legacy/study');
};

var EncounterService = function($resource) {
	return $resource('../rest/legacy/study/:id/encounter', { id: '@id' },
			{ 'get': { method: 'GET', isArray: true }});
};

var SubjectService = function($resource) {
	return $resource('../rest/legacy/subject/:id', { id: '@id'},
			{ 'get' :  { method: 'GET', isArray: false }});
};

angular.module('ui.dados.legacyList', ['ngResource'])
  .factory('StudyResource', ['$resource', StudyService])
  .factory('EncounterResource', ['$resource', EncounterService])
  .factory('SubjectResource', ['$resource', SubjectService])
  .directive('uiLegacyList', function() {
	 return {
		 restrict: 'E',
		 replace: true,
		 scope: {
			 list: '&',
			 label: '@'
		 },
		 templateUrl: '../js/plugin/partials/UiSelector.html',
		 link: function($scope, $element, $attr, $ctrl){
			 $scope.$watch('selected', function(item) {
				 if (angular.isDefined(item)) {
					 $scope.$emit($attr.selectedEvent, item);
				 }
			 });
		 }
	 };
  });