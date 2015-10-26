describe( 'DadosController', function() {
  describe( 'isCurrentUrl', function() {
    var DadosController, $location, $scope;

    beforeEach( module( 'dados' ) );

    beforeEach( inject( function( $controller, _$location_, $rootScope ) {
      $location = _$location_;
      $scope = $rootScope.$new();
      DadosController = $controller( 'DadosController', { $location: $location, $scope: $scope });
    }));

    it( 'should pass a dummy test', inject( function() {
      expect( DadosController ).toBeTruthy();
    }));
  });
});
