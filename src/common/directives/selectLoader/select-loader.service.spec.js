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
              "displayName": "Mr. Admin User",
              "username": "admin",
              "email": "admin@example.com",
              "id": 1,
              "prefix": "Mr.",
              "firstname": "Admin",
              "lastname": "User"
            },
            {
              "displayName": "Mr. John Doe",
              "username": "johndoe",
              "email": "johndoe@email.com",
              "id": 2,
              "prefix": "Mr.",
              "firstname": "John",
              "lastname": "Doe"
            },
            {
              "displayName": "Ms. Jane Doe",
              "username": "janedoe",
              "email": "janedoe@email.com",
              "id": 3,
              "prefix": "Ms.",
              "firstname": "Jane",
              "lastname": "Doe"
            },
            {
              "displayName": "Mr. Kevin Chan",
              "username": "khchan",
              "email": "khchan@email.com",
              "id": 4,
              "prefix": "Mr.",
              "firstname": "Kevin",
              "lastname": "Chan"
            }
          ]
        }
    });

    SelectService.loadSelect('http://localhost:1337/api/user').then(function(response) {
      expect(response.data.items.length).toBe(4);
      httpBackend.flush();
    });
  });

  it('should fetch data from cache the second time', function () {
    SelectService.loadSelect('http://localhost:1337/api/user').then(function(response) {
      expect(response.data.items.length).toBe(4);
      httpBackend.flush();
    });
  });

  it('should fetch newest data from if requested', function () {
    httpBackend.whenGET("http://localhost:1337/api/user").respond({
      data: {
        items: [
          {
            "displayName": "Mr. Admin User",
            "username": "admin",
            "email": "admin@example.com",
            "id": 1,
            "prefix": "Mr.",
            "firstname": "Admin",
            "lastname": "User"
          }
        ]
      }
    });
    SelectService.loadSelect('http://localhost:1337/api/user').then(function(response) {
      expect(response.data.items.length).toBe(1);
      httpBackend.flush();
    });
  });
});
