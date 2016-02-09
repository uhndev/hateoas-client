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
          sails.url = "<development_url>";
          sails.useCORSRouteToGetCookie = false;
        }
      });
    }
  });
})(SAILSMODULE);
