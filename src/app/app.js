angular.module( 'dados', [
  'config',
	'templates-app',
	'templates-common',
	'dados.auth',
	'dados.header',
  'dados.workflow',
  'dados.formbuilder',
	'dados.error',
    'dados.filters.formatter',
    'dados.filters.type',
	'ui.router',
    'hateoas',
    'hateoas.queryBuilder',
    'hateoas.allowNav'
	// 'dados.common.services.csrf'
])

.config( function myAppConfig ( $urlRouterProvider ) {
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

