/******************************************************************************
 * funtion: guid
 * 
 * Generates a unique ID for an element. This is required to prevent conflicts
 * when the user names their elements.
 * 
 * @param length
 * @returns
 ******************************************************************************/
function guid(length) {
	length = Math.floor(length / 2);
    return Math.random().toString(36).substring(2, length + 2) +
        Math.random().toString(36).substring(2, length + 2);
}

/******************************************************************************
 * method: stopBubble
 * Universal method to stop event bubbling.
 ******************************************************************************/
var stopBubble = function(e) {
	if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.cancelBubble = true;
  e.returnValue = false;
};

/******************************************************************************
 * Cache variable to store the test data.
 ******************************************************************************/
var ipsum = null;

/******************************************************************************
 * Given a form of questions, this generates random data for each question.
 * @param questions
 * @param filler
 ******************************************************************************/
function generateData(questions, filler) {
	angular.forEach(questions, function(question) {
		if (Math.random() > 0.1) {
			if (question.template.match(/text|textarea/i)) {
				if (filler) {
					question.answer.value = filler[Math.floor(Math.random()*filler.length)];
				} else {
					question.answer.value = Math.random().toString(36).slice(2);
				}
			}
			
			if (question.template.match(/email/i)) {
				question.answer.value = "dummy.email@test.com";
			}
			
			if (question.template.match(/telephone/i)) {
				question.answer.value = Math.floor(Math.random()*1000) + '-' + Math.floor(Math.random()*10000);
			}
			
			if (question.template.match(/radio|select/i)) {
				var index = Math.floor(Math.random() * question.properties.options.length);
				question.answer.value = question.properties.options[index].value;
			}
			
			if (question.template.match(/datalist/i)) {
				var idx = Math.floor(Math.random() * question.properties.options.length);
				question.answer.value = question.properties.options[idx].name;
			}
			
			if (question.template.match(/number|range/i)) {
				var max = (question.properties.max ? question.properties.max : 10000);
				var min = (question.properties.min ? question.properties.min : 0);
				var range = max - min;
				var val = Math.floor(Math.random() * range) + min;
				question.answer.value = val;
			}
			
			if (question.template.match(/date|time/i)) {
				var today = new Date();
		        var from = new Date(today.getFullYear() - Math.floor(Math.random() * 10), 0, 1).getTime();
		        var to = new Date(today.getFullYear() + Math.floor(Math.random() * 10), 0, 1).getTime();
			    question.answer.value = new Date(from + Math.random() * (to - from));
			}
			
			if (question.template.match(/checkbox/i)) {
				var options = question.properties.options;
				var result = [];
				var value;
				for (var i = 0, k = options.length; i < k; i++) {
					if (Math.random() < 0.5) {
						value = null;
					} else {
						value = options[i].value;
					}
					result.push(value);
				}
				question.answer.value = angular.copy(result);
			}
		}
	});
}

/*****************************************************************************
 * method: randomData
 * 
 * Test data generation method. Creates random data for a form entity. It uses
 * the baconipsum API to create random text data.
 * 
 * @param questions
 * @param $http
 * @param callback
 ******************************************************************************/
function randomData(questions, $http, callback) {
	if ($http) {
		if (angular.isArray(ipsum)) {
			generateData(questions, ipsum);
			callback();
		} else {
			$http.get('https://baconipsum.com/api/?type=all-meat&paras=20')
				.success(function(response) {
					ipsum = response;
					generateData(questions, response); 
				})
				.then(callback);
		}
	} else {
		generateData(questions);
		callback();
	}
}

/******************************************************************************
 * function: captialize
 * Capitalizes the first letter in a string.
 ******************************************************************************/
var capitalize = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

/******************************************************************************
 * function: deferIfPromise
 * Executes a callback if the response is not a $promise, otherwise, defers the
 * callback until the $promise is resolved.
 ******************************************************************************/
function deferIfPromise(response, fn1, fn2) {
	if (_.isUndefined(response.then)) {
		fn1();
	} else {
		if (_.isFunction(fn2)) {
			response.then(fn2);
		} else {
			response.then(fn1);
		}
	}
}

/******************************************************************************
 * function: isEmpty
 * Checks if a value is empty.
 ******************************************************************************/
function isEmpty(value) {
	if (_.isArray(value)) {
		value = value.join('');
	} 
	return !!value && value.length === 0;
}

function debounceWatch($timeout, callback, delay) {
	var timeout;
	
	return function(newValue, oldValue) {
		if (angular.isDefined(newValue) && newValue !== oldValue) {
			if (angular.isDefined(timeout)) {
				$timeout.cancel(timeout);
			}
			timeout = $timeout(function() {
				callback.call(null, newValue, oldValue);
			}, delay);
		}
	};
}


/******************************************************************************
 * function: omit
 * Angular version of the omit function. This will allow removal of nested 
 * properties from objects. Handy for stripping the 'id's from objects. This
 * method is immutable.
 * @param collection - {Object|Array}
 * @param property   - {String}
 * @param thisArg    - {Object}
 * @param isDeep     - {Boolean} - attempt a nested omit
 ******************************************************************************/
function omit(collection, property, thisArg, isDeep) {
    var clone = angular.copy(collection);
    thisArg = thisArg || clone;
    isDeep = isDeep || false;
    
    angular.forEach(clone, function(item, key, context) {
        if (key === property) {
            delete clone[key];
        }
        if (isDeep) {
            if (angular.isObject(item)) {
                clone[key] = omit(item, property, context, isDeep);
            }
        }
    }, thisArg);
    
    return clone;
}
