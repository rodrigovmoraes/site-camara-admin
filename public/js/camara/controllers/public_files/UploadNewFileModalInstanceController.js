(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('UploadNewFileModalInstanceController', UploadNewFileModalInstanceController);

   UploadNewFileModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                                    'PublicFilesService',
                                                    'messages', 'Utils', 'params' ];
   function UploadNewFileModalInstanceController( $uibModalInstance, $scope,
                                                  PublicFilesService,
                                                  messages, Utils, params ) {
      var $modalCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.uploader = PublicFilesService.getFileUploader(params.folderId);
      $modalCtrl.fileDescription = "";
      $modalCtrl.uniqueDescriptionValidator = function() {
         var description = $modalCtrl.uploadNewFileForm.fileDescription.$viewValue;
         if (description) {
            return PublicFilesService.checkUniqueDescription(params.folderId, description);
         } else {
            return true;
         }
      }

      $modalCtrl.removeFileItem = function(item) {
         if(item) {
            item.remove();
         }
         if ($modalCtrl.file) {
            var filePath = $modalCtrl.file.folderPath + "/" + $modalCtrl.file.name;
            $modalCtrl.file = null;
            $modalCtrl.uploadFileErrorMessage = "";
            if (filePath) {
               PublicFilesService
               .removeRawFile(filePath)
               .catch(function(error) {
                  $modalCtrl.errorMessage = error.message;
               });
            }
         }
      }

      $modalCtrl.uploader.onSuccessItem  = function( item, response,
                                                     status, headers ) {
         $modalCtrl.uploadFileErrorMessage = "";
         $modalCtrl.file = response.file;
      };

      //set the name of uploaded file
      $modalCtrl.uploader.onErrorItem  = function( item, response,
                                                   status, headers ) {
         $modalCtrl.uploadFileErrorMessage = response.message;
         $modalCtrl.uploadedFile = null;
      };

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.isValid = function() {
         return $modalCtrl.uploadNewFileForm.$valid && $modalCtrl.file;
      }

      $modalCtrl.ok = function () {
         $modalCtrl.uploadNewFileForm.$setSubmitted();
         if ($modalCtrl.isValid()) {
            $modalCtrl.file.description = $modalCtrl.fileDescription;
            PublicFilesService
            .newFile($modalCtrl.file)
            .then(function(result) {
               $modalCtrl.file.id = result.id;
               $uibModalInstance.close($modalCtrl.file);
            }).catch(function(error) {
               $modalCtrl.errorMessage = error.message;
            });
         }
      }
   }
})();
