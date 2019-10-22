(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('ChangeUserPasswordController', ChangeUserPasswordController);

   ChangeUserPasswordController.$inject = [ '$scope', 'messages',
                                            'Utils', '$state',
                                            'UserService', 'settings'];
   function ChangeUserPasswordController( $scope, messages,
                                          Utils, $state,
                                          UserService, settings ) {
      var $userChangePasswordCtrl = this;

      //messages control
      Utils.applyMessageControls($userChangePasswordCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $userChangePasswordCtrl.actualPassword = null;
      $userChangePasswordCtrl.newPassword = null;
      $userChangePasswordCtrl.confirmNewPassword = null;
      $userChangePasswordCtrl.disableSubmit = false;

      $userChangePasswordCtrl.confirmNewPasswordValidator = function() {
         if ($userChangePasswordCtrl.changePasswordForm.newPassword.$viewValue &&
               $userChangePasswordCtrl.changePasswordForm.confirmNewPassword.$viewValue) {
            return $userChangePasswordCtrl.changePasswordForm.newPassword.$viewValue === $userChangePasswordCtrl.changePasswordForm.confirmNewPassword.$viewValue;
         } else {
            return true;
         }
      }

      $userChangePasswordCtrl.isValid = function() {
         return $userChangePasswordCtrl.changePasswordForm.$valid
      }

      $userChangePasswordCtrl.save = function () {
         $userChangePasswordCtrl.changePasswordForm.$setSubmitted();
         if ($userChangePasswordCtrl.isValid()) {
            UserService.changePassword($userChangePasswordCtrl.actualPassword, $userChangePasswordCtrl.newPassword)
                       .then(function(result) {
               //ok - the password was changed
               $userChangePasswordCtrl.setMessage(messages.userPasswordChanged);
               $userChangePasswordCtrl.disableSubmit = true;
            }).catch(function(error) {
               if (error.data && error.data.passwordError) {
                  //the user put wrong password
                  $userChangePasswordCtrl.setErrorMessage(messages.userPasswordChangedActualPasswordError);
               } else {
                  $userChangePasswordCtrl.setErrorMessage(error.message);
               }

            });
         }
      }

      //run digest if the password was changed, this ensures
      //that the confirmNewPasswordValidator will be checked
      $scope.$watch("$userChangePasswordCtrl.newPassword", function (newValue, oldValue) {
         //keywords updated
         if (newValue != oldValue) {
            $userChangePasswordCtrl.changePasswordForm.confirmNewPassword.$setDirty();
            $userChangePasswordCtrl.changePasswordForm.confirmNewPassword.$validate();
         }
      });

      $userChangePasswordCtrl.close = function () {
         $state.go('dashboard');
      }
   }
})();
