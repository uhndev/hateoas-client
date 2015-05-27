(function() {
	'use strict';

	angular.module('dados.study.collectioncentres', [
		'dados.study.service',
		'dados.common.directives.selectLoader'
	])
	.controller('CentreController', CentreController);

	CentreController.$inject = [
		'$scope', '$resource', '$location', 
    'StudyService', 'toastr', 'API'
  ];

	function CentreController($scope, $resource, $location, Study, toastr, API) {
		var vm = this;
		// bindable variables
    vm.allow = '';
    vm.template = {};
    vm.resource = {};
    vm.studyInfo = {};
    vm.collectionCentres = {};
    vm.savedData = {};
    vm.url = API.url() + $location.path();    

    // bindable methods
    vm.addCentre = addCentre;
    vm.cancelAdd = cancelAdd;
    vm.saveChanges = saveChanges;
    vm.revertChanges = revertChanges;

    init();

    ///////////////////////////////////////////////////////////////////////////
    
    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function(data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.resource = angular.copy(data);

        vm.collectionCentres = {
          tableData: data.items.collectionCentres || [],
          columns: [
            { title: 'Collection Centres', field: 'name', type: 'text' },
            { title: 'Contact', field: 'contact', type: 'multi' }
          ]
        };
        
        vm.savedData = angular.copy(vm.collectionCentres);
      });
    }

		function addCentre() {
      vm.collectionCentres.tableData.push({name:'', contact:[]});
      vm.addingNew = true;
    }

    function cancelAdd() {
      if (vm.addingNew) {
        vm.collectionCentres.tableData.pop();
        vm.addingNew = false;
      }      
    }

    function saveChanges() {
      angular.copy(vm.collectionCentres, vm.savedData);
      var study = new Study({ 'collectionCentres': vm.collectionCentres.tableData });
      vm.addingNew = false;
      study.$update({ id: vm.resource.items.id }).then(function (data) {
        toastr.success('Updated collection centres successfully!', 'Collection Centre');
      }).catch(function (err) {
        toastr.error(err, 'Collection Centre');
      });
    }

    function revertChanges() {
      angular.copy(vm.savedData, vm.collectionCentres);
      vm.addingNew = false;
    }    
	}
})();