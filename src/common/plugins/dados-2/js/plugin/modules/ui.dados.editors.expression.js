angular.module('ui.dados.editors.expression', [])
	.directive('uiExpressionEditor', function() {
		
		return {
			restrict: 'E',
			replace: true,
			require: 'ngModel',
			scope: {
				inputs: '&',
				expression: '=ngModel'
			},
			templateUrl: '../js/plugin/partials/UiExpressionEditor.html',
			controller: ExpressionController
		};
	});
	
function ExpressionController($scope, $element) {
    // Values are set using the $scope.reset() function below.
    $scope.defaultExpression = $scope.expression || [];
    //$scope.brackets; // Counter for brackets
    //$scope.selected; // Currently selected symbol in the expression

    // List of variables (aka fields)
    $scope.fields = angular.copy($scope.inputs()) || [];
    
    // Categories for each symbol
    $scope.categories = { 'Operators' : [ '(', ')', '+', '-', '/', '*', '%'],
                      'Inequalities' : [ '>', '>=', '<', '<=', '==', '!=' ],
                      'Boolean Operators' : ['!', '&&', '||'] };
    
    // Valid Symbols for Equations
    $scope.symbols = {
        '(': {
            name: '(',
            valid: always
        },
            ')': {
            name: ')',
            valid: validBrackets
        },
            '+': {
            name: '+',
            valid: previousSymbolIsValue
        },
            '-': {
            name: '-',
            valid: previousSymbolIsValue
        },
            '/': {
            name: String.fromCharCode(0x00f7), // division symbol
            valid: previousSymbolIsValue
        },
            '*': {
            name: String.fromCharCode(0x00d7), // multiplication symbol
            valid: previousSymbolIsValue
        },
            '%': {
            name: 'modulo',
            valid: previousSymbolIsValue  
        },
            '==': {
            name: 'equals',
            valid: previousSymbolIsValue
        },
            '!=': {
            name: 'is not equal to',
            valid: previousSymbolIsValue
        },
            '<': {
            name: 'less than',
            valid: previousSymbolIsValue
        },
            '>': {
            name: 'greater than',
            valid: previousSymbolIsValue
        },
            '<=': {
            name: 'less than or equal to',
            valid: previousSymbolIsValue
        },
            '>=': {
            name: 'greater than or equal to',
            valid: previousSymbolIsValue
        },
            '&&': {
            name: 'and',
            valid: previousSymbolIsValue
        },
            '||': {
            name: 'or',
            valid: previousSymbolIsValue
        },
            '!': {
            name: 'not',
            valid: always
        }
    };
    
/******************************************************************************
 * Private Methods
 ******************************************************************************/
    
    /**
     * Function to always returns true
     * @returns {Boolean}
     */
    function always() {
        return true;
    }
    
    /**
     * Function to test when a bracket may be placed. Brackets can only be 
     * placed when there is more than 1 opening symbol and followed by a field.
     * @returns {Boolean}
     */
    function validBrackets() {
        return ($scope.brackets > 0);
    }
    
    /**
     * @returns the last selected symbol in the expression. If no symbol is
     * selected, return the last symbol.
     */
    function getSelectedSymbol() {
        return ($scope.selected > -1 ?
                             $scope.expression[$scope.selected - 1]:
                             $scope.expression[$scope.expression.length - 1]);  
    }
    
    /**
     * @returns true if selected symbol is a field
     */
    function previousSymbolIsField() {
        var lastComponent = getSelectedSymbol();
        return ((lastComponent == ')') || 
        		($scope.fields.indexOf(lastComponent) > -1));
    }
    
    /**
     * @returns true if selected symbol is a value
     */
    function previousSymbolIsValue() {
        var lastComponent = getSelectedSymbol();
        return ((lastComponent !== undefined) &&
                ((lastComponent == ')') ||
                ($scope.symbols[lastComponent] === undefined)));
    }
    
    /**
     * Resets the form
     */
    function reset() {
        $scope.selected = -1;
        $scope.value = '';
        $scope.freeEdit = $scope.expression.join(' ');
    }

    /**
     * @returns true if the selected symbol is an operator
     */
    function previousSymbolsIsOperator() {
        var lastComponent = getSelectedSymbol();
        return ((lastComponent === undefined)  ||
                ($scope.symbols[lastComponent] !== undefined));
    }
    
    function countBrackets() {
    	var brackets = 0;
    	angular.forEach($scope.expression, function(symbol) {
    		if (symbol === '(') {
    			brackets++;
        }
    		if (symbol === ')') {
    			brackets--;
        }
    	});
    	return brackets;
    }
    
/******************************************************************************
 * Public Methods
 ******************************************************************************/
      
    /**
     * @returns true if selected symbol is an operator
     */
    $scope.previousSymbolsIsOperator = previousSymbolsIsOperator;
    
    /**
     * Selects a symbol from the equation.
     */
    $scope.select = function(index) {
        if ($scope.selected == index) {
            $scope.selected = -1;
        } else {
            $scope.selected = index;
        }
    };
    
    /**
     * Adds a symbol to the expression.
     */
    $scope.add = function(symbol) {
        if (symbol == '(') {
          $scope.brackets++;
        }
        if (symbol == ')') {
          $scope.brackets--;
        }
        if ($scope.selected > -1) {
            $scope.expression[$scope.selected] = symbol;
        } else {
            $scope.expression.push(symbol);
        }
        reset();
    };
    
    /**
     * Updates the expression given a string expression.
     */
    $scope.update = function(expression) {
        $scope.expression = expression.split(' ');
        $scope.brackets = countBrackets();
    };
    
    /**
     * Clears the expression editor
     */
    $scope.clear = function() {
    	$scope.expression = [];
    	$scope.brackets = 0;
    	reset();
    };
    
    /**
     * Resets the expression editor to default values;
     */
    $scope.reset = function() {
    	$scope.expression = angular.copy($scope.defaultExpression) || [];
    	$scope.brackets = countBrackets();
    	reset();
    };
    
    /**
     * Fires the event to notify the parent controller that the expression
     * has been completed.
     */
    $scope.save = function() {
    	$scope.$emit('useExpression', $scope.expression.join(' '));
    };
    

    $scope.reset();
}