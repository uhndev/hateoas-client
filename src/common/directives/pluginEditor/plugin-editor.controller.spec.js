describe('Controller: PluginController Tests', function() {

  var scope, pluginctrl, httpBackend, $scope, $location, $timeout, FormService, StudyFormService, AuthService, FormVersionService, toastr, $cookies, API;

  var question_hidden = {
    'label':'question_hidden',
    'template':'textlabel',
    'properties':
    {'type':'hidden',
      'title':'question','defaultValue':{}},
    'css':
    {'width':'100%'},
    'answer':{},
    'isDeleted':false,
    'name':'hidden_question'
  };

  var question_fieldName_NotUnique = {
    'label':'question_hidden',
    'template':'textlabel',
    'properties':
    {'type':'hidden',
      'title':'question','defaultValue':{}},
    'css':
    {'width':'100%'},
    'answer':{},
    'isDeleted':false,
    'name':'hidden_question'
  };

  var question_fieldname_NotDefined = {
    'label':'fieldName_NotDefined',
    'template':'textlabel',
    'properties':
    {'type':'hidden',
      'title':'question',
      'defaultValue':{}},
    'css':{
      'width':'100%'},
    'answer':{},'isDeleted':false,
    'name':''
  };

  var form_dummy = {
    name: '',
    questions:
      [{'label':'no name',
        'template':'text',
        'properties':
        {'type':'text',
          'maxlength':256,
          'title':'no name',
          'defaultValue':{}},
        'css':
        {'width':'100%'},
        'answer':{},
        'isDeleted':false,
        'name':'no_name'},
        {'label':'Number',
          'template':'number',
          'properties':{'type':'number',
            'step':1,'title':'number name '},
          'css':
        {'width':'100%'},
          'answer':{},
          'isDeleted':false,
          'name':'number_name'}],
    metaData: {}
  };

  beforeEach(function() {
    module('dados.common.directives.pluginEditor','dados.common.directives.pluginEditor.formService','dados.study.service','dados.auth.service', 'toastr', 'dados.common.directives.selectLoader.service');
  });

  beforeEach(inject(function($injector, _$controller_, _$httpBackend_, $location, $timeout, _$rootScope_, _FormService_, _StudyFormService_, _AuthService_, _FormVersionService_, toastr) {
    scope = _$rootScope_.$new();
    $cookies = $injector.get('$cookies');
    httpBackend = _$httpBackend_;
    $location = $injector.get('$location');
    $timeout = $injector.get('$timeout');
    FormService = _FormService_;
    StudyFormService = _StudyFormService_;
    AuthService = _AuthService_;
    FormVersionService = _FormVersionService_;
    API = $injector.get('API');
    pluginctrl = _$controller_('PluginController', {$scope: scope, $location: $location, $timeout: $timeout, FormService: FormService, StudyFormService: StudyFormService, FormVersionService: FormVersionService, AuthService: AuthService});
    scope.vm = pluginctrl;
    scope.form = form_dummy;
  }));

  describe('Basic unit tests for creating and modifying forms builder', function() {
    it('then should at least be defined', function() {
      expect(pluginctrl).toBeDefined();
    });});

  describe('Given all variables name are set, When you save form without name', function() {
    it('then should not save', function () {
      spyOn(FormService,'save');
      scope.commitChanges();
      expect(FormService.save).not.toHaveBeenCalled();
      expect(scope.isFormValid(true)).toBe(false);
    });
  });

  describe('Given all variables name are set, when you save form with name', function() {
    it('then should save', function () {
      spyOn(FormService,'save');
      scope.form.name = 'TEST';
      scope.commitChanges();
      expect(FormService.save).toHaveBeenCalled();
      expect(scope.isFormValid(true)).toBe(true);

    });
  });

  describe('Given a form name is set and a variable name not set, When you commit changes', function() {
    it('then should not save', function () {
      spyOn(FormService,'save');
      scope.form.questions.push(question_fieldname_NotDefined);
      scope.commitChanges();
      expect(FormService.save).not.toHaveBeenCalled();
      expect(scope.isFormValid(true)).toBe(false);
      scope.form.questions.pop();

    });
  });

  describe('Given all variable name and Form name are set, When a user add a question type to a form', function() {
    it('then should save', function () {
      spyOn(FormService,'save');
      scope.form.questions.push(question_hidden);
      scope.commitChanges();
      expect(FormService.save).toHaveBeenCalled();
      expect(scope.isFormValid(true)).toBe(true);
    });
  });

  describe('Given field names are not unique and Form name is set, When a user add a question', function() {
    it('then should not save', function () {
      spyOn(FormService,'save');
      scope.form.questions.push(question_hidden);
      scope.commitChanges();
      expect(FormService.save).not.toHaveBeenCalled();
      expect(scope.isFormValid(true)).toBe(false);
      var unique = _.uniq(scope.form.questions, 'name');
      expect(unique.length === scope.form.questions.length).toBe(false);
      scope.form.questions.pop();
    });
  });

  describe('Given all variable name and Form name are set, When there is no change to a form', function() {
    it('should not save', function () {
      scope.form.id = 288;
      spyOn(FormService,'save');
      spyOn(FormService,'update');
      scope.commitChanges();
      expect(FormService.save).not.toHaveBeenCalled();
      expect(scope.isFormValid(true)).toBe(true);
      expect(FormService.update).toHaveBeenCalled();
    });
  });
});

