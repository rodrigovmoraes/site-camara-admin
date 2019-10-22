(function() {
   'use strict';

   /* Setup blank page controller */
   angular.module('SiteCamaraAdminApp').controller('TestSecurityController', TestSecurityController);

   TestSecurityController.$inject = ['HttpDispatcherService', 'AuthenticationService']
   function TestSecurityController(HttpDispatcherService, AuthenticationService) {
      var $ctrl = this;

      $ctrl.message = "";

      $ctrl.testRole = false;

      AuthenticationService.checkAccess("role15").then(function(result) {
            $ctrl.testRole = !result;
      });

      $ctrl.test = function() {
         HttpDispatcherService.get('/test')
            .then(function(result) {
                 console.log("OK");
                 $ctrl.message = result.data.message;
            }).catch(function(error) {
                 $ctrl.message = error.message;
            });
      }

   }
}());
