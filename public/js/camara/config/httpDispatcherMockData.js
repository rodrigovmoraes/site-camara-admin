(function() {
"use strict";

   var _jwtExpireInSeconds = 180;
   var _preJWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";
   var _posJWT = "GD7UrfnLk295rwvIrCikbkAKctFFoRCHotLYZwZpdlE";

   var _createFakeJWT = function(dataIn) {
      var _user = {
         username: dataIn.username,
         name: dataIn.name,
         email: dataIn.username + "@serv.com",
         exp:  Date.now() / 1000 + _jwtExpireInSeconds
      }
      return _preJWT + "." + window.btoa(JSON.stringify(_user))  + "." + _posJWT;
   }

   return [
       {path: '/login', method: 'POST', data: function(dataIn) { return { token: _createFakeJWT(dataIn) } } },
       {path: '/req1', method: 'GET', data: function(dataIn) { return {} }},
       {path: '/req2', method: 'GET', data: function(dataIn) { return {} }},
       {path: '/req3', method: 'GET', data: function(dataIn) { return {} }}
   ]

})();
