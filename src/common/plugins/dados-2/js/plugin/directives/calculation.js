angular.module('ui.dados.calculation', [])
  .directive('uiCalculation', function() {
	 return {
		 restrict: 'A',
		 scope: false,
		 controller: ['$scope', '$element', function($scope, $element) {
			 /**
			  * Restrict which JavaScript objects are available for expressions.
			  * This is useful to prevent malicious code from executing. Currently,
			  * we allow only the Math, Date, and Array objects.
			  */
			 $scope.Math = Math;
			 $scope.Date = Date;
			 $scope.Array = Array;
			 $scope.parseInt = parseInt;
			 $scope.parseFloat = parseFloat;
			 
			 var expression = null;
			 
			 /**
			  * Attempt to find the parent ng-form-controller name.
			  */
			 function getFormName() {
				 var formElement = $element.closest('ng-form');
				 if (formElement.length) {
					 return $(formElement[0]).attr('name');
				 }
				 return null;
			 }
			 
			 /**
			  * Transform all variables in the equation to the appropriate 
			  * ng-form-controller field name.
			  */
			 function transformExpression(ngForm, expression) {
				 var components = expression.split(' ');
				 return _.map(components, function(component) {
					if (_.has(ngForm, component)) {
						//return [ngForm.$name, component, '$modelValue'].join('.');
						return ['plugin', component, '$modelValue'].join('.');
					}
					return component;
				 }, []).join(' ');
			 }
			 
			 /**
			  * Evaluate the expression.
			  */
			 $scope.output = function() {
				 if (expression === null) {
					 var form = getFormName();
					 if (form !== null) {
						 // form name vs 'plugin'
						 expression = transformExpression($scope['plugin'], 
								 $scope.widget.properties.expression);
					 }
				 }
				 
				 if (expression !== null) {
					 try {
						 return $scope.$eval(expression);
					 } catch(e) {
						 return "ERROR: Contact the administrator and let them " +
						   "know that the equation is incorrect.";
					 }
				 }
				 
				 return '';
			 };
			 
		 }]
	 }; 
  });