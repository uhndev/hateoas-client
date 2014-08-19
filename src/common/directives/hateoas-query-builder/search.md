<div ng-app="app">
    <fieldset ng-controller="queryController">
        <legend>Group</legend> <pre>
            {{ query | json }}
        </pre>

        <ul ng-repeat="(property, expression) in query">
            <li ng-if="expression|isString">{{ property }} <i class="condition">
                    is
                </i>
{{ expression | json }}</li>
            <li ng-if="expression|isObject" ng-repeat="(cond, val) in expression">{{ property }} <i> {{ cond }} </i>
 <b ng-if="val|isArray">
                    {{ val.join(' or ') }} 
                </b>
 <b ng-if="!(val|isArray)">
                    {{ val }}
                </b>

            </li>
        </ul>
        <select ng-model="field" ng-options="field as field.prompt for field in fields"></select>
        <select ng-model="comparator" ng-options="criterion for criterion in criteria[field.type]"></select>
        <input type="text" ng-model="value" />
        <button ng-click="add(field.rel, comparator, value)">add</button>
    </fieldset>
</div>
angular.module('app', [])
    .filter('isArray', function () {
    return angular.isArray;
})
    .filter('isObject', function () {
    return angular.isObject;
})
    .filter('isString', function () {
    return angular.isString;
});

function queryController($scope) {
    $scope.fields = [{
        rel: 'name',
        prompt: 'Name',
        type: 'string'
    }, {
        rel: 'age',
        prompt: 'Age',
        type: 'number'
    }];

    $scope.criteria = {
        'string': ['not', 'is', 'contains', 'like', 'startsWith', 'endsWith'],
            'number': ['not', 'equals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual']
    }

    $scope.groupOperators = ['and', 'or'];
    $scope.query = {};
    $scope.field = {};
    $scope.add = function (field, comparator, value) {
        if (/equals|is/i.test(comparator)) {
            $scope.query[field] = value;
        } else {
            var buffer = $scope.query[field];

            if (!angular.isObject(buffer)) {
                buffer = {};
            }
            if (!angular.isArray(buffer[comparator]) && buffer[comparator]) {
                buffer[comparator] = [buffer[comparator]];
            }

            if (angular.isArray(buffer[comparator])) {
                buffer[comparator].push(value);
            } else {
                buffer[comparator] = value;
            }
            $scope.query[field] = buffer;
        }
    }
};
