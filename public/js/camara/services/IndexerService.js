(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('IndexerService', IndexerService);

   IndexerService.$inject = [ 'settings', '$q',
                              '$http', 'messages',
                              '$window', 'DigestAuthUtils' ];
   function IndexerService( settings, $q,
                            $http, messages,
                            $window, DigestAuthUtils ) {
      var indexerService = this;
      var _tokenName = "camara-site-indexer-token";
      var _sessionTimeoutInSeconds = settings.Indexer.sessionTimeoutInSeconds;
      var _sessionDateExpiration = undefined;
      var adminUsername = settings.Indexer.adminUsername;
      var adminPassword = settings.Indexer.adminPassword;

      /***********************************************************************
      ************************AUTHENTICATION SERVICES*************************
      ***********************************************************************/
      var _saveToken = function (token) {
        $window.localStorage[_tokenName] = token;
      };

      var _getToken = function () {
        return $window.localStorage[_tokenName];
      };

      var _isLoggedIn = function() {
         try {
            var token = _getToken();

            if(token) {
              var payload = JSON.parse($window.atob(token.split('.')[1]));
              if(payload.exp > Date.now() / 1000) { //check jwt expiration
                 //check session expiration, only if the password hasn't been saved
                 return _sessionDateExpiration > Date.now() / 1000;
              } else {
                 return false; //token expired
              }
            } else {
              return false; //token doesn´t exist
            }
         } catch (err) {
            console.log(err);
            return false;
         }
      };

      var _revalidateSession = function() {
         _sessionDateExpiration = Date.now() / 1000 + _sessionTimeoutInSeconds;
      };

      var _login = function() {
         if (_isLoggedIn()) {
            return $q(function(resolve, reject) {
               resolve(true);
            });
         }
         //guarantee that the user is not logged
         _logout();

         return DigestAuthUtils
                        .login( settings.Indexer.indexManagementApiBaseUrl + '/login', adminUsername, adminPassword)
                        .then(function(httpResult) {
                           _saveToken(httpResult.data.token);
                           _revalidateSession();

                           return httpResult.data;
                        }).catch(function(error) {
                           console.log("Error while processing login, error = [" + JSON.stringify(error.data) + "]");
                           if (!error.data || !error.data.message) {
                              //network error
                              error.message = messages.serverCommunicationError;
                           } else {
                              if (error.status == 401) {
                                 error.message = messages.login.invalidCredentials;
                              } else {
                                 error.message = error.data.message;
                              }
                           }
                           throw error;
                        });
      };

      var _logout = function() {
         $window.localStorage.removeItem(_tokenName);
         _sessionDateExpiration = undefined;
      };

      var _addAuthorization = function(httpConfig) {
         if (httpConfig.headers === undefined) {
            httpConfig.headers = {};
         }
         httpConfig.headers.Authorization = 'Bearer ' + _getToken();
         return httpConfig;
      }
      /***********************************************************************
      ************************END: AUTHENTICATION SERVICES********************
      ***********************************************************************/
      var _handleError = function(error) {
         if (!error.data || !error.data.message) {
           //network error
           if (!error.message) {
             error.message = messages.serverCommunicationError;
           }
         } else {
           if (error.status == 401) {
              error.message = messages.security.accessDenied;
           } else {
              error.message = error.data.message;
           }
         }
         throw error;
      }

      var _get = function(url, httpConfig) {
         if (httpConfig === undefined) {
            httpConfig = {};
         }
         return   _login()
                  .then(function() {
                     return $http.get(settings.Indexer.indexManagementApiBaseUrl  + url, _addAuthorization(httpConfig));
                  }).catch(function(error) {
                     _handleError(error);
                  });
      }

      var _post = function(url, body, httpConfig) {
         if (httpConfig === undefined) {
            httpConfig = {};
         }
         return _login()
                .then(function() {
                   return $http.post(settings.Indexer.indexManagementApiBaseUrl  + url, body, _addAuthorization(httpConfig));
                }).catch(function(error) {
                   _handleError(error);
                });
      }

      indexerService.getInfoStatus = function() {
         return _get("/infoStatus")
                  .then(function (result) {
                     return result.data;
                  });
      }

      indexerService.index = function() {
         return _get("/index")
                  .then(function (result) {
                     return result.data;
                  });
      }

      indexerService.clearIndex = function() {
         return _get("/clearIndex")
                  .then(function (result) {
                     return result.data;
                  });
      }

      indexerService.clearLogs = function() {
         return _get("/clearLogs")
                  .then(function (result) {
                     return result.data;
                  });
      }

      indexerService.stopIndexing = function() {
         return _get("/stopIndexing")
                  .then(function (result) {
                     return result.data;
                  });
      }

      indexerService.getLogsGrid = function(paginationOptions) {
         return _post("/executionLogsGrid", {
                        paginationOptions: paginationOptions
                     }).then(function (result) {
                        return result.data;
                     });
      }

      indexerService.getModulesLogs = function (indexerExecutionLogId) {
         return _get("/modulesExecutionLogs/" + indexerExecutionLogId)
                     .then(function (result) {
                        return result.data;
                     });
      }

   }
})();
