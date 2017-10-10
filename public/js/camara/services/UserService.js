(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('UserService', UserService);

   UserService.$inject = ['HttpDispatcherService', '$q'];
   function UserService(HttpDispatcherService, $q) {
      var userService = this;

      userService.checkUniqueUsername = function(username) {
         var defer = $q.defer();
         HttpDispatcherService.get('/checkUniqueUsername/' + username).then(function(result) {
                                      var resultData = result.data;
                                      if(!resultData.exists) {
                                         defer.resolve(result.data)
                                      } else {
                                         defer.reject(result.data);
                                      }
                                  }).catch(function(error) {
                                       defer.reject(error);
                                  });
         return defer.promise;
      }

      userService.checkUniqueEmail = function(email) {
         var defer = $q.defer();
         HttpDispatcherService.get('/checkUniqueEmail/' + email).then(function(result) {
                                      var resultData = result.data;
                                      if(!resultData.exists) {
                                         defer.resolve(result.data)
                                      } else {
                                         defer.reject(result.data);
                                      }
                                  }).catch(function(error) {
                                      defer.reject(error);
                                  });
         return  defer.promise;
      }

      userService.newUser = function(user) {
         return HttpDispatcherService.put('/user', { 'user':  user}).then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      userService.saveUser = function(user) {
         return HttpDispatcherService.post('/user', { 'user':  user }).then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      userService.getUser = function(id) {
         return HttpDispatcherService.get('/user/' + id,).then(function(result) {
                                             return result.data;
                                          }).catch(function(error) {
                                             throw error
                                          });
      }

      userService.getUsers = function(paginationOptions) {
         return HttpDispatcherService.post('/users',
                                           {
                                              paginationOptions: JSON.stringify(paginationOptions)
                                           }).then(function(result) {
                                                  return result.data;
                                           }).catch(function(error) {
                                                throw error
                                           });
      }
   }
})();
