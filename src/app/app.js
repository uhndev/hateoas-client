angular.module( 'dados', [
	'templates-app',
	'templates-common',
	'dados.auth',
	'dados.header',
	'dados.form',
    'dados.answerset',
  	'dados.formbuilder',
	'dados.workflow',
    'dados.person',
    'dados.user',
    'dados.study',
	'dados.error',
    'dados.filters.formatter',
    'dados.filters.type',
	'ui.router',
    'hateoas.queryBuilder',
    'hateoas.allowNav'
	// 'dados.common.services.csrf'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
	$urlRouterProvider.otherwise( '/study' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		if ( angular.isDefined( toState.data.pageTitle ) ) {
			$scope.pageTitle = toState.data.pageTitle;
		}
	});
});

