(function() {
   'use strict';

   /* Setup blank page controller */
   angular.module('SiteCamaraAdminApp').controller('TestSecurityController', TestSecurityController);

   TestSecurityController.$inject = ['HttpDispatcherService']
   function TestSecurityController(HttpDispatcherService){
      var $ctrl = this;

      $ctrl.message = "";

      $ctrl.test = function() {
         HttpDispatcherService.get('/test')
            .then(function(result){
                 console.log("OK");
                 $ctrl.message = result.data.message;
            }).catch(function(error){
                 $ctrl.message = error.message;
            });
      }

   }
}());
