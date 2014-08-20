angular.module( 'dados', [
	'templates-app',
	'templates-common',
	'dados.auth',
	'dados.header',
	'dados.home',
	'dados.about',
	'dados.forms',
	'dados.formbuilder',
	'dados.workflow',
    'dados.person',
	'dados.error',
    'dados.filters.formatter',
	'ui.router',
    'hateoas.queryBuilder',
    'hateoas.allowNav'
	// 'dados.common.services.csrf'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
	$urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		if ( angular.isDefined( toState.data.pageTitle ) ) {
			$scope.pageTitle = toState.data.pageTitle + ' | dados' ;
		}
	});
});

