(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('LoginController', LoginController);

   LoginController.$inject = ['$uibModal', '$scope', '$stateParams', 'AuthenticationService'];
   function LoginController($uibModal, $scope, $stateParams, AuthenticationService) {
      var $ctrl = this;

      $scope.page = $stateParams.page;
      $scope.errorMessage = $stateParams.errorMessage;

      $ctrl.open = function() {
          $ctrl.modalInstance = $uibModal.open({
            templateUrl: 'loginModalContent.html',
            backdrop: 'static',
            keyboard  : false,
            backdropClass: 'login-backdrop',
            animation: false,
            size: 'sm',
            controller: 'LoginModalInstanceCtrl',
            controllerAs: '$modalCtrl',
            scope: $scope,
            windowTopClass: 'top10' 
          });
      };

      $ctrl.close = function() {
         $ctrl.modalInstance.close();
      };

      $scope.$on('$viewContentLoaded', function() {
            $ctrl.open();
      });

   }
})();
