// Authentication service for user variables
angular.module('dados.common.services.authentication', [])

.factory('Authentication', [
    function() {
        var _this = this;

        _this._data = {
            currentUser: window.currentUser
        };
        return _this._data;
    }
]);