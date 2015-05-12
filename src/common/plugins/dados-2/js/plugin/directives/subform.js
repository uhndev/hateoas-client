/**
 * This module allows for the loading of a form as a question. Through this,
 * groups of questions can be grouped as "forms", but embedded within other
 * forms. This allows for easier "branch" logic.
 * 
 * Currently, this is unfinished. Things left to complete are:
 *   - propagation of "readonly", "disabled" properties to all child questions.
 * 
 * There are several known issues:
 *   - Scope is isolated on the "question" directive. The Question directive
 *     should be re-written.
 *   - Each module should have an isolated scope, with Questions and Answers
 *     having a shared scope.
 */
angular.module('ui.dados.subform', [])
  .constant('FORM_API', '../rest/subforms/:idForm?deep=true')
  .controller('SubformController', ['$scope', '$rootScope', '$http', 'FORM_API', 
    function($scope, $rootScope, $http, API) {
	   $scope.loadForm = function(idForm, oldForm) {
			 if (idForm && idForm !== oldForm) {
				 $http.get(API.replace(/:idForm/g, idForm))
				   .then(function(response) {
					   $scope.widget.subform = angular.copy(response.data);
					   $rootScope.$broadcast("SubformWidgetLoaded", $scope.widget.subform);
				   });
			 }
		};
		 
		$scope.$on('AnswersUpdated', function(e, answers) {
			 $scope.answers = answers;
		});
    }])
  .directive('subform', [
  function() {
	 function postLink(scope, element, attr) {
		 scope.$watch('widget.properties.idForm', scope.loadForm);
		 scope.loadForm(scope.widget.properties.idForm);
		 scope.$on('$destroy', element.empty);
	 } 
	 
	 return {
		 restrict: 'A',
		 scope: false,
		 link: postLink,
		 controller: 'SubformController'
	 };
  }]);