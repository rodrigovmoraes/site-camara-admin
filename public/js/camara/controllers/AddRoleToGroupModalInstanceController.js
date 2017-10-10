(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('AddRoleToGroupModalInstanceController', AddRoleToGroupModalInstanceController);

   AddRoleToGroupModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                                     'UserService', 'UserGroupService',
                                                     'messages', 'Utils',
                                                     'parentGroup', 'SecurityRoleService' ];
   function AddRoleToGroupModalInstanceController( $uibModalInstance, $scope,
                                                   UserService, UserGroupService,
                                                   messages, Utils,
                                                   parentGroup, SecurityRoleService ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.selectedRoles = [];

      //get roles
      $modalCtrl.roles = [];
      SecurityRoleService.getSecurityRoles().then(function(result) {
         $modalCtrl.roles = Utils.filterAlreadyAddedElements(result.securityRoles, parentGroup.roles);
      }).catch(function(error) {
         $modalCtrl.errorMessage = error.message;
      });

      $modalCtrl.parentGroupCompleteName = parentGroup.completeName;

      //form data
      $modalCtrl.name = "";

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.isValid = function() {
         return $scope.addRoleToGroupForm.$valid;
      }

      $modalCtrl.ok = function() {
         if( $modalCtrl.selectedRoles &&
             parentGroup &&
             $modalCtrl.selectedRoles.length > 0) {
               App.blockUI();
               //add selected roles to the group
               var i;
               var roles = [];
               $modalCtrl.selectedRoles.forEach(function(role) {
                  roles.push(role);
               });
               //add the current roles
               if(parentGroup.roles) {
                  parentGroup.roles.forEach(function(role) {
                     roles.push(role);
                  });
               }
               parentGroup.roles = roles;
               //save the group
               UserGroupService.saveGroup(parentGroup).then(function(result) {
                  $uibModalInstance.close("Permissões adicionadas no grupo " + parentGroup.name);
               }).catch(function(err) {
                  $modalCtrl.setErrorMessage(err.message);
                  App.unblockUI();
               });
         } else {
            $uibModalInstance.dismiss('cancel');
         }
      }
   }
})();
