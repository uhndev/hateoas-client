var ReportingController = function($scope) {
	$scope.data = [];
	$scope.headers = [];
	
	var sanitize = function(cleaner, value) {
		if (angular.isDefined(cleaner) && angular.isFunction(cleaner)) {
			return cleaner(value);
		}
		return value;
	};
	
	$scope.getReport = function(sanitizers) {
		var report = [];
		var arg = sanitizers || {};
		angular.forEach($scope.data, function(item) {
			var record = {};
			angular.forEach($scope.headers, function(header) {
				record[header] = sanitize(arg[header], item[header]);
			});
			report.push(record);
		});
		return report;
	};
};