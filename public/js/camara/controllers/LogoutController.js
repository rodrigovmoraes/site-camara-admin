(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('LogoutController', LogoutController);

   LogoutController.$inject = ['$state', 'AuthenticationService'];
   function LogoutController($state, AuthenticationService) {
      var $ctrl = this;
      AuthenticationService.logout();
      $state.go("login");
   }
})();
