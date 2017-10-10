(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('SecurityRoleService', SecurityRoleService);

   SecurityRoleService.$inject = ['HttpDispatcherService'];
   function SecurityRoleService(HttpDispatcherService) {
      var securityRoleService = this;

      securityRoleService.getSecurityRoles = function() {
         return HttpDispatcherService.get('/securityRoles').then(function(result) {
                                            return result.data;
                                         }).catch(function(error) {
                                            throw error
                                         });
      }
   }
})();
