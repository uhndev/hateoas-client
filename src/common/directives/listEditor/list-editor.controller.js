(function() {
	'use strict';
	angular.module('dados.common.directives.list-editor.controller', [])

	.controller('ListEditorController', ListEditorController);

	ListEditorController.$inject = ['$scope', '$filter', 'ngTableParams'];

	function ListEditorController($scope, $filter, NgTableParams) {
		var vm = this;

		/************************
		 * Bindable Variables   *
		 ************************/
		vm.list = vm.list || [];
		vm.columns = vm.columns || [];

		// public variable for determining if table is editable
		vm.canEdit = vm.canEdit || false;
		
		// public booleans for locking other buttons when editing
		vm.editRow = false;
		vm.editCol = false;
		vm.editItem = false;

		// ng-disablers for validation when adding new row/cols
		vm.canAddRow = false;
		vm.canAddCol = false;

		// buffers for storing tentative row/col data
		vm.rowBuffer = {};    // for new rows
		vm.columnBuffer = {}; // for new rows
		vm.itemBuffer = {};   // for existing rows/cols

		vm.dataReady = false;
		vm.forceReload = false;

		/************************
		 * Bindable Methods     *
		 ************************/
		vm.affixMissingColumns = affixMissingColumns;

		// Row Editing Functions
		vm.selectRowEdit = selectRowEdit;
		vm.cancelRowEdit = cancelRowEdit;
		vm.removeRow = removeRow;
		vm.editNewRow = editNewRow;
		vm.addRow = addRow;

		// Column Editing Functions
		vm.selectColumnEdit = selectColumnEdit;
		vm.cancelColumnEdit = cancelColumnEdit;
		vm.removeColumn = removeColumn;
		vm.editNewColumn = editNewColumn;
		vm.addColumn = addColumn;

		vm.toggleEdit = toggleEdit;
		vm.reset = reset;
		vm.isSortBy = isSortBy;
		vm.sortTable = sortTable;

		init();

		///////////////////////////////////////////////////////////////////////////

		function init() {
			$scope.tableParams = new NgTableParams({
				page: 1,              // show first page
				count: 10             // count per page
			}, {
				total: vm.list.length,
				getData: function($defer, params) {
					var FOData = getFOData(vm.list, params);
					params.total(FOData.length); // set total for recalc pagination
					$defer.resolve(FOData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				},
			});
			$scope.tableParams.settings().$scope = $scope;
		}

		/** 
		 * Given possibly mismatched input lists with varying columns,
		 * flatten and union mismatched keys (duplicate columns are merged)
		 * and return proper evenly column-matched data
		 */
		function affixMissingColumns(listInput, colInput) {
			var missingCols = [];
			// determine duplicate-free column names from list
			_.chain(_.union(_.flatten(_.map(listInput, _.keys))))
			// determine which columns are missing from columns definition
			.difference(_.pluck(colInput, 'field'))
			.map(function(m) {
				missingCols.push({
					field: m,
					type: _.every(_.compact(_.pluck(listInput, m)), _.isNumber) ? 'number' : 'text'
				});
			});

			// re-constituted columns array
			_.each(missingCols, function(item) {
				colInput.push({
					title: item.field.charAt(0).toUpperCase() + item.field.substring(1),
					field: item.field,
					type: item.type
				});
			});

			// re-constituted data array
			_.map(listInput, function(item) {
				_.each(missingCols, function(m) {
					if (!_.has(item, m.field)) {
						item[m.field] = "";
					}
				});
				return item;
			});

			vm.dataReady = true;
		}

		/**
		 * Row Editing Functions
		 * For existing rows: [selectRowEdit, cancelRowEdit, removeRow] 
		 * For new rows: [editNewRow, addRow]
		 */
		function selectRowEdit(item) {
			vm.toggleEdit(item);
			vm.editItem = true;
			angular.copy(item, vm.itemBuffer);
		}

		function cancelRowEdit(item) {
			var idx = vm.list.indexOf(item);
			angular.copy(vm.itemBuffer, vm.list[idx]);
			vm.toggleEdit(item);
		}

		function removeRow(item) {
			if (confirm('Are you sure you want to delete this row?')) {
				var idx = vm.list.indexOf(item);
				vm.list.splice(idx, 1);
				$scope.tableParams.reload();
			}
		}

		function editNewRow() {
			vm.rowBuffer = {};
			vm.editRow = true;
		}

		function addRow() {
			vm.list.push(vm.rowBuffer);
			$scope.tableParams.reload();
			vm.rowBuffer = {};
			vm.editRow = false;
		}

		/**
		 * Column Editing Functions
		 * For existing columns: [selectColumnEdit, cancelColumnEdit, removeColumn]
		 * For new columns: [editNewColumn, addColumn]
		 */
		function selectColumnEdit(column) {
			var colData = _.pluck(vm.list, column.field);
			vm.toggleEdit(column);
			vm.itemBuffer.title = column.title;
			vm.itemBuffer.data = colData;
		}

		function cancelColumnEdit(column) {
			// Reset title
			var idx = vm.columns.indexOf(column);
			vm.columns[idx].title = vm.itemBuffer.title;
			// Reset column data 
			_.map(vm.list, function(row, i) {
				row[column.field] = vm.itemBuffer.data[i];
			});
			vm.toggleEdit(column);
		}

		function removeColumn(index) {
			if (confirm('Are you sure you want to delete column: ' + vm.columns[index].field + '?')) {
				_.each(vm.list, function(row) {
					angular.copy(_.omit(row, vm.columns[index].field), row);
				});
				vm.columns.splice(index, 1);
				$scope.tableParams.reload();
			}        
		}

		function editNewColumn() {
			vm.editCol = true;
			vm.canAddRow = false;
			vm.columnBuffer.data = {};
			vm.columnBuffer.type = 'text';
		}

		function addColumn() {
			var newCol = {};
			// set column settings
			newCol.title = vm.columnBuffer.title;
			newCol.field = vm.columnBuffer.field;
			newCol.type = vm.columnBuffer.type;
			vm.columns.push(newCol);

			// add new column data to new column in list data
			_.each(_.keys(vm.columnBuffer.data), function(k) {
				vm.list[k][newCol.field] = vm.columnBuffer.data[k];
			});

			// fill non-provided data values with empty string
			_.each(vm.list, function(row) {
				if (row[newCol.field] === undefined) {
					row[newCol.field] = '';
				}
			});

			$scope.tableParams.reload();
			vm.columnBuffer = {};
			vm.editCol = false;
		}

		/**
		 * Function for toggling existing row or column edits
		 */
		function toggleEdit(item) {
			vm.itemBuffer = {};
			item.$edit = !item.$edit;
		}

		/**
		 * Function for clearing row and column buffers on cancel
		 */
		function reset(close) {
			vm.itemBuffer = {};
			vm.rowBuffer = {};
			vm.columnBuffer = {};
			if (close) {
				vm.editCol = false;
				vm.editRow = false;
				_.each(vm.columns, function(c) {
					c.$edit = false;
				});
			}
		}

		function isSortBy(column, order) {
			return $scope.tableParams.isSortBy(column, order);
		}

		function sortTable(column) {
			var sortParam = {};
			if (!column.$edit) {
				sortParam[column.field] = $scope.tableParams.isSortBy(column.field, 'asc') ? 'desc' : 'asc';
				$scope.tableParams.sorting(sortParam);          
			}
		}

		function getFOData(data, params) {
			var orderedData = data;
			if (params.orderBy().length > 0) {
				orderedData = params.sorting() ?
					$filter('orderBy')(data, params.orderBy()) : data;
			}
			return orderedData;			
		}

		/**
		 * Watchers for validating new col/row fields without forms
		 */
		var unregister = $scope.$watch(function () {
			return vm.list;
		}, function (newval) {
			if (newval.length > 0) {
				vm.affixMissingColumns(vm.list, vm.columns);
				unregister();
			}
		}, true); 

		$scope.$watch(function () {
			return vm.dataReady;
		}, function(newVal) {
			if (newVal && vm.list.length > 0) {
				$scope.tableParams.reload();
			}
		});		

		$scope.$watchCollection(function () {
			return vm.itemBuffer;
		}, function(newVal) {
			vm.canEditItem = _.values(newVal).length !== 0;
		});

		$scope.$watchCollection(function () {
			return vm.rowBuffer;
		}, function(newVal) {
			// allow row to be added if all fields are non-empty
			vm.canAddRow = _.compact(_.values(newVal)).length == vm.columns.length;
		});

		$scope.$watchCollection(function () {
			return vm.columnBuffer;
		}, function(newVal) {
			// allow column to be added if new column title, field,
			// type are non-empty and data object exists in columnBuffer
			var filledCols = _.compact(_.values(newVal)).length == 4;
			var isUniqueCol = _.indexOf(_.pluck(vm.columns, 'field'), newVal.field) < 0;
			vm.canAddCol = filledCols && isUniqueCol;
		});

		$scope.$watch(function() {
			return vm.forceReload;
		}, function(newVal, oldVal) {
			if (newVal !== oldVal) {
				$scope.tableParams.reload();
			}
		});
	}

})();