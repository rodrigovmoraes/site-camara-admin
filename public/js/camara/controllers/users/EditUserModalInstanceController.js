(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('EditUserModalInstanceController', EditUserModalInstanceController);

   EditUserModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                               'UserService', 'UserGroupService',
                                               'SecurityRoleService', 'user',
                                               'messages', 'Utils'];
   function EditUserModalInstanceController( $uibModalInstance, $scope,
                                             UserService, UserGroupService,
                                             SecurityRoleService, user,
                                             messages, Utils ) {
      var $modalCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //set form values
      $modalCtrl.user = user;
      $modalCtrl.username = user.username;
      $modalCtrl.name = user.name;
      $modalCtrl.email = user.email;
      $modalCtrl.status = user.status;
      $modalCtrl.keepPassword = 'true';
      $modalCtrl.status = user.status;
      $modalCtrl.selectedRoles = [];

      //list data
      UserGroupService.getGroups().then(function(result) {
         $modalCtrl.primaryGroups = result.userGroups;
         $modalCtrl.selectedPrimaryGroup = user.primaryGroup;
         $modalCtrl.secondaryGroups = result.userGroups;
         $modalCtrl.selectedSecondaryGroups = user.secondaryGroups;
      }).catch(function(error){
         $modalCtrl.errorMessage = error.message;
      });

      SecurityRoleService.getSecurityRoles().then(function(result) {
         $modalCtrl.roles = result.securityRoles;
         $modalCtrl.selectedRoles = user.roles;
      }).catch(function(error) {
         $modalCtrl.errorMessage = error.message;
      });

      //control tabs
      $modalCtrl.isGeneralTabActive = true;
      $modalCtrl.isSecurityTabActive = false;
      $modalCtrl.isPasswordTabActive = false;

      $modalCtrl.setGeneralTabActive = function() {
         $modalCtrl.isGeneralTabActive = true;
         $modalCtrl.isSecurityTabActive = false;
         $modalCtrl.isPasswordTabActive = false;
      }

      $modalCtrl.setSecurityTabActive = function() {
         $modalCtrl.isGeneralTabActive = false;
         $modalCtrl.isSecurityTabActive = true;
         $modalCtrl.isPasswordTabActive = false;
      }

      $modalCtrl.setPasswordTabActive = function(){
         $modalCtrl.isGeneralTabActive = false;
         $modalCtrl.isSecurityTabActive = false;
         $modalCtrl.isPasswordTabActive = true;
      }

      var openFirstInvalidTab = function() {
         //NOTE: "second tab - security" doesn't have a field that is
         //subjected to the validation. If an field is added to the second
         //tab (security tab), it should be checked if this field has to be
         //added here
         if( $scope.editUserForm.name.$invalid ||
             $scope.editUserForm.email.$invalid ) {
            //first tab - general
            $modalCtrl.setGeneralTabActive();
         }else if( $scope.editUserForm.password.$invalid ||
                   $scope.editUserForm.password_check.$invalid ){
            //third tab - password
            $modalCtrl.setPasswordTabActive();
         }

      }

      //form validation
      $modalCtrl.isValid = function() {
         return $scope.editUserForm.$valid;
      }

      $modalCtrl.uniqueEmailValidator = function() {
         var email = $scope.editUserForm.email.$viewValue;
         if(email && email !== user.email) {
            //check if the email was changed
            return UserService.checkUniqueEmail(email);
         } else {
            return true;
         }
      }

      //modal controls
      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.ok = function () {
         $scope.editUserForm.$setSubmitted();
         if($modalCtrl.isValid()) {
            var editedUser = {  "_id" : $modalCtrl.user._id,
                                "name" : $modalCtrl.name,
                                "email" : $modalCtrl.email,
                                "status" : $modalCtrl.status,
                                "primaryGroup" : $modalCtrl.selectedPrimaryGroup,
                                "secondaryGroups" : $modalCtrl.selectedSecondaryGroups,
                                "roles": $modalCtrl.selectedRoles,
                                "password" : $modalCtrl.password,
                                "keepPassword" : $modalCtrl.keepPassword
                          };
            UserService.saveUser(editedUser).then(function(result){
               $uibModalInstance.close( _templateMessage( messages.userChanged,
                                                          { 'username': $modalCtrl.username }));
            }).catch(function(error){
               $modalCtrl.errorMessage = error.message;
            });
         } else {
            openFirstInvalidTab();
         }
      }
   }
})();
