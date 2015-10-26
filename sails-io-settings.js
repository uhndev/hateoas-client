var SAILSMODULE = (function (){
  var io;
  Object.defineProperty(window, 'io', {
    get: function (){
      return io;
    },
    set: function (value){
      var sails;
      io = value;
      Object.defineProperty(io, 'sails', {
        get: function (){
          return sails;
        },
        set: function (value){
          sails = value;
          sails.url = "http://localhost:1337";
          sails.useCORSRouteToGetCookie = false;
        }
      });
    }
  });
})(SAILSMODULE);
