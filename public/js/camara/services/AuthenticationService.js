(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('AuthenticationService', AuthenticationService);

   AuthenticationService.$inject = ['$window', '$http', 'settings', 'messages'];
   function AuthenticationService($window, $http, settings, messages) {
      var authenticationService = this;

      authenticationService.savePassword = false;

      var _sessionTimeoutInSeconds = settings.sessionTimeoutInSeconds;
      var _sessionDateExpiration;
      var _tokenName = "camara-site-token";
      var _savePasswordOptionName = "camara-site-savepassword";

      authenticationService.setSessionTimeoutInSeconds = function(sessionTimeoutInSeconds) {
         _sessionTimeoutInSeconds = sessionTimeoutInSeconds;
      }

      authenticationService.saveToken = function (token) {
        $window.localStorage[_tokenName] = token;
      };

      authenticationService.getToken = function () {
        return $window.localStorage[_tokenName];
      };

      authenticationService.isLoggedIn = function() {
         try {
            var token = authenticationService.getToken();

            if(token) {
              var payload = JSON.parse($window.atob(token.split('.')[1]));
              if(payload.exp > Date.now() / 1000) { //check jwt expiration
                 //check session expiration, only if the password hasn't been saved
                 if(!authenticationService.isPasswordSaved()) {
                    return authenticationService._sessionDateExpiration > Date.now() / 1000;
                 } else {
                   return true; //token ok and password saved
                 }
              } else {
                 return false; //token expired
              }
            } else {
              return false; //token doesn´t exist
            }
         }catch(err) {
            console.log(err);
            return false;
         }

      };

      authenticationService.savePassword = function(option) {
         $window.localStorage[_savePasswordOptionName] = option;
      }

      authenticationService.isPasswordSaved = function() {
         if($window.localStorage[_savePasswordOptionName] === 'true') {
            return true;
         }else {
            return false;
         }
      }

      authenticationService.checkAccess = function(role) {
         return $http
                  .get(settings.baseUrlSiteCamaraApi  + '/checkAccess/' + role,
                       { headers: {
                           Authorization: 'Bearer ' + authenticationService.getToken()
                         }
                       }
                  ).then(function(result) {
                     return result.data.ok;
                  }).catch(function(error) {
                     console.log(error);
                     return false;
                  });
      }

      authenticationService.revalidateSession = function() {
         authenticationService._sessionDateExpiration = Date.now() / 1000 + _sessionTimeoutInSeconds;
      };

      authenticationService.currentUser = function() {
        if(authenticationService.isLoggedIn()) {
          var token = authenticationService.getToken();
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          return {
            email : payload.email,
            name : payload.name,
            username : payload.username
          };
        }
      };

      authenticationService.login = function(user, savePassword) {
         //check optional parameters
         if(savePassword === undefined) {
            savePassword = false;
         }
         //guarantee that the user is not logged
         authenticationService.logout();

         return $http.post( settings.baseUrlSiteCamaraApi + '/login',
                            {
                              'username': user.username,
                              'password': user.password
                            }
                           ).then(function(httpResult) {
                              authenticationService.saveToken(httpResult.data.token);
                              authenticationService.revalidateSession();
                              authenticationService.savePassword(savePassword);

                              return httpResult.data;
                           }).catch(function(error) {
                              console.log("Error while processing login, error = [" + JSON.stringify(error.data) + "]");
                              if(!error.data || !error.data.message) {
                                 //network error
                                 error.message = messages.serverCommunicationError;
                              } else {
                                 if(error.status == 401) {
                                    error.message = messages.login.invalidCredentials;
                                 } else {
                                    error.message = error.data.message;
                                 }
                              }
                              throw error;
                           });
      };

      authenticationService.logout = function() {
         $window.localStorage.removeItem(_tokenName);
         $window.localStorage.removeItem(_savePasswordOptionName);
         authenticationService._sessionDateExpiration = undefined;
      };

   }

})();
