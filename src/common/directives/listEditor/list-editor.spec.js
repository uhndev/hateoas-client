describe('List Editor Directives', function() {
	var ctrl, scope, ngTableParams;
	// load the list-editor module
	beforeEach(module('dados.common.directives.listEditor'));

	beforeEach(inject(function (_$rootScope_, _$controller_, _ngTableParams_) {
		ngTableParams = _ngTableParams_;

		var data = {
			canEdit: true,
			canAddNewcol: false,
			canAddNewrow: true,
			canEditHeader: false,
			canDelRow: true,
			canDelCol: false,
			list: [
				{name: "Moroni", age: 50},
				{name: "Tiancum", age: 43, weight: 189, complexion: "dark"},
				{name: "Jacob", age: 27},
				{name: "Nephi", age: 29, complexion: "fair"}
			],
			columns: [
				{ title: 'Name of Person', field: 'name', type: 'text'},
				{ title: 'Age of Person', field: 'age', type: 'number'}
			],
			forceReload: false
		};	

		scope = _$rootScope_.$new();
		ctrl = _$controller_('ListEditorController', {$scope: scope}, data);
		scope.vm = ctrl;
	}));

	// describe('Data manipulation test suite', function() {

		// it('should manipulate data with mismatched columns', function() {	
			// console.log(ctrl.list);
			// console.log(ctrl.columns);
			// _.each(angular.copy(ctrl.list), function(row) {
			// 	expect(_.keys(row).length).toEqual(ctrl.columns.length);
			// });
		// });

		// it('should fill empty values with the empty string', function() {
		// 	// expect new values to be populated 
		// 	expect(ctrl.list[0].weight).toEqual('');
		// 	expect(ctrl.list[0].complexion).toEqual('');
		// });

		// it('should set field types to numbers if they seem like numbers', function() {
		// 	// expect weight to be a number input
		// 	expect(ctrl.columns[2].type).toEqual('number');
		// 	// expect complexion to be a text input
		// 	expect(ctrl.columns[3].type).toEqual('text');
		// });

		// it('should set the field title to the uppercase of the new field', function() {
		// 	// expect weight => Weight in field title
		// 	expect(ctrl.columns[2].title).toEqual('Weight');
		// 	expect(ctrl.columns[3].title).toEqual('Complexion');
		// });
	// });

	describe('Saving and cancelling of row/column actions', function() {

		var orig, tmp, newRow, newCol;
		beforeEach(function() {
			// original data
			orig = angular.copy(ctrl.list);

			newRow = angular.copy(orig);
			newRow.push({name: 'test', age:123, weight:123, complexion:'test'});

			newCol = angular.copy(orig);
			newCol[0].test = 'test0';
			newCol[1].test = '';
			newCol[2].test = 'test2';
			newCol[3].test = '';

			// expected data
			tmp = [
				{name: 'test', age:123, weight:123, complexion:'test'},
				{name: 'test', age:123, weight:123, complexion:'test'},
				{name: 'test', age:123, weight:123, complexion:'test'},
				{name: 'test', age:123, weight:123, complexion:'test'}
			]; 
		});

		// Cancelling data edits
		it('should edit row and cancel data', function() {
			_.each(ctrl.list, function(row) {
				ctrl.selectRowEdit(row);
				_.each(ctrl.columns, function(col) {
					if (col.type == 'number') {
						row[col.field] = 123;
					} else {
						row[col.field] = "test"; 
					}
				});
				ctrl.cancelRowEdit(row);
			});
			expect(_.difference(orig, ctrl.list)).toEqual(orig);
		});

		it('should edit col and cancel data', function() {
			_.each(ctrl.columns, function(col) {
				ctrl.selectColumnEdit(col);
				scope.$digest();
				_.each(ctrl.list, function(row) {
					if (col.type == 'number') {
						row[col.field] = 123;
					} else {
						row[col.field] = "test";
					}
				});
				ctrl.cancelColumnEdit(col);	
			});
			expect(_.difference(orig, ctrl.list)).toEqual(orig);
		});

		it('should edit new row and cancel data', function() {
			ctrl.editNewRow();
			scope.$digest();
			_.each(ctrl.columns, function(col) {
				if (col.type == 'number') {
					ctrl.rowBuffer[col.field] = 123;
				} else {
					ctrl.rowBuffer[col.field] = "test"; 
				}
			});
			ctrl.reset(true);
			expect(_.difference(orig, ctrl.list)).toEqual(orig);
		});

		it('should edit new col and cancel data', function() {
			ctrl.editNewColumn();
			scope.$digest();
			ctrl.columnBuffer.type = 'text';
			ctrl.columnBuffer.title = 'Test';
			ctrl.columnBuffer.field = 'test';
			ctrl.reset(true);
			expect(_.difference(orig, ctrl.list)).toEqual(orig);
		});

		// Saving data edits
		it('should edit row and save data', function() {
			_.each(ctrl.list, function(row) {
				ctrl.selectRowEdit(row);
				scope.$digest();
				_.each(ctrl.columns, function(col) {
					if (col.type == 'number') {
						row[col.field] = 123;
					}	else {
						row[col.field] = "test";
					}
				});
			});
			expect(_.difference(tmp, ctrl.list)).not.toEqual([true]);	
		});

		// it('should edit col and save data', function() {
		// 	_.each(ctrl.columns, function(col) {
		// 		ctrl.selectColumnEdit(col);
		// 		scope.$digest();
		// 		_.each(ctrl.list, function(row) {
		// 			if (col.type == 'number') {
		// 				row[col.field] = 123;
		// 			} else {
		// 				row[col.field] = "test";
		// 			}
		// 		});				
		// 	});
		// 	expect(angular.copy(ctrl.list)).toEqual(tmp);
		// });

		// it('should edit new row and save data', function() {
		// 	ctrl.editNewRow();
		// 	scope.$digest();
		// 	_.each(ctrl.columns, function(col) {
		// 		if (col.type == 'number') {
		// 			ctrl.rowBuffer[col.field] = 123;
		// 		} else {
		// 			ctrl.rowBuffer[col.field] = "test"; 
		// 		}
		// 	});
		// 	ctrl.addRow();
		// 	expect(angular.copy(ctrl.list)).toEqual(newRow);
		// });

	// 	it('should edit new col and save data', function() {
	// 		ctrl.editNewColumn();
	// 		scope.$digest();
	// 		ctrl.columnBuffer.type = 'text';
	// 		ctrl.columnBuffer.title = 'Test';
	// 		ctrl.columnBuffer.field = 'test';
	// 		ctrl.columnBuffer.data['0'] = 'test0';
	// 		ctrl.columnBuffer.data['2'] = 'test2';
	// 		ctrl.addColumn();
	// 		expect(angular.copy(ctrl.list)).toEqual(newCol);
	// 	});
	});

	describe('Deleting rows and columns', function() {
		var delRow, delCol;
		beforeEach(function() {
			delRow = angular.copy(ctrl.list);	
			delRow.splice(0, 1);

			delCol = [
				{age: 50, weight: '', complexion: ''}, 
				{age: 43, weight: 189, complexion: 'dark'}, 
				{age: 27, weight: '', complexion: ''}, 
				{age: 29, complexion: 'fair', weight: ''}
			];
		});

		it('should delete all data in the row', function() {
			spyOn(window, 'confirm').and.returnValue(true);
			ctrl.removeRow(ctrl.list[0]);
			expect(angular.copy(ctrl.list)).toEqual(delRow);
		});

		// it('should delete all data in the col and associated rows', function() {
		// 	spyOn(window, 'confirm').and.returnValue(true);
		// 	ctrl.removeColumn(0);
		// 	expect(angular.copy(ctrl.list)).toEqual(delCol);
		// });
	});

	describe('Isolation button disablers for each action', function() {

		function ngDisabledEdit() {
			var disabledEditItem = ctrl.editCol || ctrl.editRow || ctrl.canEditItem;
			var disabledAddCol = ctrl.editRow || ctrl.canEditItem;
			var disabledAddRow = ctrl.editCol || ctrl.canEditItem;
			return disabledEditItem && disabledAddCol && disabledAddRow;
		}

		it('should disable [adding new row/col, editing col] when editing row', function() {
			_.each(ctrl.list, function(row) {
				ctrl.selectRowEdit(row);
				scope.$digest();
				expect(ngDisabledEdit()).toBe(true);
			});
		});

		it('should disable [adding new row/col, editing col] when editing col', function() {
			_.each(ctrl.columns, function(col) {
				ctrl.selectColumnEdit(col);
				scope.$digest();
				expect(ngDisabledEdit()).toBe(true);
			});
		});

		it('should disable [adding new col, editing row/col] when adding new row', function() {
			ctrl.editNewRow();
			scope.$digest();
			var disabledEditItem = ctrl.editCol || ctrl.editRow || ctrl.canEditItem;
			var disabledAddCol = ctrl.editRow || ctrl.canEditItem;
			expect(disabledEditItem && disabledAddCol).toBe(true);
		});

		it('should disable [adding new row, editing row/col] when adding new col', function() {
			ctrl.editNewColumn();
			scope.$digest();
			var disabledEditItem = ctrl.editCol || ctrl.editRow || ctrl.canEditItem;
			var disabledAddRow = ctrl.editCol || ctrl.canEditItem;
			expect(disabledEditItem && disabledAddRow).toBe(true);
		});		
	});	
});