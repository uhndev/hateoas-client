describe('altum-client basic tests', function () {
  it('should be able to login and redirect to the client page', function () {
    browser.get(browser.params.url);
    element(by.id('identifier')).sendKeys(browser.params.username);
    element(by.id('password')).sendKeys(browser.params.password);
    element(by.id('submit')).click();
    expect(browser.getCurrentUrl()).toEqual(browser.params.url + '/#/client');
  });

  it('should go to the referral page and find old patient', function () {
    $('a[href="#/referral"]').click();
    element(by.id('hateoas-search-input')).sendKeys('old patient');
    browser.sleep(2000);
    $('.hateoas-row').click();
  });

  it('should go to overview page for old patient', function () {
    element(by.id('open-referral-btn')).click();
    browser.sleep(2000);
    element(by.id('edit-referral-btn')).click();
    browser.sleep(2000);
  });
});
