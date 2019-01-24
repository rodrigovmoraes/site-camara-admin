(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewUserModalInstanceController', NewUserModalInstanceController);

   NewUserModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                              'UserService', 'UserGroupService',
                                              'messages', 'Utils' ];
   function NewUserModalInstanceController( $uibModalInstance, $scope,
                                            UserService, UserGroupService,
                                            messages, Utils ) {
      var $modalCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      UserGroupService.getGroups().then(function(result) {
         $modalCtrl.primaryGroups = result.userGroups;
      }).catch(function(error) {
         $modalCtrl.errorMessage = error.message;
      });

      $modalCtrl.uniqueUsernameValidator = function() {
         var username = $scope.newUserForm.username.$viewValue;
         if(username) {
            return UserService.checkUniqueUsername(username);
         } else {
            return true;
         }
      }

      $modalCtrl.selectedPrimaryGroup = null;

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.isValid = function() {
         return $scope.newUserForm.$valid;
      }

      var _getCompleteName = function() {

      }

      $modalCtrl.ok = function () {
         $scope.newUserForm.$setSubmitted();
         if($modalCtrl.isValid()) {
            var newUser = {  "username" : $modalCtrl.username,
                             "password" : $modalCtrl.password,
                             "name" : $modalCtrl.name,
                             "email" : $modalCtrl.email,
                             "primaryGroup" : $modalCtrl.selectedPrimaryGroup
                          };
            UserService.newUser(newUser).then(function(result) {
               $uibModalInstance.close({ 'message': _templateMessage( messages.userCreated, { 'username': $modalCtrl.username }),
                                         'id': result.id
                                       });
            }).catch(function(error) {
               $modalCtrl.errorMessage = error.message;
            });
         }
      }
   }
})();
