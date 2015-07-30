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
    'transformHateoas': transformHateoas
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

})();
