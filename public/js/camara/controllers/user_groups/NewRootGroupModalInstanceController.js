(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewRootGroupModalInstanceController', NewRootGroupModalInstanceController);

   NewRootGroupModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                                   'UserService', 'UserGroupService',
                                                   'messages', 'Utils' ];
   function NewRootGroupModalInstanceController( $uibModalInstance, $scope,
                                                 UserService, UserGroupService,
                                                 messages, Utils ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //form data
      $modalCtrl.name = "";

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.uniqueGroupNameValidator = function () {
         var groupName = $scope.newRootGroupForm.name.$viewValue;
         if(groupName) {
            //check if an root group already exists with the same name
            return UserGroupService.checkUniqueNameInTheGroup(null, groupName);
         } else {
            return true;
         }
      }

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.isValid = function() {
         return $scope.newRootGroupForm.$valid;
      }

      $modalCtrl.ok = function () {
         $scope.newRootGroupForm.$setSubmitted();
         if($modalCtrl.isValid()) {
            //save
            var newRootGroup = { "name" : $modalCtrl.name,
                                 "completeName" : $modalCtrl.name,
                                 "isRoot" : true
                           };
            App.blockUI();
            UserGroupService.newGroup(newRootGroup).then(function(result) {
               $uibModalInstance.close(_templateMessage( messages.newRootUserGroup,
                                                         { 'groupName': $modalCtrl.name }));
            }).catch(function(err) {
               $modalCtrl.setErrorMessage(err.message);
               App.unblockUI();
            });
         }
      }
   }
})();
