angular.module('ui.dados', [
	'ui.dados.ngCapitalize',
	'ui.dados.ngName',
	'ui.dados.ngUnique',
	'ui.dados.uiHelp',
	'ui.dados.uiSortable',
	'ui.dados.uiWidget',
	'ui.dados.uiStatus',
	'ui.dados.input',
	'ui.dados.uiGrid',
	'ui.dados.uiPlugin'
]);

/******************************************************************************
 * attr: ng-captialize
 * 
 * This directive will captialize the ng-model value. Use this directive with
 * care as ng-model *can* be bound to objects. This directive should be applied
 * only to *strings*.
 * 
 * For a more complete solution, use CSS to text-transform to uppercase and
 * have the server uppercase the input instead.
 *****************************************************************************/
angular.module('ui.dados.ngCapitalize', [])
  .directive('ngCapitalize', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, controller) {
        var capitalize = function(inputValue) {
        	if (angular.isDefined(inputValue)) {
	        	var capitalized = angular.uppercase(inputValue);
	        	if(capitalized !== inputValue) {
	        		controller.$setViewValue(capitalized);
	        		controller.$render();
	            }         
	            return capitalized;
        	}
        	return inputValue;
         };
         controller.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);
     }
   };
  });

/******************************************************************************
 * attr: ng-name
 * 
 * In 1.2.13 of Angular, Angular cannot bind to the name attribute. This directive
 * will set the name of a DOM element given an Angular expression in the ng-name
 * attribute. 
 ******************************************************************************/
angular.module('ui.dados.ngName', [])
  .directive('ngName', function($compile) {
	return {
		restrict: 'A',
		link:{
			pre: function(scope, elem) {
		      var name = scope.$eval(elem.attr('ng-name'));
		      elem.removeAttr('ng-name');
		      elem.attr('name', name);
		      $compile(elem)(scope);
	    }}
	};
});

/******************************************************************************
 * element: ui-help
 * 
 * Provides a standard method of displaying help information for widgets. The
 * message will be displayed as a popup message when the user hovers over the
 * ng-help DOM element.
 ******************************************************************************/
angular.module('ui.dados.uiHelp', [])
  .directive('uiHelp', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			message: '='
		},
		template: '<span class="glyphicon glyphicon-question-sign" ' +
				  'popover-trigger="mouseenter"></span>'
	};
});

/******************************************************************************
 * attribute: ng-unique
 * 
 * This attribute specifies that the value of a control must be unique. The
 * value of the control will be checked against the list defined by the
 * attribute 'ng-unique'. The attribute 'ng-unqiue-attr' points to the attribute
 * in the list.
 ******************************************************************************/
angular.module('ui.dados.ngUnique', [])
  .directive('ngUnique', function() {
    return {
        restrict : 'A',
        require: 'ngModel',
        scope: {
            list: '&ngUnique',
            attr: '@ngUniqueAttr'
        },
        link: function(scope, element, attr, ngModel) {
            ngModel.$parsers.unshift(function(value) {
                var valid = true;
                 angular.forEach(scope.list(), function(item) {
                    if (valid && item[scope.attr] === value) {
                        valid = false;
                    }
                 });
                 ngModel.$setValidity('ngUnique', valid);
                 return valid ? value : undefined;
            });
        }
    };
});


/******************************************************************************
 * attribute: ui-sortable
 * 
 * This attribute will make any DOM element sortable using the JQuery-ui
 * sortable plugin. During a sort, the previous index value will be stored in
 * the oldIndex attribute. When a sort is completed, a "sortupdate" event will
 * be called. This can be used to update the data array in the controller.
 ******************************************************************************/
angular.module('ui.dados.uiSortable', [])
  .directive('uiSortable', function() {
	return {
		restrict: 'A',
		link : function(scope, element, attrs) {
			element.sortable()
				.disableSelection()
				.on( "sortstart", function( event, ui ) {
					scope.oldIndex = ui.item.index();
				} )
				.on( "sortupdate", function( event, ui ) {
					scope.$emit('move', scope.oldIndex, ui.item.index());
				});
		}
	};
});

/******************************************************************************
 * element: ui-widget
 * 
 * This creates a DOM element that is a widget based off of the "Question"
 * class in ca.uhn.subforms.models.Question. Using the template property, the
 * HTML structure for the widget is dynamically loaded.
 * 
 * Child Scopes must be created to prevent memory leaks from occuring when using
 * jQuery widgets - such as the slider.
 ******************************************************************************/
angular.module('ui.dados.uiWidget', [])
  .directive('uiWidget', function($http, $templateCache, $compile, $q) {
	
	var linker = function(scope, element, attributes) {
		var childScope = null;
		
		/**
		 * procedure: getTemplates
		 * 
		 * Fetches a list of 'GET' requests to components to build a template.
		 * The components are defined as arguments for the getTemplates method.
		 * 
		 * @return list of 'GET' requests to fetch templates.
		 */
		var getTemplates = function() {
			var templates = [];
		
			if (arguments.length) {
				angular.forEach(arguments, function(template) {
					templates.push($http.get(template, 
			    			{cache: $templateCache}));
				});
			}
		    	
	    	return templates;
		};
		
		/**
		 * function: getNewScope
		 * 
		 * To avoid memory leaks, old scopes should be destroyed and new ones
		 * created. This allows us to keep the parent scope pristine and avoid
		 * causing any memory issues.
		 * 
		 * @return a copy of the current parent scope.
		 */
		var getNewScope = function(oldScope) {
			if (oldScope) {
				oldScope.$destroy();
				oldScope = null;
			}
			element.empty();
			return scope.$new();
		};
		
		/**
		 * callback: renderTemplates
		 * 
		 * Once all the templates are fetched from the server, the HTML fragments
		 * are appended to the parent element and compiled.
		 */
		var renderTemplates = function(templates) {
			angular.forEach(templates, function(template) {
				element.append(template.data);
			});
			$compile(element.contents())(childScope);
    	};
		
    	/**
    	 * observer: rebuildTemplate
    	 * 
    	 * Any time the template value changes, the widget must be re-created
    	 * and rendered to the front-end.
    	 */
		var rebuildTemplate = function(newTemplate) {
			if (newTemplate) {
				childScope = getNewScope(childScope);
				var templateList = [];
				
				if (!scope.hideLabel()) {
					templateList.push('../js/plugin/partials/WidgetLabel.html');
				}
				
				templateList.push('../js/plugin/partials/widgets/' + newTemplate + '.html');
				var templates = getTemplates.apply(null, templateList);
				
				if (templates.length) {
					// Only render the templates after each template has been
					// retrieved using the $q promise.
					$q.all(templates).then(renderTemplates);
				}
			}
		};
		
		// Setup an observer
		scope.$watch('widget.template', rebuildTemplate);
	};
	
	return {
		restrict: 'E',
		replace: false,
		templateUrl: '../js/plugin/partials/Placeable.html',
		scope: {
			widget : '=',
			widgetModel : '=',
			hideLabel: '&',
			editMode: '&'
		},
		link : linker,
		terminal: true
	};
});

/******************************************************************************
 * element: ui-status
 * 
 * This is a DOM element created at the top level to display status information.
 * The status uses the standard Bootstrap alert classes to create the panels.
 * Users must manually close the status alert.
 * 
 * TODO: Create a fade out effect instead of a manual close.
 ******************************************************************************/
angular.module('ui.dados.uiStatus', [])
  .directive('uiStatus', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: '../js/plugin/partials/UiStatus.html',
		controller: function($scope, $element) {
			$scope.notifications = [];
			
			$scope.$on( 'updateStatus', function(e, status, message) {
				$scope.notifications.push({
					status : status,
					message : message
				});
			});
			
			$scope.remove = function(index) {
				if ($scope.notifications[index]) {
					$scope.notifications.splice(index, 1);
				}
			};
			
			$scope.$on( 'error', function(e, message) {
				$scope.notifications.push( {
					status: 'danger',
					message: 'An error has occurred: ' + message
				});
			});
			
			$scope.$on( 'success', function(e, message) {
				$scope.notifications.push( {
					status: 'success',
					message: 'Success! ' + message
				});
			});
			
		}
	};
});

angular.module('ui.dados.input', [])
/**
 * This directive fixes the bug where setting a numeric field containing a
 * text string cannot reset on Google Chrome.
 */
.directive('input', function () {
    return {
        restrict: 'E',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (attrs.type.toLowerCase() !== 'number') {
                return;
            } //only augment number input!
            ctrl.$formatters.push(function (value) {
                return value ? parseFloat(value) : null;
            });
        }
    };
});

/******************************************************************************
 * # Plugin Directives #
 * 
 * This file contains the core directives for the Plugin Module. 
 ******************************************************************************/

/******************************************************************************
 * element: ui-grid
 * 
 * Used to create a grid based interface. The grid interface for the Plugin
 * module is a list where each list item is an inline-block with a defined
 * width. This allows the interface to appear "grid-like".
 ******************************************************************************/
angular.module('ui.dados.uiGrid', [])
  .directive('uiGrid', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			cellIndex: '=',
			cellCount: '=',
			cell: '='
		},
		templateUrl: '../js/plugin/partials/UiGrid.html'
	};
});

/******************************************************************************
 * helper functions.
 * These functions are required by uiPlugin.
 ******************************************************************************/

/* Returns the index of an object within a collection */
function arrayObjectIndexOf(arr, obj) {
    for ( var i = 0, k = arr.length; i < k; i++ ) {
    	if (angular.equals(arr[i], obj)) {
            return i;
        }
    }
    return -1;
}

/* Concatentates objects that don't exist in the source collection */
function concatIfNotExists(source, additions) {
    var concatedCollection = source;
    for ( var i = 0, k = additions.length; i < k; i++ ) {
        var addition = additions[i];
        
        if (arrayObjectIndexOf(concatedCollection, addition) === -1) {
        	concatedCollection.push(addition);
        }
    }
    return concatedCollection;
}

/* Returns a nested collection buried within an object */
function getInnerCollection(obj, props) {
    var innerCollection = obj;
    
    for (var j = 0, l = props.length; j < l; j++) {
        if (typeof innerCollection[props[j]] !== 'undefined') {
            innerCollection = innerCollection[props[j]];
        } else {
        	return [];
        }
    }
    
    if (!(innerCollection instanceof Array)) {
        throw new TypeError("Inner property is not a collection!");
    }
    return innerCollection;
}

/* Returns an aggregation of objects based on collection properties */
function aggregateByProperty() {
    var props = Array.prototype.splice.call(arguments, 0);
    
    return function(objectCollection) {
        var result = [];
        for (var i = 0, k = objectCollection.length; i < k; i++) {
            var innerCollection = getInnerCollection(objectCollection[i], props);
            result = concatIfNotExists(result, innerCollection);
        }
        return result;
    };
}

/******************************************************************************
 * element: ui-plugin
 * 
 * Creates the standard interface for a plugin.
 ******************************************************************************/
angular.module('ui.dados.uiPlugin', ['data.dados.form'])
  .directive('uiPlugin', function($http, $templateCache, $compile, $location, FormResource) {
	var linker = function(scope, element, attr) {
		if (attr.templateurl) {
			$http.get(attr.templateurl, {cache: $templateCache})
	    		.success(function(template) {
	    			element.append(template);
	    			$compile(element.contents())(scope);
	    			scope.$broadcast('templateLoaded');
	    		});
		}
	};
	
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: {
			idPlugin: '=',
			defer: '&'
		},
		link: linker,
		controller: function($scope, $element) {
			//$scope.plugin;
			//$scope.subject;
			//$scope.metaData;
			
			/**
			 * default view is grid-mode.
			 */
			$scope.view = {
					mode: 'grid'
			};
			var answerSet = null;
			
			/**
			 * initSubject - sets the user's id based off of the query string.
			 */
			var initSubject = function() {
				$scope.subject = {
						id: parseInt(($location.search()).idSubject)
				};
			};
			
			/**
			 * initMetaData - store the query string as meta data.
			 */
			var initMetaData = function() {
				$scope.metaData = {}; 
				
				angular.forEach(($location.search()), function(value, key) {
					$scope.metaData[key] = value;
				});
			};
			
			/**
			 * initAnswers - the answer objects must be created for each
			 * question as answers are not enabled by default.
			 * 
			 * TODO: Answers were abstracted from questions. Consider refining
			 *       this from the UI.
			 */
			var initAnswers = function() {
				/* initialize all answers */
				angular.forEach($scope.plugin.questions, 
					function(question) {
						question.answer = {};
						if (question.properties.type.match(/checkbox/i)) {
							question.answer = { value : [] };
						} else {
							question.answer = { value : null };
						}
					});
			};
			
			/**
			 * If a plugin ID is provided, get the plugin from the database. A
			 * deep query must be done to acquire related elements.
			 */
			var initPlugin = function() {
				if ($scope.idPlugin) {
					var req = { id: $scope.idPlugin, deep: true };
					FormResource.get(req).$promise.then( 
						function(plugin) {
							$scope.plugin = plugin;
							initAnswers();
							$scope.loaded();
						});
				}
			};
			
			/**
			 * Builds an answerset object
			 */
			var getAnswerSet = function() {
				return {
						form: angular.copy($scope.plugin),
						subject: angular.copy($scope.subject),
						metaData: angular.copy($scope.metaData)
				};
			};
			
			/**
			 * Given an answerset, loads all the answers into the current plugin.
			 */
			var loadAnswerSet = function(set) {
				var setQuestions = set.form.questions;
				var setLength = setQuestions.length;
				angular.forEach($scope.plugin.questions, function(question) {
					for (var i = 0; i < setLength; i++) {
						if (question.id == setQuestions[i].id) {
							angular.copy(
								setQuestions[i].answer || { value: undefined },
								question.answer);
							break;
						}
					}
				});
				answerSet = angular.copy(set);
				$scope.form.$blank = false;
				$scope.form.$setPristine();
			};
			
			/**
			 * Clears all the answers on a plugin.
			 */
			var clearAnswerSet = function() {
				initAnswers();
				answerSet = null;
				$scope.form.$blank = true;
				$scope.form.$setPristine();
			};
			
			/**
			 * Returns an aggregation of all unique options given a 
			 * "Questions" collection.
			 */
			var collatePropertiesOptions = 
				aggregateByProperty('properties', 'options');
			
			/**
			 * Loads answers into the plugin. WidgetRefresh is called to notify
			 * special elements to update their UI events. An example is the
			 * uiHotSpot.
			 */
			$scope.$on('answerSetLoaded', function(e, set) {
				loadAnswerSet(set);
				$scope.$broadcast('widgetRefresh');
			});
			
			/**
			 * Event to clear all the answers.
			 */
			$scope.$on('answerSetCleared', function(e) {
				clearAnswerSet();
				$scope.$broadcast('widgetRefresh');
			});
			
			/**
			 * This event sets the form as dirty. This will enable the "save"
			 * and/or "update" functionality on the front-end.
			 */
			$scope.$on('setDirty', function(e, hotSpot) {
				$scope.form.$setDirty();
			});
			
			/**
			 * This event triggers a save. This event is fired by the AutoSave
			 * function from js/FormAutoSaver.js#_notifyPlugins
			 */
			$scope.$on('autoSave', function(e) {
				if (answerSet) {
					$scope.update();
				} else {
					$scope.save();
				}
			});
			
			var loadPlugin = $scope.$on('loadPlugin', function(e, id) {
				if ($scope.idPlugin === id) {
					initSubject();
					initMetaData();
					initPlugin();
					loadPlugin();
				}
			});
			
			/**
			 * Broadcasts an event to notify all observers that the answerset
			 * has completed loading.
			 */
			$scope.loaded = function() {
				$scope.$emit('pluginLoaded', $scope.plugin.id);
				$scope.$broadcast('loadAnswerSets', 
						$scope.subject.id, $scope.plugin.id);
			};
			
			/**
			 * Resets a form.
			 */
			$scope.reset = function() {
				if (answerSet) {
					loadAnswerSet(answerSet);
				} else {
					clearAnswerSet();
				}
			};
			
			/**
			 * Broadcasts the save event to save an AnswerSet. This message is
			 * observed by the AnswerSet Controller.
			 */
			$scope.save = function() {
				if ($scope.form.$dirty && $scope.form.$blank) {
					$scope.$broadcast('saveAnswerSet', getAnswerSet());
				}
			};
			
			/**
			 * Broadcasts the update AnswerSet. This message is observed by the
			 * AnswerSet Controller.
			 */
			$scope.update = function() {
				if ($scope.form.$dirty && !$scope.form.$blank) {
					if (answerSet) {
						var payload = getAnswerSet();
						payload.id = answerSet.id;
						$scope.$broadcast('updateAnswerSet', payload);
					}
				}
			};
			
			/**
			 * Broadcasts the archive AnswerSet event . This message is observed
			 * by the AnswerSet Controller.
			 */
			$scope.archive = function() {
				if (answerSet) {
					$scope.$broadcast('archiveAnswerSet', answerSet.id);
				}
			};
			
			/**
			 * @DEVONLY
			 * Generates random information. Remove this when moving to
			 * production.
			 */
			$scope.random = function() {
        var callback = function() {
          $scope.form.$setDirty();
          $scope.form.$blank = true;
          $scope.$broadcast('saveAnswerSet', getAnswerSet());
        };
        
				for (var i = 0; i < 50; i++) {
					randomData($scope.plugin.questions, $http, callback);
				}
			};
			
			$scope.getHeaderUrl = function() {
				if (angular.isDefined($scope.plugin)) {
					return $scope.plugin.metaData.headerUrl;
				} else {
					return undefined;
        }
			};
			
			$scope.getFooterUrl = function() {
				if (angular.isDefined($scope.plugin)) {
					return $scope.plugin.metaData.footerUrl;
				} else {
					return undefined;
        }
			};
			
			  
			$scope.getOptions = function() {
				if (angular.isDefined($scope.plugin)) {
					return collatePropertiesOptions($scope.plugin.questions);
				} else {
					return [];
        }
			};
			
			/**
			 * @DEVONLY
			 * Generates debug information
			 */
			$scope.debug = function() {
				console.log($scope.form);
				console.log($scope.plugin);
				console.log($scope);
			};
			
			/* constructor */
			$scope.$on('templateLoaded', function(e)
			{
				if (!$scope.defer()) {
					initSubject();
					initMetaData();
					initPlugin();
					loadPlugin();
				}
			});
		}
	};
});