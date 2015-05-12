/******************************************************************************
 * # Meta Data Controller #
 * 
 * TODO: Change the Meta Data Controller to a key-value pair directive. This
 *       would make for a more reusable and generalised interface.
 * 
 * Controller used to set the meta data for an entity. The entity must must have
 * a Meta Data service available. This service is then passed into the controller
 * as a means of applying these meta data values to the entity.
 * 
 * Meta data is used to provide extra information for an entity. In particular,
 * the meta data provides a means of defining relationships between entities.
 *****************************************************************************/
var MetaDataController = function($scope) {
	$scope.metaData = {};
	$scope.entry = {};
	$scope.editKey = undefined;
	
	$scope.$on('setMetaData', function(e, list) {
		$scope.metaData = list;
	});
	
	$scope.clear = function() {
		$scope.entry = {};
		$scope.editKey = undefined;
	};
	
	$scope.cancel = function() {
		$scope.clear();
	};
	
	$scope.edit = function(key) {
		$scope.editKey = key;
		$scope.entry.key = key;
		$scope.entry.value = $scope.metaData[key];
	};
	
	$scope.update = function(key, value) {
		if ($scope.editKey) {
			delete $scope.metaData[$scope.editKey];
			$scope.add();
		}
	};
	
	$scope.add = function() {
		$scope.metaData[$scope.entry.key] = $scope.entry.value;
		$scope.clear();
	};
	
	$scope.remove = function(key) {
		var toDelete = confirm("Are you sure you want to remove this entry?");
		if (toDelete) {
			delete $scope.metaData[key];
		}
	};
	
	/* Notify observers */
	$scope.$emit('metaDataControllerLoaded');
};