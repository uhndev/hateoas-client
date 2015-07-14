describe("select-loader data service", function () {
  var SelectService, httpBackend;

  beforeEach(module("dados.common.directives.selectLoader"));

  beforeEach(inject(function (_SelectService_, $httpBackend) {
    SelectService = _SelectService_;
    httpBackend = $httpBackend;
  }));

  it('should be defined', function() {
    expect(!!SelectService).toBe(true);
    return true;
  });

  it('should fetch data from url and save data to cache', function () {
    httpBackend.whenGET("http://localhost:1337/api/user").respond({
        data: {
          items: [
            {
              "username": "admin",
              "email": "admin@example.com",
              "id": "55649d21d0602c972781b4ff",
              "prefix": "Mr.",
              "firstname": "Admin",
              "lastname": "User"
            },
            {
              "username": "johndoe",
              "email": "johndoe@email.com",
              "id": "55649d44d0602c972781b54f",
              "prefix": "Mr.",
              "firstname": "John",
              "lastname": "Doe"
            },
            {
              "username": "janedoe",
              "email": "janedoe@email.com",
              "id": "55649d64d0602c972781b555",
              "prefix": "Ms.",
              "firstname": "Jane",
              "lastname": "Doe"
            },
            {
              "username": "khchan",
              "email": "khchan@email.com",
              "id": "55649d76d0602c972781b559",
              "prefix": "Mr.",
              "firstname": "Kevin",
              "lastname": "Chan"
            }
          ]
        }
    });
    
    SelectService.loadSelect('http://localhost:1337/api/user', false).then(function(response) {
      expect(response.data.items.length).toBe(4);
      httpBackend.flush();
    });    
  });

  it('should fetch data from cache the second time', function () {
    SelectService.loadSelect('http://localhost:1337/api/user', false).then(function(response) {
      expect(response.data.items.length).toBe(4);
      httpBackend.flush();
    });
  });

  it('should fetch newest data from if requested', function () {
    httpBackend.whenGET("http://localhost:1337/api/user").respond({
        data: {
          items: [
            {
              "username": "admin",
              "email": "admin@example.com",
              "id": "55649d21d0602c972781b4ff",
              "prefix": "Mr.",
              "firstname": "Admin",
              "lastname": "User"
            }
          ]
        }
    });    
    SelectService.loadSelect('http://localhost:1337/api/user', true).then(function(response) {
      expect(response.data.items.length).toBe(1);
      httpBackend.flush();
    });
  });
});