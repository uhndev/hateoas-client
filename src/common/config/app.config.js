(function(){
'use strict';
angular.module('dados.common.config', [])

.constant('BASE', {protocol:'http',host:'localhost',port:'1337',prefix:'/api'})

;})();