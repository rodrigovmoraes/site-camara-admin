(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('ChangeFolderDescriptionModalInstanceController', ChangeFolderDescriptionModalInstanceController);

   ChangeFolderDescriptionModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                                              'PublicFinancesService',
                                                              'messages', 'Utils',
                                                              'params', 'uuid' ];
   function ChangeFolderDescriptionModalInstanceController( $uibModalInstance, $scope,
                                                            PublicFinancesService,
                                                            messages, Utils,
                                                            params, uuid ) {
      var $modalCtrl = this;

      var _originalDescription = params.folder.description;

      $modalCtrl.description = params.folder.description;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.uniqueDescriptionValidator = function() {
         var description = $modalCtrl.changeFolderDescriptionForm.description.$viewValue;
         if (description !== _originalDescription) {
            return PublicFinancesService.checkUniqueDescription(params.parentFolderId, description);
         } else {
            return true;
         }
      }

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.isValid = function() {
         return $modalCtrl.changeFolderDescriptionForm.$valid;
      }

      $modalCtrl.ok = function () {
         $modalCtrl.changeFolderDescriptionForm.$setSubmitted();
         if ($modalCtrl.isValid()) {
            var newFolder = {
               id: params.folder._id,
               description: $modalCtrl.description
            }
            PublicFinancesService
            .editFolder(newFolder)
            .then(function(result) {
               $uibModalInstance.close(newFolder);
            }).catch(function(error) {
               $modalCtrl.errorMessage = error.message;
            });
         }
      }
   }
})();
