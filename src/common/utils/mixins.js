/**
 * Lodash utility mixins
 *
 * @module      utils/mixins
 * @description A set of utility functions extending the Lodash library to be used on the client side.
 */

(function() {
	'use strict';

	_.mixin({
		'parseUrl': parseUrl,
		'pathnameToArray': pathnameToArray,
		'convertRestUrl': convertRestUrl,
		'getStudyFromUrl': getStudyFromUrl,
		'inArray': inArray,
		'isUrl': isUrl,
    'isJson': isJson,
		'sum': sum,
		'capitalizeFirst': capitalizeFirst,
		'objToPair': objToPair,
    'transformHateoas': transformHateoas,
    'pad': pad,
    'userObjToName': userObjToName,
    'equalsDeep': equalsDeep,
    'findArrayDiff': findArrayDiff
	});

	function parseUrl(location, url) {
    var baseLen = location.absUrl().length - location.url().length;
    return pathnameToArray(url.substring(baseLen));
	}

	function pathnameToArray(pathname) {
		return pathname.split('/').slice(1);
	}

	function convertRestUrl(restURL, prefix) {
		var index = restURL.indexOf(prefix) + prefix.length;
    return restURL.substring(index);
	}

	function getStudyFromUrl(pathname) {
		var arr = pathnameToArray(pathname);
		if (arr.length >= 2) {
			return arr[1];
		}
		return false;
	}

	function inArray(arr, item) {
		return (_.indexOf(arr, item) !== -1);
	}

	function isUrl(s) {
  	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  	return regexp.test(s);
	}

  function isJson(data) {
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return true;
  }

	function sum(arr) {
		return _.reduce(arr, function(sum, num) { return sum + num; }, 0);
	}

	function capitalizeFirst(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function objToPair(obj) {
    return _.map(_.keys(obj), function (k) {
      return {
        name: k,
        value: obj[k]
      };
    });
	}

  function transformHateoas(data) {
    if (isJson(data)) {
      var jsonData = angular.fromJson(data);
      if (jsonData.hasOwnProperty('items')) {
        return jsonData.items;
      }
      return jsonData;
    } else {
      return data;
    }
  }

  function pad(input, width, padding) {
    padding = padding || '0';
    input = input + '';

    return (input.length >= width ?
      input :
    new Array(width - input.length + 1)
      .join(padding) + input);
  }

  function userObjToName(userObj) {
    return [userObj.prefix, userObj.firstname, userObj.lastname].join(' ');
  }

  /**
   * equalsDeep
   * @description  A deep object comparison function to detect deep object changes
   *              (e.g. question properties on a form).
   *              Performs recursive search and test until first inconsistency.
   * @param {} first
   * @param {} second
   * @return {boolean} True if values are equal, False otherwise
   */
  function equalsDeep(first, second) {
    var result = true;
    if (angular.isObject(first) && angular.isObject(second)) {
      if (_.size(first) == _.size(second)) {
        _.forIn(first, function(value, key) {
          if (angular.isDefined(second[key])) {
            result = equalsDeep(value, second[key]);
            if (!result) {
              return false;
            }
          } else {
            return false;
          }
        });
      } else {
        return false;
      }
    } else if (first !== second) {
      return false;
    }
    return result;
  }

  /**
   * findArrayDiff
   * @description Takes two arrays and returns an object with add/remove keys to dictate what's changed
   * @param current    Current array to check
   * @param prev       Previous version of array
   * @returns {Object}
   */
  function findArrayDiff(current, prev) {
    var diff = _.xor(current, prev);
    var result = {
      'toAdd': [],
      'toRemove': []
    };
    if (diff.length === 0) {
      return result;
    } else {
      _.each(diff, function (element) {
        if (_.contains(current, element)) {
          result.toAdd.push(element);
        } else {
          result.toRemove.push(element);
        }
      });
      return result;
    }
  }

})();
