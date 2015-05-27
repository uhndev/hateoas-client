(function() {
	'use strict';

	_.mixin({
		'parseUrl': parseUrl,
		'pathnameToArray': pathnameToArray,
		'convertRestUrl': convertRestUrl,
		'inArray': inArray
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

	function inArray(arr, item) {
		return (_.indexOf(arr, item) !== -1);
	}

})();