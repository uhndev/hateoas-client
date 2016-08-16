exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test-spec.js'],
  params: {
    url: 'http://localhost:8080',
    username: 'admin',
    password: 'admin1234'
  }
};
