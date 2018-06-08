(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('UserGroupService', UserGroupService);

   UserGroupService.$inject = ['HttpDispatcherService', '$q'];
   function UserGroupService(HttpDispatcherService, $q) {
      var userGroupService = this;

      userGroupService.getGroups = function () {
         return HttpDispatcherService.get('/userGroups').then(function(result) {
                                            return result.data;
                                         }).catch(function(error) {
                                            throw error
                                         });
      }

      userGroupService.getGroupsTree = function () {
         return HttpDispatcherService.get('/userGroupsTree').then(function(result) {
                                            return result.data;
                                         }).catch(function(error) {
                                            throw error
                                         });
      }

      userGroupService.saveGroup = function (userGroup) {
         return HttpDispatcherService.post( '/userGroup',
                                            { 'userGroup':  userGroup }
                                          ).then(function(result) {
                                             return result.data;
                                          }).catch(function(error) {
                                             throw error
                                          });
      }

      userGroupService.newGroup = function (userGroup) {
         return HttpDispatcherService.put( '/userGroup',
                                           { 'userGroup':  userGroup })
                                         .then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      userGroupService.deleteDeeplyGroup = function (userGroupId) {
         return HttpDispatcherService.delete( '/userGroup/deeply/' + userGroupId)
                                     .then(function(result) {
                                          return result.data;
                                     }).catch(function(error) {
                                          throw error
                                     });
      }

      userGroupService.checkUniqueNameInTheGroup = function (parentGroupId, groupName) {
          var defer = $q.defer();
          HttpDispatcherService.get('/checkUniqueNameInTheGroup/' + parentGroupId + "/" + groupName)
                               .then(function(result) {
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

      userGroupService.getUsers = function (groupId) {
         return HttpDispatcherService.get('/usersFromGroup/' + groupId).then(function(result) {
                                            return result.data;
                                         }).catch(function(error) {
                                            throw error
                                         });
      }
   }
})();
