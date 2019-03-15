(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewFolderModalInstanceController', NewFolderModalInstanceController);

   NewFolderModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                                'PublicFinancesService',
                                                'messages', 'Utils',
                                                'params', 'uuid' ];
   function NewFolderModalInstanceController( $uibModalInstance, $scope,
                                              PublicFinancesService,
                                              messages, Utils,
                                              params, uuid ) {
      var $modalCtrl = this;

      $modalCtrl.description = "";

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.uniqueDescriptionValidator = function() {
         var description = $modalCtrl.newFolderForm.description.$viewValue;
         if (description) {
            return PublicFinancesService.checkUniqueDescription(params.folderId, description);
         } else {
            return true;
         }
      }

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.isValid = function() {
         return $modalCtrl.newFolderForm.$valid;
      }

      $modalCtrl.ok = function () {
         $modalCtrl.newFolderForm.$setSubmitted();
         if ($modalCtrl.isValid()) {
            var newFolder = {
               name: uuid.v4(),
               description: $modalCtrl.description,
               folder: params.folderId
            }
            PublicFinancesService
            .newFolder(newFolder)
            .then(function(result) {
               newFolder.id = result.id;
               $uibModalInstance.close(newFolder);
            }).catch(function(error) {
               $modalCtrl.errorMessage = error.message;
            });
         }
      }
   }
})();
