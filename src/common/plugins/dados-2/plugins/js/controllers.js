var PluginController = function($scope, $location, FormResource, LegacyResource, 
      StudyResource, EncounterResource) {
	$scope.isSaving = false;
	$scope.isSettingsOpen = true;
	$scope.isEditorOpen = true;
	$scope.form = { name: '', questions: [], metaData: {}};
	$scope.forms = FormResource.query();
	StudyResource.query().$promise.then(function(studies) {
		$scope.studies = studies;
	});
	$scope.encounters = [];
	$scope.encounter = null;
	$scope.idPlugin = parseInt($location.search()['idPlugin'], 10);
	
	$scope.$on('studySelected', function(e, study) {
		EncounterResource.get({ id: study.id }).$promise.then(function(encounters) {
			$scope.encounters = encounters;
			console.log(encounters);
		});
	});
	
	$scope.$on('encounterSelected', function(e, encounter) {
		$scope.encounter = encounter;
	});
	
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
			FormResource.update($scope.form, onFormSaved);
		} else {
			FormResource.save($scope.form, onFormSaved);
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
	
	if ($scope.idPlugin && !isNaN(parseInt($scope.idPlugin, 10))) {
		FormResource.get({id: $scope.idPlugin, deep: true}, setForm);
	}
	
	$scope.loadForm = function(id) {
		$location.search('idPlugin', id);
	};
	
};


var LayoutController = function($scope, $modal) {
	$scope.grid = [];  // Plugin layout is defined by a flat grid.
	var MIN_WIDTH = 20; // Minimum width of a cell
	// Cell defaults. Each cell is by default 100% wide.
	$scope.width = 100;
	$scope.step = 10;
	$scope.showSettings = false;
	
	var getTemplate = function() {
		return  { css : { width : $scope.width + '%' } };
	};
	
	/**
	 * listener: expand
	 *
	 * Increases the width of a cell by the defined MIN_WIDTH size;
	 * 
	 * @param e is the event data
	 * @param cell is the cell to expand
	 */
	$scope.$on("expand", function(e, cell) {
		var width = parseInt(cell.css.width);
		width += $scope.step;
		if (width > 100) { width = 100; }
		cell.css.width = width + '%';
	});
	
	/**
	 * listener: shrink
	 *
	 * Decreases the width of a cell by the defined MIN_WIDTH size;
	 * 
	 * @param e is the event data
	 * @param cell is the cell to shrink
	 */
	$scope.$on("shrink", function(e, cell) {
		var width = parseInt(cell.css.width);
		width -= $scope.step;
		if (width < MIN_WIDTH) { width = MIN_WIDTH; }
		cell.css.width = width + '%';
	});
	
	/**
	 * listener: remove
	 * 
	 * Removes a cell from the grid.
	 * 
	 * @param e is the event data
	 * @param pivotIndex is the index of the cell to be removed
	 */
	$scope.$on("remove", function(e, pivotIndex) {
		var cell = $scope.grid[pivotIndex];
		
		
		if (cell.isDeleted === false &&
				confirm("All contents of this will be removed and you will not " +
				"be able to retrieve this. Do you want to continue?")) {
			if (!!(cell.id)) {
				cell.isDeleted = true;
			} else {
				$scope.grid.splice(pivotIndex, 1);
			}
		} else {
			if (cell.isDeleted) {
				cell.isDeleted = false;
			}
		}
	});
	
	/**
	 * listener: remove
	 * 
	 * Adds a cell to the grid.
	 * 
	 * @param e is the event data
	 * @param pivotIndex is the index of the cell to be added.
	 */
	$scope.$on("add", function(e, pivotIndex) {
		$scope.grid.splice(pivotIndex, 0, getTemplate());
	});
	
	/**
	 * listener: move
	 * 
	 * Moves a cell from one index to another index
	 * 
	 * @param e is the event data
	 * @param oldIndex is the index of the cell to be moved
	 * @param newIndex is the new location of the cell
	 */
	$scope.$on("move", function(e, from, to) {
		$scope.grid.splice(to, 0, $scope.grid.splice(from, 1)[0]);
	});
	
	/**
	 * listener: configure
	 * 
	 * Creates a modal window that allows the user to configure a widget to add
	 * to the plugin
	 * 
	 * @param e is the event data
	 * @param index is the index of the cell to create the widget
	 */
	$scope.$on('configure', function(e, index) {
		var modal = $modal.open({
			templateUrl: 'partials/WidgetModal.html',
			controller: WidgetModalController,
			resolve : {
				widget : function() {
					return $scope.grid[index];
				},
				fieldNames: function() {
					var names = [];
					angular.forEach($scope.grid, function(widget) {
						if (angular.isDefined(widget.name)) {
							names.push( widget.name );
            }
					});
					return names;
				}
			}
		});
		
		modal.result.then(function(widget) {
			angular.copy($scope.grid[index].css, widget.css);
			$scope.grid[index] = angular.copy(widget);
		});
	});
	
	$scope.$on('setGrid', function(e, grid) {
		$scope.grid = grid;
		if ($scope.grid.length === 0) {
			$scope.grid.push( getTemplate() );
		}
	});
	
	$scope.$emit('layoutControllerLoaded');
};

var WidgetModalController = function ($scope, $modalInstance, widget, fieldNames) {
	$scope.fieldNames = angular.copy(fieldNames);
	$scope.widget = angular.copy(widget);
	
	$scope.$on('widgetControllerLoaded', function(e) {
		$scope.$broadcast('setWidget', $scope.widget);
	});
	
	$scope.$on('returnWidget', function(e, widget) {
		angular.copy(widget, $scope.widget);
		$scope.widget.uuid = guid(8);
		$modalInstance.close($scope.widget);
	});
	
	$scope.ok = function () {
		$scope.$broadcast('getWidget');
	};
	
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};

var WidgetController = function($scope, $modal) {
	$scope.categories = WIDGET_CATEGORIES;
	$scope.widget = {};
	
	var widgetExtend = function(source) {
		var widgets = Array.prototype.slice.call(arguments);
		
		if (widgets && widgets.length) {
			var copy = {};
			widgets.map(function(widget) {
				for (var prop in widget) {
					if (widget.hasOwnProperty(prop)) {
						var property = widget[prop];
						/***
						 * NOTE: Javascript considers Arrays as objects, so to 
						 * avoid converting arrays to objects, check for arrays.
						 **/
						if (angular.isObject(property) && !angular.isArray(property)) {
							copy[prop] = widgetExtend(copy[prop], property);
						} else {
							copy[prop] = property;
						}
					}
				}
			});
			return copy;
		}
		
		return {};
	};
	
	var bindList = function() {
		if (angular.isDefined($scope.widget.properties.options)) {
			$scope.$broadcast('setList', $scope.widget.properties.options);
		}
	};
	
	$scope.$watch('widget.template', function(newType, oldType) {
		if (newType) {
			if (newType != oldType) {
				$scope.widget = angular.copy(WIDGET_TEMPLATES[newType]);
				bindList();
			}
		}
	});
	
	$scope.$on('setWidget', function(e, widget) {
		$scope.widget = widgetExtend(WIDGET_TEMPLATES[widget.template], widget);
	});
	
	$scope.$on('listControllerLoaded', function(e) {
		bindList();
	});
	
	$scope.$on('getWidget', function(e) {
		$scope.$emit('returnWidget', $scope.widget);
	});
	
	$scope.createExpression = function(property, fields) {
		var modal = $modal.open({
			templateUrl: 'partials/WidgetEditorCreateExpression.html',
			controller: ExpressionModalController,
			resolve: {
				title: function() {
					return [property, 'when...'].join(' ');
				},
				fieldNames: function() {
					return fields;
				},
				expression: function() {
					if (angular.isDefined($scope.widget) &&
							angular.isDefined($scope.widget.properties) && 
							angular.isDefined($scope.widget.properties[property]) &&
							angular.isString($scope.widget.properties[property])) {
							return $scope.widget.properties[property].split(' ');
					}
					return undefined;
				}
			}
		});
		
		modal.result.then(function(expression) {
			if (expression === undefined) {
				delete $scope.widget.properties[property];
			} else {
				$scope.widget.properties[property] = expression;
			}
		});
	};
	
	$scope.$emit('widgetControllerLoaded');
};

var ExpressionModalController = function($scope, $modalInstance, title, fieldNames, expression) {
	$scope.title = title;
	$scope.fieldNames = fieldNames;
	$scope.expression = expression;
	
	$scope.save = function(expression) {
		var result = '';
		
		if (angular.isArray(expression)) {
			result = expression.join(' ');
		} else {
			result = expression;
    }
		
		if ( (result.length === 0) || (result === 'false') ) {
			result = undefined;
    }
		
		$modalInstance.close(result);
	};
	
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};