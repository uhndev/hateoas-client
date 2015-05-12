angular.module('dados.forms', ['ngResource'])
  .constant('FORM_API', '../../rest/subforms/:id?deep=true')
  .service('FormLoaderService', ['$resource', 'FORM_API', 
    function($resource, FORM_API) {
	  return $resource(FORM_API, 
				{id : '@id'},
				{ 'query': {method:'GET', isArray: true} } );
    }])
  .controller('FormLoaderController', ['$scope', 'FormLoaderService', 
    function($scope, FormsService) {
	  $scope.forms = FormsService.query();
	  
	  /**
	   * Converts a string to an id object
	   */
	  function idToIdObject(input) {
		  if (_.isString(input)) {
			  return { id: parseInt(input, 10) };
		  }
		  
		  return { id: input };
	  }
	  
	  /**
	   * Predicate to check if a question is a form.
	   */
	  function isSubformQuestion(question) {
		  return /form/i.test(question.template);
	  }
	  
	  /**
	   * Loads all child forms in a form.
	   */
	  function exportChildForms(form) {
		  try {
			  var children = JSON.parse(form.metaData.children);
        return _.chain(children)
                .map(fetchForm)
                .value();
		  } catch(e) {
			  return [];
		  }
	  }
	  
	  /**
	   * Loads all embedded forms in a form.
	   */
	  function exportSubForms(form) {
		  return _.chain(form.questions)
		          .filter(isSubformQuestion)
		          .pluck('properties')
		  		  .pluck('idForm')
		          .map(fetchForm)
		          .value();
	  }
	  
	  /**
	   * Loads all child forms and embedded forms for a single form.
	   */
	  function exportForm(form) {
		  if (form) {
			  if (_.has(form.metaData, 'children')) {
				  form._children = exportChildForms(form);
			  }
			  form._embedded = exportSubForms(form);
		  }
		  
		  return form;
	  }
	  
	  /**
	   * Loads a form
	   */
	  function fetchForm(id) {
		  if (id) {
			  return FormsService.get(idToIdObject(id), exportForm);
		  }
		  return null;
	  }
	  
	  function omitDeep(collection, property, thisArg) {
		    var clone = _.cloneDeep(collection);
		    thisArg = thisArg || clone;
		    
		    _.each(clone, function(item, key, context) {
		        if (key === property) {
		            delete clone[key];
		        }
	            if (_.isObject(item)) {
	                clone[key] = omitDeep(item, property, context);
	            }
		    }, thisArg);
		    
		    return clone;
      }
	  
	  
	  function importFormCollection(form, type) {
		  _.map(form[type], function(form) {
			 importForm(form);
		  });
	  }
	  
	  function importForm(form) {
		  // Import all embedded items first
		  var embeddedMap = importFormCollection(form, '_embedded');
		  // Import all child forms
		  var childrenMap = importFormCollection(form, '_children');
		  // Fix all the ids for the form with the new ids from the inserts
		  updateQuestions(form, embeddedMap);
		  // Fix all the ids of the child map with the new ids from the inserts
		  updateChildren(form, childrenMap);
		  
		  delete form._embedded;
		  delete form._children;
		  
		  // Insert this form into the database.
		  console.log("Creating " + form.name);
		  insertForm(form);
	  }
	  
	  $scope.import = function(template) {
		  try {
			  template = JSON.parse(template);
			  if (_.has(template, 'version') && _.has(template, 'form')) {
				  importForm(form);
			  }
		  } catch(e) {
			  console.log(e);
		  }
	  };
	  
	  $scope.$watch('selected', function(id) {
		  $scope.form = {
			version: '1.0',
		    form: fetchForm(id)
		  };
	  });
    }])
  .directive('ngSelectText', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {
			element.bind('click', function() {
				$(element).select();
			});
		}
	};
  });