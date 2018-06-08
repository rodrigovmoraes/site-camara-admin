(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('LoginModalInstanceCtrl', LoginModalInstanceCtrl);

   LoginModalInstanceCtrl.$inject = ['$uibModalInstance', '$scope', '$state', '$stateParams', 'AuthenticationService'];
   function LoginModalInstanceCtrl($uibModalInstance, $scope, $state, $stateParams, AuthenticationService) {
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
            $state.go($scope.page || 'dashboard', $stateParams, { reload: true, inherit: false, notify: true });
            $scope.$emit('metronicReloadSidebar');
         })
         .catch(function(error){
            $modalCtrl.errorMessage = error.message;
         });
      }
   }
})();
