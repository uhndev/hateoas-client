var PluginCreator = angular.module('PluginCreator',
		['ngResource', 'ui.bootstrap', 'ui.slider', 
		 'ui.dados.uiSortable', 
		 'ui.dados.uiHelp',
		 'ui.dados.ngCapitalize',
		 'ui.dados.uiWidget',
		 'ui.dados.editors.list',
		 'ui.dados.editors.plugin',
		 'ui.dados.editors.expression',
		 'ui.dados.legacyList',
		 'ui.dados.calculation',
		 'ui.dados.subform',
		 'data.dados.form']);

var WidgetService = function() {
	var widgetResource = {
		label: "",
		template: "",
		name: "",
		index: -1,
		css: {},
		properties: {}
	};
	
	return {
		getWidget: function() {
			return widgetResource;
		}
	};
};

var ListService = function($resource) {
	return $resource('../rest/lists/:id', 
				{id : '@id'},
				{
					update : {method : 'PUT'}
				});
};

var rootScope = function($http, $rootScope, datepickerPopupConfig) {
	$rootScope.unsorted = function(obj){
		if (!obj) {
			return [];
		}
		return Object.keys(obj);
	};
	
	datepickerPopupConfig.appendToBody = true;
};

PluginCreator
	.run(['$http', '$rootScope', 'datepickerPopupConfig', rootScope])
	.config(['$tooltipProvider', 
     function($tooltipProvider) {
		$tooltipProvider.options({
			popupDelay: 500,
			appendToBody : true
		});
	}])
	.factory('ListResource', ['$resource', ListService])
	.controller('PluginController', ['$scope', '$location', 'FormResource', 
	                                 'LegacyResource', 
	                                 'StudyResource', 'EncounterResource',
	                                 PluginController])
	.controller('MetaDataController', ['$scope', MetaDataController])
	.controller('WidgetController', ['$scope', '$modal', WidgetController])
	.controller('LayoutController', ['$scope', '$modal', LayoutController]);