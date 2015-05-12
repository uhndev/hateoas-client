var FormService = function($resource) {
	return $resource('../rest/subforms/:id',
			{id : '@id', deep : false},
			{
				update : {method : 'PUT'}
			}
	);
};

var FormByMetaDataService = function($resource) {
	return $resource('../rest/subforms/metaData/:key/:value',
			{metaDataName: '@key', metaDataValue: '@value'},
			{
				'get' : {method : 'GET', isArray: true}
			}
	);
};

var LegacyFormService = function($resource) {
	return $resource('../rest/subforms/encounter/:id',
			{ id: '@id' },
			{ 'get' : { method: 'GET' } }
	);
};

angular.module('data.dados.form', ['ngResource'])
  .factory('LegacyResource', ['$resource', LegacyFormService])
  .factory('FormResource', ['$resource', FormService])
  .factory('FormByMetaDataResource', ['$resource', FormByMetaDataService]);