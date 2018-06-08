(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('HttpDispatcherService', HttpDispatcherService);

   HttpDispatcherService.$inject = [ '$http',
                                     '$state',
                                     'settings',
                                     'messages',
                                     'AuthenticationService'];
   function HttpDispatcherService( $http,
                                   $state,
                                   settings,
                                   messages,
                                   AuthenticationService) {
      var httpDispatcher = this;

      //add token to the header request
      var _addAuthorization = function(httpConfig) {
         if(httpConfig.headers === undefined) {
            httpConfig.headers = {};
         }
         httpConfig.headers.Authorization = 'Bearer ' + AuthenticationService.getToken();
         return httpConfig;
      }

      //map errors received from the server to appropriate error message
      var _handleError = function(error) {
         if(!error.data || !error.data.message) {
           //network error
           error.message = messages.serverCommunicationError;
        } else {
           if (error.status == 401) {
              error.message = messages.security.accessDenied;
              AuthenticationService.logout();
              $state.go('login', { 'page': $state.current.name,
                                   'errorMessage':  error.message });
           } else {
              error.message = error.data.message;
           }
        }
        throw error;
      }

      //handle get http request
      httpDispatcher.get = function(url, httpConfig) {
         if(httpConfig === undefined) {
            httpConfig = {};
         }
         return $http
                  .get(settings.baseUrlSiteCamaraApi  + url, _addAuthorization(httpConfig))
                  .catch(function(error){
                     _handleError(error);
                  });
      };

      //handle post http request
      httpDispatcher.post = function(url, data, httpConfig) {
         if(httpConfig === undefined) {
            httpConfig = {};
         }
         return  $http
                    .post(settings.baseUrlSiteCamaraApi  + url, data, _addAuthorization(httpConfig))
                    .catch(function(error) {
                       _handleError(error);
                    });
      };

      //handle put http request
      httpDispatcher.put = function(url, data, httpConfig) {
         if(httpConfig === undefined) {
            httpConfig = {};
         }
         return  $http
                     .put(settings.baseUrlSiteCamaraApi  + url, data, _addAuthorization(httpConfig))
                     .catch(function(error) {
                       _handleError(error);
                     });
      };

      //handle delete http request
      httpDispatcher.delete = function(url, httpConfig) {
         if(httpConfig === undefined) {
            httpConfig = {};
         }
         return  $http
                  .delete(settings.baseUrlSiteCamaraApi  + url, _addAuthorization(httpConfig))
                  .catch(function(error) {
                     _handleError(error);
                  });
      };

   }

})();
