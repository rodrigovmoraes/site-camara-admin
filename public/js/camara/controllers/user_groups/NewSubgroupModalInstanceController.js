(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewSubgroupModalInstanceController', NewSubgroupModalInstanceController);

   NewSubgroupModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                                  'UserService', 'UserGroupService',
                                                  'messages', 'Utils', 'parentGroup' ];
   function NewSubgroupModalInstanceController( $uibModalInstance, $scope,
                                                UserService, UserGroupService,
                                                messages, Utils, parentGroup ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      $modalCtrl.parentGroupCompleteName = parentGroup.completeName;

      //form data
      $modalCtrl.name = "";

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.uniqueGroupNameValidator = function () {
         var groupName = $scope.newSubgroupForm.name.$viewValue;
         if(groupName) {
            //check if an subgroup already exists with the same name
            //in the parent group
            return UserGroupService.checkUniqueNameInTheGroup(parentGroup._id, groupName);
         } else {
            return true;
         }
      }

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.isValid = function() {
         return $scope.newSubgroupForm.$valid;
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
         $scope.newSubgroupForm.$setSubmitted();
         if($modalCtrl.isValid()) {
            //save
            var newGroup = { "name" : $modalCtrl.name,
                             "completeName" : _buildCompleteName( parentGroup.completeName,
                                                                  $modalCtrl.name)
                           };
            App.blockUI();
            UserGroupService.newGroup(newGroup).then(function(result) {
               //add the new user group to parent
               parentGroup.children.unshift(result.id);
               return UserGroupService.saveGroup(parentGroup);
            }).then(function(result) {
               $uibModalInstance.close( _templateMessage( messages.subUserGroupAdded,
                                                          { 'subgroupName': newGroup.name,
                                                            'groupName': parentGroup.name
                                                          }));
            }).catch(function(err) {
               $modalCtrl.setErrorMessage(err.message);
               App.unblockUI();
            });
         }
      }
   }
})();
