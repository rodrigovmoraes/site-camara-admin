(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('PublicFilesListController', PublicFilesListController);

   PublicFilesListController.$inject = [ '$scope', 'messages',
                                         'Utils', '$stateParams',
                                         'PublicFilesService',
                                         'settings', 'objects',
                                         'folderPath', '$uibModal']
   function PublicFilesListController( $scope, messages,
                                       Utils, $stateParams,
                                       PublicFilesService,
                                       settings, objects,
                                       folderPath, $uibModal ) {
      var $publicFilesListCtrl = this;

      //messages control
      Utils.applyMessageControls($publicFilesListCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //refresh the content of the current folder
      var _refresh = function () {
         return PublicFilesService
               .getFolderContents($stateParams.folderId)
               .then(function(result) {
                  $publicFilesListCtrl.highlightObjectId = PublicFilesService.getHighlightObjectId();
                  $publicFilesListCtrl.objects = result.objects;
               });
      }

      //messages
      $publicFilesListCtrl.errorMessage = $stateParams.errorMessage;
      $publicFilesListCtrl.infoMessage = $stateParams.infoMessage;
      $publicFilesListCtrl.notFoundMessage = messages.publicFilesFolderEmpty;
      $publicFilesListCtrl.objects = objects;
      $publicFilesListCtrl.folderPath = folderPath;
      $publicFilesListCtrl.highlightObjectId = null;
      $publicFilesListCtrl.formatFileSize = function(size) {
         return Utils.formatFileSize(size);
      };
      $publicFilesListCtrl.fileDownloadURL = settings.baseUrlSiteCamaraApi + settings.PublicFiles.fileDownloadPath;

      $publicFilesListCtrl.openNewFolderModal = function() {
         $publicFilesListCtrl.newFolderModalInstance = $uibModal.open({
           templateUrl: 'newFolder.html',
           animation: false,
           size: 'l',
           controller: 'NewFolderModalInstanceController',
           controllerAs: '$modalCtrl',
           scope: $scope,
           resolve: {
               params: {
                  'folderId': $stateParams.folderId
               }
           }
         });

         $publicFilesListCtrl
            .newFolderModalInstance
            .result
            .then(function(folderItem) {
               PublicFilesService.setHighlightObjectId(folderItem.id);
               $publicFilesListCtrl.infoMessage = _templateMessage( messages.publicFilesFolderCreated,
                                                                       { 'folderDescription': folderItem.description } );
               return _refresh();
            }).catch(function(error) {
               $publicFilesListCtrl.errorMessage = error.message;
            });
      }

      $publicFilesListCtrl.openUploadNewFileModal = function() {
         $publicFilesListCtrl.uploadNewFileModalInstance = $uibModal.open({
           templateUrl: 'uploadNewFile.html',
           animation: false,
           size: 'lg',
           controller: 'UploadNewFileModalInstanceController',
           controllerAs: '$modalCtrl',
           scope: $scope,
           resolve: {
               params: {
                  'folderId': $stateParams.folderId
               }
           }
         });

         $publicFilesListCtrl
            .uploadNewFileModalInstance
            .result
            .then(function(fileItem) {
               PublicFilesService.setHighlightObjectId(fileItem.id);
               $publicFilesListCtrl.infoMessage = _templateMessage( messages.publicFilesFileCreated,
                                                                       { 'fileDescription': fileItem.description } );
               return _refresh();
            }).catch(function(error) {
               $publicFilesListCtrl.errorMessage = error.message;
            });
      }

      $publicFilesListCtrl.openChangeFolderDescriptionModal = function(folderItem) {
         $publicFilesListCtrl.changeFolderDescriptionModalInstance = $uibModal.open({
           templateUrl: 'changeFolderDescription.html',
           animation: false,
           size: 'l',
           controller: 'ChangeFolderDescriptionModalInstanceController',
           controllerAs: '$modalCtrl',
           scope: $scope,
           resolve: {
               params: {
                  'folder': folderItem,
                  'parentFolderId': $stateParams.folderId
               }
           }
         });

         $publicFilesListCtrl
            .changeFolderDescriptionModalInstance
            .result
            .then(function(folderItem) {
               PublicFilesService.setHighlightObjectId(folderItem.id);
               $publicFilesListCtrl.infoMessage = _templateMessage( messages.publicFilesFolderCreated,
                                                                       { 'folderDescription': folderItem.description } );
               return _refresh();
            }).catch(function(error) {
               $publicFilesListCtrl.errorMessage = error.message;
            });
      }

      $publicFilesListCtrl.removeFile = function(fileItem) {
         $uibModal.open({
            templateUrl: 'tpl/camara/includes/confirm.html',
            animation: false,
            size: 'md',
            controller: 'ConfirmModalInstanceController',
            controllerAs: '$modalCtrl',
            scope: $scope,
            resolve: {
               texts: {
                  'message': _templateMessage( messages.publicFilesFileRemoveDialogText,
                                               { 'fileDescription': fileItem.description } )
               }
            }
         }).result.then(function() {
            return PublicFilesService
                   .removeFile(fileItem._id)
                   .then(function(result) {
                     PublicFilesService.setHighlightObjectId(null);
                     $publicFilesListCtrl.infoMessage = _templateMessage( messages.publicFilesFileRemoved,
                                                                             { 'fileDescription': fileItem.description } )
                     return _refresh();
                  }).catch(function(error) {
                     $publicFilesListCtrl.errorMessage = error.message;
                  });
         });

      }

      $publicFilesListCtrl.removeFolder = function(folderItem) {
         PublicFilesService
         .getAmountOfObjectsInFolder(folderItem._id)
         .then(function(result) {
            var amount = result.amount;

            if (amount > 0) {
               $uibModal.open({
                  templateUrl: 'tpl/camara/includes/message.html',
                  animation: false,
                  size: 'md',
                  controller: 'MessageModalInstanceController',
                  controllerAs: '$modalCtrl',
                  scope: $scope,
                  resolve: {
                     texts: {
                        'message': _templateMessage( messages.publicFilesFolderNotEmptyToBeRemovedDialogText )
                     }
                  }
               });
            } else {
               $uibModal.open({
                  templateUrl: 'tpl/camara/includes/confirm.html',
                  animation: false,
                  size: 'md',
                  controller: 'ConfirmModalInstanceController',
                  controllerAs: '$modalCtrl',
                  scope: $scope,
                  resolve: {
                     texts: {
                        'message': _templateMessage( messages.publicFilesFolderRemoveDialogText,
                                                     { 'folderDescription': folderItem.description } )
                     }
                  }
               }).result.then(function() {
                  return PublicFilesService
                         .removeFolder(folderItem._id)
                         .then(function(result) {
                           PublicFilesService.setHighlightObjectId(null);
                           $publicFilesListCtrl.infoMessage = _templateMessage( messages.publicFilesFolderRemoved,
                                                                                   { 'folderDescription': folderItem.description } )
                           return _refresh();
                        }).catch(function(error) {
                           $publicFilesListCtrl.errorMessage = error.message;
                        });
               });
            }

         }).catch(function(error) {
            $publicFilesListCtrl.errorMessage = error.message;
         });
      }



      $publicFilesListCtrl.moveFolderUp = function(folderItem) {
         PublicFilesService
         .moveFolderUp(folderItem._id)
         .then(function(result) {
            PublicFilesService.setHighlightObjectId(folderItem._id);
            $publicFilesListCtrl.infoMessage = _templateMessage( messages.publicFilesFolderMovedUp,
                                                                    { 'folderDescription': folderItem.description } );
            return _refresh();
         }).catch(function(error) {
            $publicFilesListCtrl.errorMessage = error.message;
         });
      }

      $publicFilesListCtrl.moveFolderDown = function(folderItem) {
         PublicFilesService
         .moveFolderDown(folderItem._id)
         .then(function(result) {
            PublicFilesService.setHighlightObjectId(folderItem._id);
            $publicFilesListCtrl.infoMessage = _templateMessage( messages.publicFilesFolderMovedDown,
                                                                    { 'folderDescription': folderItem.description } );
            return _refresh();
         }).catch(function(error) {
            $publicFilesListCtrl.errorMessage = error.message;
         });
      }

      $publicFilesListCtrl.moveFileUp = function(fileItem) {
         PublicFilesService
         .moveFileUp(fileItem._id)
         .then(function(result) {
            PublicFilesService.setHighlightObjectId(fileItem._id);
            $publicFilesListCtrl.infoMessage = _templateMessage( messages.publicFilesFileMovedUp,
                                                                    { 'fileDescription': fileItem.description } );
            return _refresh();
         }).catch(function(error) {
            $publicFilesListCtrl.errorMessage = error.message;
         });
      }

      $publicFilesListCtrl.moveFileDown = function(fileItem) {
         PublicFilesService
         .moveFileDown(fileItem._id)
         .then(function(result) {
            PublicFilesService.setHighlightObjectId(fileItem._id);
            $publicFilesListCtrl.infoMessage = _templateMessage( messages.publicFilesFileMovedDown,
                                                                    { 'fileDescription': fileItem.description } );
            return _refresh();
         }).catch(function(error) {
            $publicFilesListCtrl.errorMessage = error.message;
         });
      }

   }
})();
