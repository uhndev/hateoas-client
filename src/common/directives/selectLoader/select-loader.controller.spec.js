describe('select-loader controller', function() {
	var scope, httpBackend, ctrl, API, SelectService;

	beforeEach(module("dados.common.directives.selectLoader"));

	beforeEach(inject(function(_$rootScope_, _$httpBackend_, _$controller_, _API_, _SelectService_) {
		httpBackend = _$httpBackend_;
		API = _API_;
		SelectService = _SelectService_;
		scope = _$rootScope_.$new();
		createController = function(data) {
			return _$controller_('SelectController', { 
				$scope: scope,
				API: API,
				SelectService: SelectService
			}, data);
		};		
	}));

	describe('atomic select-loaders', function() {
		var data = {
			url: 'user',
			isAtomic: true,
			isDisabled: false,
			values: '',
			labels: 'prefix firstname lastname',
			outputProperties: 'id'
		};

		beforeEach(function() {
			httpBackend.whenGET('http://localhost:1337/api/user').respond({
        items: [
          {
            "username": "admin",
            "email": "admin@example.com",
            "id": "1",
            "prefix": "Mr.",
            "firstname": "Admin",
            "lastname": "User"
          },
          {
            "username": "johndoe",
            "email": "johndoe@email.com",
            "id": "2",
            "prefix": "Mr.",
            "firstname": "John",
            "lastname": "Doe"
          },
          {
            "username": "janedoe",
            "email": "janedoe@email.com",
            "id": "3",
            "prefix": "Ms.",
            "firstname": "Jane",
            "lastname": "Doe"
          },
          {
            "username": "khchan",
            "email": "khchan@email.com",
            "id": "4",
            "prefix": "Mr.",
            "firstname": "Kevin",
            "lastname": "Chan"
          }
        ]
    	});
		});

		it('should fetch data on initial load and save to vm.input', function() {
			ctrl = createController(data);
			scope.vm = ctrl;
			scope.$digest();
			httpBackend.flush();
			expect(ctrl.input.length).toBe(4);			
		});

		it('should extract id to vm.values for atomic select-loaders', function() {
			ctrl = createController(data);
			scope.vm = ctrl;
			ctrl.output = [{ 'id': "2" }]; 
			ctrl.setValues();
			scope.$digest();			
			httpBackend.flush();
			expect(ctrl.values).toEqual("2");
		});

		it('should load atomic id and set vm.input ticked value', function() {
			data.values = "2";
			ctrl = createController(data);
			scope.vm = ctrl;
			scope.$digest();
			httpBackend.flush();
			expect(ctrl.input[1].ticked).toBe(true);
		});		
	});

	describe('non-atomic select-loaders', function() {
		var data = {
			url: 'user',
			isAtomic: false,
			isDisabled: false,
			values: [],
			labels: 'prefix firstname lastname',
			outputProperties: 'id'
		};

		beforeEach(function() {
			httpBackend.whenGET('http://localhost:1337/api/user').respond({
        items: [
          {
            "username": "admin",
            "email": "admin@example.com",
            "id": "1",
            "prefix": "Mr.",
            "firstname": "Admin",
            "lastname": "User"
          },
          {
            "username": "johndoe",
            "email": "johndoe@email.com",
            "id": "2",
            "prefix": "Mr.",
            "firstname": "John",
            "lastname": "Doe"
          },
          {
            "username": "janedoe",
            "email": "janedoe@email.com",
            "id": "3",
            "prefix": "Ms.",
            "firstname": "Jane",
            "lastname": "Doe"
          },
          {
            "username": "khchan",
            "email": "khchan@email.com",
            "id": "4",
            "prefix": "Mr.",
            "firstname": "Kevin",
            "lastname": "Chan"
          }
        ]
    	});
		});
		
		it('should extract array of ids to vm.values for non-atomic select-loaders', function() {
			ctrl = createController(data);
			scope.vm = ctrl;
			ctrl.output = [{ 'id': "2" }, { 'id': "3" }]; 
			ctrl.setValues();
			scope.$digest();
			httpBackend.flush();
			expect(ctrl.values).toEqual(["2", "3"]);
		});

		it('should load array of ids and set vm.input ticked values', function() {
			data.values = ["2", "3"];
			ctrl = createController(data);
			scope.vm = ctrl;
			scope.$digest();
			httpBackend.flush();
			expect(ctrl.input[1].ticked).toBe(true);
			expect(ctrl.input[2].ticked).toBe(true);
		});
	});
});