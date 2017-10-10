(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('LoginModalInstanceCtrl', LoginModalInstanceCtrl);

   LoginModalInstanceCtrl.$inject = ['$uibModalInstance', '$scope', '$state', 'AuthenticationService'];
   function LoginModalInstanceCtrl($uibModalInstance, $scope, $state, AuthenticationService) {
      var $modalCtrl = this;
      $modalCtrl.username = "";
      $modalCtrl.password = "";
      if($scope.errorMessage) {
         $modalCtrl.errorMessage = $scope.errorMessage;
      } else {
         $modalCtrl.errorMessage = "";
      }

      $modalCtrl.close = function () {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.login = function() {
         AuthenticationService.login({
            username: $modalCtrl.username,
            password: $modalCtrl.password
         }, $modalCtrl.savePassword)
         .then(function(data){
            $modalCtrl.close();
            //Todo: we have to change this,
            //We have to redirect to the page desired by the user,
            //instead always returning the dashboard page
            $state.go($scope.page || 'dashboard');
         })
         .catch(function(error){
            $modalCtrl.errorMessage = error.message;
         });
      }
   }
})();
