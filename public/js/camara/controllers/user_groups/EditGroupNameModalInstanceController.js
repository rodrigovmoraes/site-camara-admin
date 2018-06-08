(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('EditGroupNameModalInstanceController', EditGroupNameModalInstanceController);

   EditGroupNameModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                                    'UserService', 'UserGroupService',
                                                    'messages', 'Utils',
                                                    'parentGroup', 'group' ];
   function EditGroupNameModalInstanceController( $uibModalInstance, $scope,
                                                  UserService, UserGroupService,
                                                  messages, Utils,
                                                  parentGroup, group ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.groupCompleteName = group.completeName;

      //form data
      var oldGroupName = group.name;
      $modalCtrl.name = group.name;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.uniqueGroupNameValidator = function () {
         var groupName = $scope.editGroupNameForm.name.$viewValue;
         if(groupName && groupName !== oldGroupName) {
            //check if an subgroup already exists with the same name
            //in the parent group
            return UserGroupService
                     .checkUniqueNameInTheGroup( parentGroup ? parentGroup._id : null,
                                                 groupName );
         } else {
            return true;
         }
      }

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.isValid = function() {
         return $scope.editGroupNameForm.$valid;
      }

      var _buildCompleteName = function(parentName, name) {
         var completeName = "";
         if(parentName !== '') {
            completeName = parentName + " > " + name;
         } else {
            completeName = name ;
         }
         return completeName;
      }

      $modalCtrl.ok = function () {
         $scope.editGroupNameForm.$setSubmitted();
         if($modalCtrl.isValid()) {
            var oldGroupName = group.name;
            //save
            group.name = $modalCtrl.name;
            group.completeName = _buildCompleteName( parentGroup ? parentGroup.completeName : '',
                                                     $modalCtrl.name );
            App.blockUI();
            UserGroupService.saveGroup(group).then(function(result) {
               $uibModalInstance.close( _templateMessage( messages.userGroupNameChanged,
                                                          { 'oldGroupName': oldGroupName,
                                                            'newGroupName': group.name
                                                          })
                                      );
            }).catch(function(err) {
               $modalCtrl.setErrorMessage(err.message);
               App.unblockUI();
            });
         }
      }
   }
})();
