describe('Progressbar directive', function() {
  var element;
  var $scope;

  beforeEach(module('dados.common.directives.progressbar'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $scope = _$rootScope_;

    element = angular.element('<uib-progressbar value="value">{{value}}%</uib-progressbar>');

    _$compile_(element)(_$rootScope_);

  }));

  it('Given N forms when next question requests > N forms and previous question request is submitted it should update completion indicator accordingly', function() {

    $scope.$broadcast('IndicatorsSum', 4);

    function testNextIndicator(test) {
      var i = 0;
      while (i <= 10) {
        $scope.$broadcast('NextIndicator');
        $scope.$digest();
        i++;
      }
      test();
    }

    function testPrevIndicator(test) {
      $scope.$broadcast('PrevIndicator');
      $scope.$digest();
      test();
    }
    testNextIndicator(function() {
      expect(element.html()).toBe('100%');
    });

    testPrevIndicator(function() {
      expect(element.html()).toBe('75%');
    });
  });

  it('Given N forms when next question request it should update completion indicator', function() {
    $scope.$broadcast('IndicatorsSum', 4);
    $scope.$broadcast('NextIndicator');
    $scope.$digest();
    expect(element.html()).toBe('25%');
    $scope.$broadcast('NextIndicator');
    $scope.$digest();
    expect(element.html()).toBe('50%');
    $scope.$broadcast('NextIndicator');
    $scope.$digest();
    expect(element.html()).toBe('75%');
    $scope.$broadcast('NextIndicator');
    $scope.$digest();
    expect(element.html()).toBe('100%');
  });

  it('Given N forms when previous question request it should update completion indicator', function() {
    $scope.$broadcast('IndicatorsSum', 4);
    $scope.$broadcast('NextIndicator');
    $scope.$digest();
    expect(element.html()).toBe('25%');
    $scope.$broadcast('NextIndicator');
    $scope.$digest();
    expect(element.html()).toBe('50%');
    $scope.$broadcast('NextIndicator');
    $scope.$digest();
    expect(element.html()).toBe('75%');
    $scope.$broadcast('NextIndicator');
    $scope.$digest();
    expect(element.html()).toBe('100%');
    $scope.$broadcast('PrevIndicator');
    $scope.$digest();
    expect(element.html()).toBe('75%');
    $scope.$broadcast('PrevIndicator');
    $scope.$digest();
    expect(element.html()).toBe('50%');
    $scope.$broadcast('PrevIndicator');
    $scope.$digest();
    expect(element.html()).toBe('25%');
    $scope.$broadcast('PrevIndicator');
    $scope.$digest();
    expect(element.html()).toBe('0%');
  });
});
