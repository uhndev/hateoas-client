describe('WorkflowController', function() {

  beforeEach( module('dados.workflow.controller') );

  describe('DEFAULT_LINK', function() {
    var linkConstant;

    beforeEach( inject( function( $injector ) {
      linkConstant = $injector.get('DEFAULT_LINK');
    }));

    it('exists', function() {
      expect(linkConstant).toBeTruthy();
    });
  
    it('should represent a link object', function() {
      expect(_.isString(linkConstant.path)).toBeTruthy();
      expect(_.isArray(linkConstant.links)).toBeTruthy();
      expect(_.isArray(linkConstant.queries)).toBeTruthy();
      expect(_.isArray(linkConstant.template)).not.toBeTruthy();
      expect(_.isObject(linkConstant.template)).toBeTruthy();
    });

    it('should be a constant', inject(function($injector) {
      var value = $injector.get('DEFAULT_LINK');
      value = null;
      expect($injector.get('DEFAULT_LINK')).not.toEqual(value);
      expect($injector.get('DEFAULT_LINK')).not.toBe(value);
    }));
  });

  describe('WorkflowController', function() {
    var controllerFactory, scope, filter, defaultLink, mockApi ;

    function createController() {
      return controllerFactory('WorkflowController', {
        $scope: scope,
        $filter: filter,
        DEFAULT_LINK: defaultLink,
        Workflow: mockApi
      });
    }

    beforeEach(inject(
      function($controller, _$filter_, $rootScope, $injector) {
        filter = _$filter_;
        scope = $rootScope.$new();
        defaultLink = $injector.get('DEFAULT_LINK');
        controllerFactory = $controller;
    }));

    beforeEach(function() {
      mockApi = {
        query: function() {
          return [];
        }
      };
    });

    it('should exist', function() {
      var controller = createController();
      expect(controller).toBeTruthy();
    });

    it('should contain a default state', function() {
      createController();
      expect(_.isObject(scope)).toBeTruthy();
      expect(scope.state.source).toEqual(null);
      expect(scope.state.data).toEqual(defaultLink);
      expect(scope.state.string).toEqual(filter('json')(defaultLink));
    });

    it('should update data when source path is updated', function() {
      createController();
      scope.state.source = {
        "path" : "/api/test",
        "rel" : "self"
      };
      scope.$apply();
      expect(scope.state.data).toEqual(scope.state.source);
    });

    it('should set data to default when path is empty', function() {
      createController();
      scope.state.source = {
        "path" : "/api/test",
        "rel" : "self"
      };
      scope.$apply();
      expect(scope.state.data).toEqual(scope.state.source);
      delete scope.state.source.path;
      scope.$apply();
      expect(scope.state.data).toEqual(defaultLink);
    });

    it('should update state.string when state.data changes', function() {
      createController();
      scope.state.data = {
        "rel": "self"
      };
      scope.$apply();
      expect(scope.state.data).toEqual(JSON.parse(scope.state.string));
    });

    it('should update state.data when state.string changes', function() {
      createController();
      scope.state.string = '{ "rel": "self" }';
      scope.$apply();
      expect(JSON.parse(scope.state.string)).toEqual(scope.state.data);
    });

    it('should toggle wellFormed when state.string changes', function() {
      createController();
      scope.state.string = '{ "rel": "self" }';
      scope.$apply();
      expect(scope.wellFormed).toBeTruthy();
      scope.state.string = '{ "rel": "self" ';
      scope.$apply();
      expect(scope.wellFormed).not.toBeTruthy();
    });

  });

});
